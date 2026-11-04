import fs from 'node:fs';
import path from 'node:path';

// Termos canônicos obrigatórios do Karasudo e glossário fixo
const GLOSSARY = {
  Karasudo: 'Karasudo (com K maiúsculo, sem acento)',
  karasu: 'karasu (corvo em japonês)',
  dō: 'dō (casa em japonês, com mácron)',
  'Claude Code': 'Claude Code',
  Codex: 'Codex',
  'Gemini CLI': 'Gemini CLI',
  Antigravity: 'Antigravity',
};

// Expressões clichês de "Landing Page de IA genérica" que DEVEM ser evitadas
const AI_BUZZWORDS = [
  'revolucione',
  'revolucionário',
  'potencialize',
  'impulsione seu fluxo',
  'ia de ponta',
  'inteligência artificial de ponta',
  'produtividade 10x',
  'transformação digital',
  'sinergia',
];

const PAGES = ['index.html', 'como-usar.html', 'downloads.html'];

function auditTexts() {
  console.log('--- 1. Auditoria de Textos e Copywriting Multi-Páginas ---');
  let totalWarnings = 0;

  for (const page of PAGES) {
    const pagePath = path.resolve(page);
    if (!fs.existsSync(pagePath)) {
      console.error(`❌ Página obrigatória ausente: ${page}`);
      process.exitCode = 1;
      continue;
    }

    const content = fs.readFileSync(pagePath, 'utf8').toLowerCase();

    for (const buzzword of AI_BUZZWORDS) {
      if (content.includes(buzzword)) {
        console.warn(`[AVISO DE VÍCIO DE IA] Encontrado clichê genérico: "${buzzword}" em ${page}`);
        totalWarnings++;
      }
    }
  }

  if (totalWarnings === 0) {
    console.log(`✅ Nenhum vício de IA detectado nas ${PAGES.length} páginas. Textos diretos e autênticos!`);
  }

  // Verifica termos obrigatórios no index
  const indexContent = fs.readFileSync(path.resolve('index.html'), 'utf8');
  for (const [term] of Object.entries(GLOSSARY)) {
    if (!indexContent.includes(term)) {
      console.warn(`[AVISO DE GLOSSÁRIO] Termo canônico "${term}" não encontrado na Home.`);
    }
  }
}

function auditCssForPixelArtAndResponsiveness() {
  console.log('\n--- 2. Auditoria de Regras de Pixel Art e Responsividade ---');
  const layoutCss = fs.readFileSync(path.resolve('src/styles/layout.css'), 'utf8');
  const pixelCss = fs.readFileSync(path.resolve('src/styles/pixel-art.css'), 'utf8');

  // Garante regra de renderização nítida de pixel art
  if (!pixelCss.includes('image-rendering: pixelated')) {
    console.error('❌ ERRO: image-rendering: pixelated não encontrado em pixel-art.css!');
    process.exitCode = 1;
  } else {
    console.log('✅ image-rendering: pixelated ativo para nitidez retro.');
  }

  // Garante quebra de linha em elementos de código para não quebrar mobile
  if (!layoutCss.includes('word-break: break-word') && !layoutCss.includes('overflow-x: auto')) {
    console.warn('⚠️ AVISO: Código sem proteção de overflow para mobile.');
  } else {
    console.log('✅ Proteção contra overflow horizontal no mobile ativa.');
  }
}

function main() {
  auditTexts();
  auditCssForPixelArtAndResponsiveness();
  console.log('\nAudit de layout e textos concluído com sucesso!');
}

main();
