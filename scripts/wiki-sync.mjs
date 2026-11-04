#!/usr/bin/env node
// Sincroniza a pasta canônica wiki/ com o repositório Git da GitHub Wiki
// (https://github.com/darioreisjr/karasudo-site.wiki.git).
// Sem dependências externas; apenas Node.js.
//
//   node scripts/wiki-sync.mjs --check    valida integridade das páginas e links internos
//   node scripts/wiki-sync.mjs --push     sincroniza e envia alterações para o GitHub Wiki
//
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIKI_DIR = join(ROOT, 'wiki');

export function getWikiRemote() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (token) {
    return `https://x-access-token:${token}@github.com/darioreisjr/karasudo-site.wiki.git`;
  }
  return 'https://github.com/darioreisjr/karasudo-site.wiki.git';
}

export function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: opts.cwd || ROOT,
    encoding: 'utf8',
    stdio: opts.quiet ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'pipe', 'inherit'],
    ...opts,
  }).trim();
}

/**
 * Valida os arquivos da pasta wiki/
 */
export function checkWikiFiles(wikiDir = WIKI_DIR) {
  if (!existsSync(wikiDir)) {
    throw new Error(`Pasta da wiki não encontrada em: ${wikiDir}`);
  }

  const files = readdirSync(wikiDir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    throw new Error(`Nenhum arquivo .md encontrado na pasta ${wikiDir}`);
  }

  const pageNames = new Set(files.map((f) => f.replace(/\.md$/, '')));
  const errors = [];

  for (const file of files) {
    const fullPath = join(wikiDir, file);
    const content = readFileSync(fullPath, 'utf8');

    // Validação de blocos Mermaid
    const mermaidStarts = (content.match(/```mermaid/g) || []).length;
    const mermaidEnds = (content.match(/```\n/g) || []).length + (content.endsWith('```') ? 1 : 0);
    if (mermaidStarts > 0 && mermaidStarts > mermaidEnds) {
      errors.push(`${file}: bloco mermaid possivelmente não fechado.`);
    }

    // Validação de links internos da Wiki [[Texto|Alvo]] ou [[Alvo]]
    const linkMatches = content.matchAll(/\[\[(?:([^|\]]+)\|)?([^\]]+)\]\]/g);
    for (const match of linkMatches) {
      // Quando há pipe, a sintaxe no GitHub Wiki é [[Texto|NomeDaPagina]] ou [[NomeDaPagina|Texto]].
      // O alvo é a segunda parte se houver pipe, ou a primeira.
      const target = (match[2] || match[1] || '').trim();
      if (
        target.startsWith('http://') ||
        target.startsWith('https://') ||
        target.startsWith('#')
      ) {
        continue;
      }
      if (!pageNames.has(target) && !pageNames.has(match[1]?.trim())) {
        errors.push(`${file}: link interno para página inexistente "[[${target}]]".`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Erros na validação da wiki:\n  - ${errors.join('\n  - ')}`);
  }

  return { ok: true, count: files.length, pages: Array.from(pageNames) };
}

/**
 * Sincroniza a pasta wiki/ com o repositório remoto
 */
export function syncWiki(wikiDir = WIKI_DIR) {
  const check = checkWikiFiles(wikiDir);
  console.log(`Validação prévia da wiki passou (${check.count} páginas).`);

  const remote = getWikiRemote();
  const tempDir = mkdtempSync(join(tmpdir(), 'karasudo-site-wiki-'));

  try {
    console.log(`Clonando wiki remota em diretório temporário...`);
    try {
      run('git', ['clone', remote, tempDir], { quiet: false });
    } catch {
      console.warn(
        'Aviso: Não foi possível clonar a wiki remota. Certifique-se de que a Wiki foi inicializada nas configurações do GitHub.'
      );
      return;
    }

    console.log(`Copiando arquivos da wiki para o repositório temporário...`);
    cpSync(wikiDir, tempDir, { recursive: true });

    const status = run('git', ['status', '--porcelain'], { cwd: tempDir, quiet: true });
    if (!status) {
      console.log('A wiki remota já está atualizada. Nenhuma alteração pendente.');
      return;
    }

    console.log('Criando commit das alterações na wiki...');
    run('git', ['config', 'user.name', 'darioreisjr'], { cwd: tempDir, quiet: true });
    run('git', ['config', 'user.email', 'guttyerresjunior1995@gmail.com'], { cwd: tempDir, quiet: true });
    run('git', ['add', '.'], { cwd: tempDir, quiet: true });
    run('git', ['commit', '-m', 'docs(wiki): sincroniza documentacao oficial da wiki'], {
      cwd: tempDir,
      quiet: true,
    });

    console.log('Enviando alterações para o GitHub Wiki...');
    run('git', ['push', 'origin', 'master'], { cwd: tempDir, quiet: false });
    console.log('Sucesso: Wiki sincronizada com o GitHub!');
  } finally {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignora limpeza de temp
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  const isCheck = args.includes('--check');
  const isPush = args.includes('--push') || args.includes('--sync');

  if (isCheck) {
    try {
      const res = checkWikiFiles();
      console.log(`✅ Wiki em perfeito estado: ${res.count} páginas validadas.`);
      process.exit(0);
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  }

  if (isPush) {
    try {
      syncWiki();
      process.exit(0);
    } catch (err) {
      console.error(`Erro ao sincronizar wiki:`, err.message);
      process.exit(1);
    }
  }

  console.log('Uso: node scripts/wiki-sync.mjs [--check | --push]');
}

main();
