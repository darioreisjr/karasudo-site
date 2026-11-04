// Publica a versão do package.json no GitHub: confere se o CHANGELOG.md tem a seção dela,
// cria a tag vX.Y.Z e a release no GitHub com o texto dessa seção como notas.
//   npm run release                -> publica (precisa do gh autenticado)
//   npm run release -- --dry-run   -> só confere e mostra as notas
//   npm run release -- --if-needed -> só publica se a versão do package.json ainda não existir
// Antes de rodar sem --if-needed: suba a versão no package.json, escreva a seção no CHANGELOG.md
// e faça o merge na branch main.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function parseReleaseArgs(argv) {
  const args = { dryRun: false, help: false, ifNeeded: false };
  for (const a of argv) {
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--if-needed') args.ifNeeded = true;
    else throw new Error(`opção desconhecida: ${a}`);
  }
  return args;
}

/**
 * Retorna o texto da seção `## [versão]` do CHANGELOG (sem o título e sem links finais),
 * ou undefined se não houver seção ou se ela estiver vazia.
 */
export function changelogSection(changelog, version) {
  const lines = changelog.split(/\r?\n/);
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const head = new RegExp(`^## \\[?v?${escaped}\\]?(?:\\s|$)`);
  const start = lines.findIndex((l) => head.test(l));
  if (start < 0) return undefined;

  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (/^## /.test(line) || /^\[[^\]]+\]:\s/.test(line)) break;
    body.push(line);
  }
  const text = body.join('\n').trim();
  return text || undefined;
}

/**
 * Junta linhas quebradas apenas para ajuste visual de 120 colunas.
 * Títulos, listas, tabelas e blocos de código são preservados integralmente.
 */
export function unwrapMarkdown(text) {
  const out = [];
  let fence = false;
  let joinable = false;

  for (const line of text.split('\n')) {
    const t = line.trim();
    if (/^(```|~~~)/.test(t)) {
      fence = !fence;
      out.push(line);
      joinable = false;
      continue;
    }
    const startsBlock = !t || fence || /^(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\|)/.test(t);
    if (joinable && !startsBlock) out[out.length - 1] += ` ${t}`;
    else out.push(line);
    joinable = !fence && !!t && !/^(#{1,6}\s|\|)/.test(t);
  }
  return out.join('\n');
}

export function isTagAlreadyPublished(tag, gitRunner = (args) => run('git', args, { quiet: true })) {
  try {
    gitRunner(['fetch', '--quiet', '--tags', 'origin']);
  } catch {
    // Prossegue se offline ou sem origin remota acessível
  }
  try {
    gitRunner(['rev-parse', '--quiet', '--verify', `refs/tags/${tag}`]);
    return true;
  } catch {
    // Não achou nas referências locais
  }
  try {
    const remote = gitRunner(['ls-remote', '--tags', 'origin', `refs/tags/${tag}`]);
    if (remote.trim().length > 0) return true;
  } catch {
    // Prossegue se não houver acesso à origin
  }
  return false;
}

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: opts.quiet ? ['ignore', 'pipe', 'ignore'] : ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

async function main(argv) {
  let args;
  try {
    args = parseReleaseArgs(argv);
  } catch (err) {
    fail(err.message);
  }

  if (args.help) {
    console.log(
      'Uso: npm run release [-- --dry-run] [-- --if-needed]\nPublica a versão do package.json no GitHub com as notas do CHANGELOG.md.'
    );
    return;
  }

  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const version = pkg.version;
  if (!version) fail('package.json não define o campo "version".');

  const tag = `v${version}`;
  const changelogPath = join(ROOT, 'CHANGELOG.md');
  if (!readFileSync(changelogPath, 'utf8')) fail('CHANGELOG.md não encontrado ou vazio.');

  const section = changelogSection(readFileSync(changelogPath, 'utf8'), version);
  if (!section) {
    if (args.ifNeeded) {
      console.log(`ℹ O CHANGELOG.md não tem a seção "## [${version}]": nada a publicar.`);
      return;
    }
    fail(`o CHANGELOG.md não tem a seção "## [${version}]" (ou ela está vazia): documente as alterações antes de publicar.`);
  }

  const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const isCi = !!process.env.GITHUB_ACTIONS;

  if (branch !== 'main' && !isCi && !args.dryRun) {
    fail(`publique a partir da main (você está em ${branch}).`);
  }
  if (!isCi && !args.dryRun && run('git', ['status', '--porcelain'])) {
    fail('há mudanças não commitadas.');
  }
  if (!isCi && !args.dryRun) {
    try {
      if (run('git', ['rev-parse', 'HEAD']) !== run('git', ['rev-parse', 'origin/main'])) {
        fail('a main local não está sincronizada com origin/main (faça git pull ou git push).');
      }
    } catch {
      // Prossegue se não conseguir comparar com origin/main
    }
  }

  const tagExists = isTagAlreadyPublished(tag);
  if (tagExists) {
    if (args.ifNeeded) {
      console.log(`ℹ A tag ${tag} já existe: nada a publicar.`);
      return;
    }
    fail(`a tag ${tag} já existe: suba a versão no package.json antes.`);
  }

  const notes = unwrapMarkdown(section);

  console.log(`Karasudo Site ${tag}\n\n${notes}\n`);
  if (args.dryRun) {
    console.log('(--dry-run: validação concluída com sucesso, nada foi publicado)');
    return;
  }

  const dir = mkdtempSync(join(tmpdir(), 'karasudo-site-release-'));
  try {
    const file = join(dir, 'notas.md');
    writeFileSync(file, `${notes}\n`, 'utf8');
    run('git', ['tag', '-a', tag, '-m', `Karasudo Site ${tag}`]);
    run('git', ['push', 'origin', tag]);
    const url = run('gh', [
      'release',
      'create',
      tag,
      '--verify-tag',
      '--title',
      `Karasudo Site ${tag}`,
      '--notes-file',
      file,
    ]);
    console.log(`✓ Release publicada com sucesso: ${url}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error('✗ Erro na release:', err);
    process.exit(1);
  });
}
