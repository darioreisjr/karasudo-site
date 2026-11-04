<p align="center">
  <img src="public/assets/brand/logo-mark@4x.png" width="96" alt="Logotipo do Karasudo: prédio em pixel art com um corvo no telhado" />
</p>

<h1 align="center">Karasudo Site</h1>

<p align="center">
  <b>Portal oficial e central de downloads do Karasudo.</b><br />
  O escritório em pixel art dos seus agentes de IA: Claude Code, Codex, Gemini CLI e Antigravity.
</p>

<p align="center">
  <a href="https://karasudo.darioreis.dev/"><strong>karasudo.darioreis.dev</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Produção-4fd18b?style=flat-square" alt="Status de Produção" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel" alt="Hospedado na Vercel" />
  <img src="https://img.shields.io/badge/Acessibilidade-WCAG%202.2%20AA-7cc8ff?style=flat-square" alt="WCAG 2.2 AA" />
  <img src="https://img.shields.io/badge/Estilo-Pixel%20Art-ffb547?style=flat-square" alt="Pixel Art" />
</p>

---

## 🌐 Páginas do Site

O site é estruturado como **Multi-Page App (MPA)** estático, leve e ultraveloz:

- **Início (`/`):** Apresentação visual acolhedora do produto, vitrine viva do prédio em pixel art e status dos agentes em tempo real.
- **Como Usar (`/como-usar.html`):** Guia detalhado de ponta a ponta: desde os pré-requisitos (Node.js 22.12+) e download do pacote `.ZIP`, até a execução local e comandos de conexão de cada ferramenta.
- **Central de Downloads (`/downloads.html`):** Download direto do pacote oficial estável (`.zip` e `.tar.gz`), comandos Docker e histórico completo de todas as versões já lançadas com notas de release.

---

## 🛠️ Tecnologias e Arquitetura

- **Vite 8:** Servidor de desenvolvimento rápido e empacotamento estático otimizado (veja o [ADR 0001](docs/architecture/adr/0001-stack-estatica-vite.md)).
- **HTML5 Semântico e CSS3 Puro:** Zero dependências de frameworks no cliente. Carregamento em milissegundos e payload mínimo (~3 kB gzip por página).
- **Design Taste (Anti-Slop):** Texturas mecânicas táteis em pixel art, keycaps retro (`.ui-kbd`) e conformidade com acessibilidade por teclado e contraste (WCAG 2.2 AA).
- **Vercel CDN:** Deploy contínuo a cada commit na branch `main`.

---

## 💻 Desenvolvimento Local

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o servidor local de desenvolvimento
npm run dev
```

Abre em **http://localhost:3000** com recarregamento instantâneo (HMR).

---

## 📦 Comandos Disponíveis

| Comando | O que faz |
| ------- | --------- |
| `npm run dev` | Inicia o servidor local de desenvolvimento na porta 3000 |
| `npm run build` | Compila as páginas estáticas minificadas na pasta `dist/` |
| `npm run preview` | Pré-visualiza o build estático localmente na porta 4173 |
| `npm run audit` | Executa a auditoria de layout, textos anti-slop e responsividade |
| `npm run wiki:check` | Valida a integridade dos arquivos e links da pasta `wiki/` |
| `npm run wiki:sync` | Sincroniza a documentação com o repositório remoto da GitHub Wiki |
| `npm run ai:check` | Confere a integridade das configurações dos agentes de IA |

---

## 📖 Documentação na Wiki

A documentação aprofundada do projeto fica na pasta canônica `wiki/` e na [GitHub Wiki](https://github.com/darioreisjr/karasudo-site/wiki):

- [Visão Geral](wiki/Home.md)
- [Arquitetura e Stack Técnica](wiki/Arquitetura-e-Stack.md)
- [Guia de Publicação e Deploy](wiki/Guia-de-Publicacao-e-Deploy.md)
- [Sincronização de Releases](wiki/Sincronizacao-de-Releases.md)
- [Qualidade e Testes](wiki/Qualidade-e-Testes.md)

---

## 🛡️ Regra de Integridade Antes de Subir para Produção

> **Importante:** Sempre que qualquer alteração de rotas, comandos, layout ou novas funcionalidades for enviada para a branch `main` ou `development`:
> 1. Verifique se o **`README.md`** precisa ser atualizado para refletir o estado real.
> 2. Verifique se as páginas da **`wiki/`** continuam precisas e execute `npm run wiki:check`.
> 3. Execute `npm run audit` e `npm run build` para garantir que o pipeline de CI passe sem falhas.

---

## 📄 Licença e Créditos

Criado e mantido por [Dario Reis (darioreisjr)](https://github.com/darioreisjr).  
Inspirado em *karasu* (corvo) e *dō* (casa). 100% livre e de código aberto.
