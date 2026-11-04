# ADR 0001: Adoção de Vite com HTML/CSS/JS Estático Puro para o Site Oficial

- Status: aceito
- Data: 2026-11-04

## Contexto

O `karasudo-site` é a página de produto e central oficial de downloads do Karasudo.
As regras de fronteira do projeto exigem:
1. Estética pixel art fiel e acolhedora.
2. Acessibilidade total (WCAG 2.2 AA).
3. Desempenho estático máximo, sem dependências de frameworks pesados no cliente e sem rastreadores.
4. Downloads diretos e transparentes das versões oficiais do produto.

O usuário determinou que por enquanto o site não terá hospedagem pública em nuvem e será testado/executado de forma estática localmente, com foco em uma central de downloads completa e visual pixel art rico.

## Opções

| Critério | HTML/CSS Puro com Vite | Framework SPA (React/Vue) | Gerador Estático Completo (Astro/Next.js) |
| -------- | ---------------------- | -------------------------- | ------------------------------------------ |
| Tamanho do bundle cliente | ~0 KB (apenas assets) | 130–250 KB de runtime | 40–100 KB de runtime/hydration |
| Tempo de renderização (FCP) | Imediato (HTML nativo) | Atrasado pelo boot de JS | Rápido, mas com complexidade de componentes |
| Preservação de pixel art | Total via CSS nativo (`image-rendering: pixelated`) | Total via CSS nativo | Total via CSS nativo |
| Dependências em runtime | Nenhuma | Múltiplas bibliotecas de UI | Múltiplas dependências e plugins |
| Complexidade de manutenção | Mínima (zero breaking changes de frameworks) | Média/Alta | Média |

## Decisão recomendada

Adotar **HTML5 Semântico + CSS3 Puro + JavaScript Baunilha**, utilizando o **Vite** (v8.3.5) estritamente como ferramenta de desenvolvimento (`devDependencies`) para servir localmente com HMR e empacotar arquivos finais estáticos minificados com cache-busting.

## Consequências

- **O que fica mais fácil:**
  - Carregamento instantâneo em qualquer navegador.
  - Conformidade nativa com WCAG 2.2 AA sem conflitos de acessibilidade introduzidos por bibliotecas externas.
  - Ausência de quebras futuras causadas por atualizações de frameworks.
- **O que fica mais difícil:**
  - Componentes reutilizáveis precisam ser gerados como HTML limpo ou organizados via templates estáticos simples.
- **O que passa a ser regra:**
  - Nenhuma biblioteca de runtime cliente (como React, Vue, jQuery) será instalada sem um novo ADR.
  - O build deve sempre produzir uma pasta estática auto-contida (`dist/`) servível por qualquer servidor HTTP estático.

## Fontes

- [Documentação Oficial do Vite](https://vite.dev/guide/)
- [Diretrizes de Acessibilidade Web W3C (WCAG 2.2)](https://www.w3.org/TR/WCAG22/)
- [AGENTS.md do Karasudo Site](file:///E:/Projetos/karasudo-site/AGENTS.md)
