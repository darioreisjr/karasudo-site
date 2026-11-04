# Karasudo Site

Site oficial, página de produto e central de downloads do **Karasudo** (o escritório em pixel art que mostra agentes de IA em tempo real).

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Abre em **http://localhost:3000** com recarregamento em tempo real (HMR).

## Build de Produção

Gera os arquivos estáticos minificados na pasta `dist/`:

```bash
npm run build
```

Para visualizar o build estático localmente:

```bash
npm run preview
```

Abre em **http://localhost:4173**.

## Sincronização de Versões

Para atualizar o histórico de versões e downloads a partir do `CHANGELOG.md` do Karasudo:

```bash
node scripts/sync-releases.mjs
```

## Arquitetura e Decisões

- Decisões registradas em [`docs/architecture/adr/`](docs/architecture/adr/).
- [ADR 0001: Adoção de Vite com HTML/CSS/JS Estático Puro](docs/architecture/adr/0001-stack-estatica-vite.md).
