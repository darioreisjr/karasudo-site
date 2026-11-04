# Qualidade, Testes e Auditoria

A qualidade do `karasudo-site` é verificada em três camadas complementares: auditoria de layout/textos, testes de responsividade com Playwright e pipeline de CI no GitHub Actions.

---

## 1. Auditoria Local de Layout e Textos

O script `scripts/audit-layout.mjs` é executado com o comando:

```bash
npm run audit
```

Ele valida automaticamente:

1. **Anti-Slop (Taste Skill):** Varre todas as páginas HTML (`index.html`, `como-usar.html`, `downloads.html`) procurando clichês vazios de IA (ex: "revolucione", "potencialize", "ia de ponta"). Se encontrar algum, o script emite aviso imediato.
2. **Glossário Canônico:** Confere se termos da marca estão corretos (*Karasudo*, *karasu*, *dō*, nomes das ferramentas).
3. **Regras de Pixel Art:** Garante que `image-rendering: pixelated;` está presente no CSS para manter a nitidez retro.
4. **Proteção contra Overflow Horizontal:** Confere se blocos de código possuem `word-break: break-word` e `overflow-x: auto` para não quebrar dispositivos móveis.

---

## 2. Testes com Playwright e Viewports

Utilizamos o Playwright para testar a renderização visual em quatro resoluções padrão:

- **Mobile Estreito (320px e 360px):** Garante zero scroll horizontal (`scrollWidth <= clientWidth`).
- **Tablet (768px):** Garante adaptação das grades de 2 colunas.
- **Desktop (1440px e 1920px):** Garante centralização e respiro confortável.

---

## 3. Pipeline de Integração Contínua (GitHub Actions)

No arquivo `.github/workflows/ci.yml`, a cada push ou PR nas branches `main` e `development`, o GitHub Actions executa:

```bash
npm ci
npm run ai:check      # integridade das instruções dos agentes
npm run wiki:check    # integridade da documentação da wiki
npm run audit         # auditoria de layout, textos e pixel art
npm run build         # compilação de produção do Vite
```

Se qualquer etapa falhar, o PR é bloqueado para merge até a correção.

---

## 4. Pipeline de Release em Produção

Ao fazer o merge ou push na branch `main`, além do CI padrão, o workflow `.github/workflows/release.yml` executa a publicação automatizada de releases oficiais com tags anotadas no GitHub e notas extraídas do `CHANGELOG.md` (`npm run release -- --if-needed`).
