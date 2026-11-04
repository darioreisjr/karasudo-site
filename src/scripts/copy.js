async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback abaixo
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    return successful;
  } catch (err) {
    document.body.removeChild(textarea);
    console.error('Falha no fallback de cópia:', err);
    return false;
  }
}

export function updateYear() {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = currentYear;
  });
}

export function setupCopyButtons() {
  updateYear();
  document.addEventListener('click', async (event) => {
    const btn = event.target.closest('.btn-copy, .btn-copy-icon');
    if (!btn) return;

    event.preventDefault();
    event.stopPropagation();

    let textToCopy = btn.getAttribute('data-copy');

    if (!textToCopy) {
      const container = btn.closest('.command-snippet, .code-box-wrapper');
      if (container) {
        const codeEl = container.querySelector('code');
        if (codeEl) {
          textToCopy = codeEl.textContent.trim();
        }
      }
    }

    if (!textToCopy) return;

    const ok = await copyText(textToCopy);
    if (ok) {
      const iconCopy = btn.querySelector('.icon-copy');
      const iconCheck = btn.querySelector('.icon-check');
      const textSpan = btn.querySelector('.copy-text');

      btn.classList.add('is-copied');
      if (iconCopy) iconCopy.style.display = 'none';
      if (iconCheck) iconCheck.style.display = 'inline-block';
      if (textSpan) textSpan.textContent = 'Copiado!';

      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (iconCopy) iconCopy.style.display = 'inline-block';
        if (iconCheck) iconCheck.style.display = 'none';
        if (textSpan) textSpan.textContent = 'Copiar';
      }, 2000);
    }
  });
}
