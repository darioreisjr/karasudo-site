# Novidades

O que entrou em cada versão do Karasudo Site. Cada versão tem a sua seção aqui, e o texto dela vira as notas da
[release no GitHub](https://github.com/darioreisjr/karasudo-site/releases) (`npm run release`).

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), e os números seguem o
[versionamento semântico](https://semver.org/lang/pt-BR/): correção sobe o último número (0.1.**1**), novidade sobe o
do meio (0.**2**.0).

## [Não lançado]

## [0.1.0] - 2026-11-04

### Adicionado

- **Portal Oficial e Central de Downloads do Karasudo:** criação do site oficial em arquitetura multi-page application (MPA) moderna, estática e ultrarrápida com Vite.
- **Página Inicial (`index.html`):** showroom interativo, proposta de valor, apresentação dos agentes suportados (Claude Code, Codex, Gemini CLI e Antigravity) e métricas em tempo real.
- **Página Como Usar (`como-usar.html`):** guia passo a passo em 6 etapas práticas cobrindo desde o download do pacote oficial, descompactação, instalação de dependências, inicialização local na porta 3000, conexão das ferramentas de IA até a legenda detalhada dos status dos agentes no escritório.
- **Central de Downloads (`downloads.html`):** página de distribuição com links diretos oficiais para pacotes `.zip` e `.tar.gz`, além do histórico completo com 13 versões anteriores alimentado dinamicamente via `releases.json`.
- **Botões Acessíveis de Cópia Rápida:** interação ergonômica com ícone dedicado e feedback visual de cópia para a área de transferência (`src/scripts/copy.js`).
- **Design System Retro-Futurista em Pixel Art:** identidade visual fiel ao Karasudo (`src/styles/tokens.css`, `src/styles/pixel-art.css`, `src/styles/layout.css`), com keycaps analógicas (`.ui-kbd`), paleta escura acolhedora, fontes monospace nítidas e contraste em conformidade com as diretrizes WCAG 2.2 AA.
- **Auditoria Automatizada de Qualidade e Layout (`scripts/audit-layout.mjs`):** ferramenta de verificação estática que inspeciona títulos, meta tags, contraste, responsividade de 320px a 1920px e previne regressões visuais ou vícios de código.
- **Documentação Completa na GitHub Wiki (`wiki/`):** 7 páginas detalhadas (`Home.md`, `Arquitetura-e-Stack.md`, `Guia-de-Publicacao-e-Deploy.md`, `Sincronizacao-de-Releases.md`, `Qualidade-e-Testes.md`, `_Sidebar.md`, `_Footer.md`) com script de validação e sincronização remota (`scripts/wiki-sync.mjs`).
- **Integração Contínua e Hospedagem em Produção:** workflow de CI no GitHub Actions (`.github/workflows/ci.yml`) com validações automatizadas em pull requests e push, e hospedagem de produção na Vercel em `https://karasudo.darioreis.dev/`.
