---
name: site
description: Como manter, atualizar, empacotar distribuições sem código-fonte e sincronizar o site oficial do Karasudo (karasudo-site). Use sempre que uma nova versão do produto for lançada, empacotada ou quando a documentação, páginas de download e instruções de uso do site precisarem ser atualizadas.
---

# Site Oficial do Karasudo

O repositório `karasudo-site` é o portal estático oficial para distribuição e apresentação do Karasudo.

## Regras de Fronteira e Segurança

1. **Zero Código-Fonte:** Nunca coloque o código-fonte TypeScript (`client/src`, `server/`, etc.) ou arquivos de desenvolvimento para download no site.
2. **Distribuição via Pacote Oficial:** O Karasudo é distribuído pré-compilado via `npm pack` (que inclui apenas `bin/` e `dist/`, definidos em `package.json`), gerando `karasudo-<versão>.tgz` e o `.zip` correspondente.
3. **Instalação Global Simples:** As instruções do site devem sempre instruir o usuário final a instalar via:
   ```bash
   npm install -g ./karasudo-<versão>.tgz
   karasudo
   ```
   e acessar em `http://localhost:1818`.

## Comandos

| Comando              | O que faz                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run site:check` | Confere se a pasta do site existe e simula a sincronização sem alterar arquivos (`--dry-run`).                   |
| `npm run site:sync`  | Compila o Karasudo, gera o pacote `.tgz`/`.zip`, atualiza `releases.json`, as páginas HTML e roda o build do site. |
| `npm run release`    | Publica a release oficial no GitHub e automaticamente executa `syncSite()` para atualizar o portal de downloads. |

## Quando Sincronizar o Site

- **Nova versão lançada:** Ao preparar ou lançar uma nova versão (`npm run release`), a sincronização roda automaticamente para atualizar a versão mais recente em `public/downloads/`, `releases.json`, `downloads.html`, `como-usar.html` e `index.html`.
- **Alterações no guia ou design:** Sempre que houver melhorias nos passos de execução ou no layout, sincronize com `npm run site:sync`.
- **Verificação contínua:** Em pipelines ou antes de publicar, valide com `npm run site:check`.
