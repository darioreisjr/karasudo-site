# Karasudo Site: instruções para agentes

Fonte canônica de instruções para Claude Code, Codex CLI, Gemini CLI e Antigravity CLI. `CLAUDE.md` e `GEMINI.md` apenas importam este arquivo. Não duplique o conteúdo dele em outro lugar. Mantenha abaixo de 200 linhas: detalhe vai para skills e documentos.

## Visão

O `karasudo-site` é o site oficial, página de produto e central de downloads do Karasudo (escritório em pixel art que mostra agentes de IA em tempo real). Permite que os usuários conheçam o produto, confiram as novidades e baixem sempre a versão mais recente e estável, além de acessar o histórico de versões. Projeto de um dev só (darioreisjr).

## Leia antes de qualquer tarefa

| Documento                | Para quê                                             |
| ------------------------ | ---------------------------------------------------- |
| `README.md`              | O projeto para quem chega                            |
| `docs/architecture/adr/` | Decisões de arquitetura aceitas                      |
| `docs/open-questions.md` | O que ainda não foi decidido                         |
| `docs/ai-setup/`         | Configurações dos agentes e MCP                      |

Se um documento contradiz o código, pare e avise. Não escolha um dos dois em silêncio.

## Estrutura

```
docs/              ADRs, pendências e o setup dos agentes (docs/ai-setup/)
scripts/           scripts de automação, sincronização de agentes e hooks
.agents/           skills e definições compartilhadas de agentes
```

## Comandos

| Comando                                | O que faz                                    |
| -------------------------------------- | -------------------------------------------- |
| `node scripts/ai-sync.mjs` / `--check` | Gera ou confere as configurações dos agentes |

## Regras de fronteira

1. Estética pixel art fiel à identidade visual do Karasudo (cores, tipografia e clima acolhedor).
2. Acessibilidade (WCAG 2.2 AA) e HTML semântico com navegação por teclado e foco visível.
3. Performance estática e carregamento rápido, sem rastreadores invasivos de terceiros.
4. Downloads apontando diretamente para as versões e releases oficiais do Karasudo.

## Fluxo de trabalho

Explorar, planejar, aprovação humana, implementar, revisar. Nenhuma ferramenta implementa sem plano aprovado.

1. **Explorar:** o `discovery-analyst` lê os documentos e o código e aponta lacunas.
2. **Planejar:** o `architect` entrega um plano em etapas pequenas, cada uma com o comando que prova que funcionou. Não edita código.
3. **Aprovação humana:** o autor aprova o plano. Sem aprovação explícita, pare.
4. **Implementar:** o `implementer` executa só o plano aprovado. Mudança de escopo volta ao passo 2.
5. **Revisar:** `code-reviewer`; `security-reviewer` se a mudança mexe em entrada, autenticação ou dependências; `a11y-perf-reviewer` e `design-system-guardian` em mudanças visuais ou de interface.

Pare e pergunte quando: nenhuma decisão aceita cobre o caso, há item bloqueante em `docs/open-questions.md`, ou a tarefa pede conteúdo que não existe no repositório.

Claude Code é a ferramenta principal e implementa. Codex, Gemini CLI e Antigravity fazem revisão e segunda opinião, com as mesmas instruções.

## Branches e publicação

- `main`: a versão publicada (protegida). `development`: integração das tarefas.
- Cada tarefa numa branch `tipo/descricao-curta`, saída da `development`, com pull request contra a `development`. Issue é opcional; quando houver, o PR cita `Closes #n`.
- Push, merge e release só quando o autor pedir. Detalhes na skill `commits`.

## Definição de pronto

- Plano aprovado seguido, sem escopo extra.
- Regras de fronteira respeitadas.
- Decisão de arquitetura nova: ADR escrito (skill `write-adr`).
- Commit no padrão Conventional Commits, em português e sem coautor (skill `commits`).

## Nunca

- Inventar conteúdo sobre pessoas, clientes, resultados ou números.
- Instalar dependência sem justificativa de uma linha no plano.
- Escrever segredo em arquivo versionado. Segredos só por variável de ambiente; nomes em `.env.example`.
- Editar à mão arquivos gerados: `.claude/skills/`, `.claude/agents/`, `.claude/settings.json`, `.codex/`, `.gemini/`, `.agents/agents/`, `.agents/hooks.json`, `.agents/mcp_config.json`, `.mcp.json` e os `CLAUDE.md` e `GEMINI.md` de subpastas.
- Pôr coautor ou assinatura de ferramenta de IA em commit (`Co-Authored-By`, "Generated with").
- Fazer push, merge de pull request ou publicação sem o autor pedir.
- Usar `--no-verify` para pular hooks do Git.

## Setup dos agentes

| O quê      | Fonte (edite aqui)               | Gerado por `scripts/ai-sync.mjs`                                                            |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| Instruções | `AGENTS.md`                      | `CLAUDE.md` e `GEMINI.md` de subpastas                                                      |
| Skills     | `.agents/skills/<nome>/SKILL.md` | `.claude/skills/`                                                                           |
| Subagentes | `docs/ai-setup/agents.md`        | `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`, `.agents/agents/`                   |
| MCP        | `docs/ai-setup/mcp.json`         | `.mcp.json`, `.codex/config.toml`, `.gemini/settings.json`, `.agents/mcp_config.json`       |
| Hooks      | `docs/ai-setup/hooks.json`       | `.claude/settings.json`, `.codex/hooks.json`, `.gemini/settings.json`, `.agents/hooks.json` |
| Extras     | `docs/ai-setup/settings.json`    | `.claude/settings.json`, `.gemini/settings.json`                                            |

Depois de editar uma fonte, rode `node scripts/ai-sync.mjs` e abra uma sessão nova. Detalhes em `docs/ai-setup/README.md`.
