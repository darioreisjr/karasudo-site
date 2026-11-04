import fs from 'node:fs';
import path from 'node:path';

const APP_CHANGELOG_PATH = 'E:/Projetos/escritorio-agentes/CHANGELOG.md';
const OUTPUT_JSON_PATH = path.resolve('src/data/releases.json');

function parseChangelog(content) {
  const versions = [];
  const versionRegex = /^## \[(\d+\.\d+\.\d+)\](?:\s*-\s*(\d{4}-\d{2}-\d{2}))?/gm;

  const matches = [...content.matchAll(versionRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const version = match[1];
    const date = match[2] || 'Data não informada';
    const startIndex = match.index + match[0].length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const body = content.slice(startIndex, endIndex).trim();

    // Parse sections within this version (e.g. ### Adicionado, ### Corrigido)
    const sections = [];
    const sectionBlocks = body.split(/^### /gm).filter(Boolean);

    for (const block of sectionBlocks) {
      const lines = block.split('\n');
      const title = lines[0].trim();
      const text = lines.slice(1).join('\n').trim();

      // Extrai os itens com marcadores de lista
      const rawItems = text.split(/\n-\s+/).filter(Boolean);
      const items = rawItems.map((item) => {
        const clean = item.replace(/^- /, '').trim();
        return clean;
      });

      if (items.length > 0) {
        sections.push({ title, items });
      }
    }

    versions.push({
      version,
      date,
      latest: i === 0,
      downloads: {
        zip: `https://github.com/darioreisjr/karasudo/archive/refs/tags/v${version}.zip`,
        tar: `https://github.com/darioreisjr/karasudo/archive/refs/tags/v${version}.tar.gz`,
        releasePage: `https://github.com/darioreisjr/karasudo/releases/tag/v${version}`,
      },
      sections,
    });
  }

  return versions;
}

function main() {
  let content = '';
  if (fs.existsSync(APP_CHANGELOG_PATH)) {
    content = fs.readFileSync(APP_CHANGELOG_PATH, 'utf8');
  } else {
    console.warn(`Arquivo de changelog em ${APP_CHANGELOG_PATH} não encontrado.`);
    return;
  }

  const releases = parseChangelog(content);
  fs.mkdirSync(path.dirname(OUTPUT_JSON_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(releases, null, 2), 'utf8');
  console.log(`Sucesso: ${releases.length} versões mapeadas em ${OUTPUT_JSON_PATH}`);
}

main();
