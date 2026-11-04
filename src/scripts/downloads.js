import releases from '../data/releases.json';
import { setupCopyButtons } from './copy.js';

function detectOS() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'Windows';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('linux')) return 'Linux';
  return 'Desktop';
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderReleases() {
  const container = document.getElementById('releases-list');
  if (!container) return;

  if (!releases || releases.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Nenhuma versão encontrada.</p>';
    return;
  }

  const html = releases
    .map((rel, index) => {
      const isLatest = index === 0;
      const isOpen = isLatest ? 'open' : '';

      const sectionsHtml = rel.sections
        .map(
          (sec) => `
          <h4 class="version-section-title">${escapeHtml(sec.title)}</h4>
          <ul class="version-section-list">
            ${sec.items.map((it) => `<li>${escapeHtml(it)}</li>`).join('')}
          </ul>
        `
        )
        .join('');

      const downloadsHtml = rel.downloads
        ? `
          <a
            href="${rel.downloads.tgz}"
            class="btn-pixel-secondary"
            style="padding: 4px 10px; font-size: 0.8rem;"
            download="karasudo-${rel.version}.tgz"
            onclick="event.stopPropagation();"
          >
            .TGZ (2 MB)
          </a>
          <a
            href="${rel.downloads.zip}"
            class="btn-pixel-secondary"
            style="padding: 4px 10px; font-size: 0.8rem;"
            download="karasudo-${rel.version}.zip"
            onclick="event.stopPropagation();"
          >
            .ZIP (2 MB)
          </a>
        `
        : `<span style="font-size: 0.78rem; color: var(--text-faint);">Notas históricas</span>`;

      return `
        <details class="version-item" ${isOpen}>
          <summary class="version-item__summary">
            <div class="version-item__info">
              <span class="version-item__tag">v${rel.version}</span>
              ${
                rel.latest
                  ? '<span class="badge-pixel badge-pixel--latest">Pacote disponível</span>'
                  : ''
              }
              <span class="version-item__date">${rel.date}</span>
            </div>
            <div class="version-item__actions">
              ${downloadsHtml}
            </div>
          </summary>
          <div class="version-item__content">
            ${sectionsHtml || '<p style="color:var(--text-faint); margin-top: 12px;">Notas de versão resumidas.</p>'}
          </div>
        </details>
      `;
    })
    .join('');

  container.innerHTML = html;
}

function init() {
  const os = detectOS();
  const heroBtn = document.getElementById('main-download-btn');
  if (heroBtn) {
    const span = heroBtn.querySelector('span');
    if (span) {
      span.textContent = `Baixar Karasudo v0.1.8 (.tgz · 2 MB)`;
    }
    heroBtn.href = '/downloads/karasudo-0.1.8.tgz';
  }

  renderReleases();
  setupCopyButtons();
}

document.addEventListener('DOMContentLoaded', init);
