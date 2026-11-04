---
name: audit-copy-and-layout
description: Valida o copywriting em português, ortografia, ausência de vícios e clichês de IA, e responsividade perfeita em todas as telas (de 320px a 1920px) sem quebras. Use antes de aprovar ou finalizar alterações visuais e de texto.
---

# Auditoria de Copywriting, Ortografia e Responsividade

Instruções para garantir que a página do Karasudo permaneça autêntica, humana, bem escrita e sem falhas de layout em qualquer dispositivo.

## 1. Eliminação de Vícios de Design de IA

O Karasudo é um projeto autêntico em pixel art e acolhedor, feito por desenvolvedor para desenvolvedores. Nunca use:
- **Gradients de SaaS genérico:** Evite botões com gradientes roxos/azuis neon ou efeitos de vidro ("glassmorphism") desproporcionais. Use botões táteis com bordas e relevo mecânico.
- **Clichês vazios de IA:** Proibido usar "revolucione seu fluxo", "potencialize sua produtividade", "inteligência de ponta", "10x mais rápido".
- **Tom corporativo impessoal:** Use tom amigável, direto e focado no dia a dia da programação real.

## 2. Ortografia e Termos Canônicos

- **Karasudo:** Sempre com 'K' maiúsculo e sem acento.
- **Origem:** *karasu* (corvo) e *dō* (casa, com mácron sobre o o).
- **Ferramentas:** Claude Code, Codex, Gemini CLI e Antigravity (com maiúsculas corretas).
- **Atalhos:** Sempre formatados com `<kbd class="ui-kbd">LETRA</kbd>` (ex: `P`, `T`, `M`).
- **Pontuação e acentuação:** Em português esmerado, sem termos em inglês desnecessários onde há equivalente natural em português.

## 3. Responsividade em Dispositivos (De 320px a 1920px)

- **Zero Scroll Horizontal:** Em nenhum dispositivo o `scrollWidth` pode ser maior que o `clientWidth`.
- **Quebra Segura de Código:** Qualquer tag `<code>` ou `<pre>` com comandos longos deve ter `word-break: break-word` e `overflow-x: auto`.
- **Botões e Badges Adaptáveis:** Em telas menores que 480px, botões adjacentes e sumários de versões devem permitir `flex-wrap: wrap`.
- **Nitidez de Pixel Art:** Imagens retro devem ter `image-rendering: pixelated;`.

## 4. Como Executar a Verificação

Rode no terminal:

```bash
npm run audit
```

E para conferir a renderização ao vivo com Playwright em diferentes viewports:

```bash
npx vite preview &
# Teste viewports 320, 360, 768 e 1440
```
