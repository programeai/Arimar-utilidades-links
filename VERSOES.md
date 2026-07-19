# Versões do site

A versão publicada é sempre o `index.html` da raiz. As versões antigas ficam guardadas em `versions/` e as versões novas ficam em arquivos próprios na raiz até serem promovidas.

## Histórico

| Versão | Arquivo | Estilo | Situação |
|--------|---------|--------|----------|
| v1 | `versions/v1.html` | Primeira versão (usa `styles.css` + `app.js`) | Arquivada |
| v2 | `versions/v2.html` | Cabeçalho limpo, com card VIP (usa `styles.css` + `app.js`) | Arquivada |
| v3 | `versions/v3.html` | Link in bio clássico (usa `styles.css` + `app.js`) | Arquivada |
| v4 | `versions/v4.html` | "Vitrine" — vitrine de produtos com detalhes (usa `styles-vitrine.css` + `app-vitrine.js`) | Arquivada |
| v5 | `index.html` | "Vitrine Carrossel" — vitrine de produtos em carrossel (usa `styles-vitrine-v5.css` + `app-vitrine-v5.js`) | **No ar** (é o `index.html` atual) |
| v6 | — | Rascunho a partir da v4 (sem mudança funcional própria) | Excluída |

> A v5 foi promovida a `index.html`. A v6 foi descartada. A v4 foi arquivada em `versions/v4.html` (com os caminhos ajustados para `../`).

## Arquivos JS por versão

- `app-vitrine-v5.js` — usado pelo `index.html` no ar (v5). **É aqui que se edita a loja hoje.**
- `app-vitrine.js` — usado pela v4 arquivada (`versions/v4.html`).
- `app.js` — usado pelas versões arquivadas v1/v2/v3.

Todos os três compartilham a mesma base de analytics (GTM `GTM-5FJ655S4` + GA4 `G-2YQXF3HYTL`). Ver [GTM-SETUP.md](GTM-SETUP.md).

## Como editar os produtos (versão no ar)

Os produtos da vitrine ficam no topo de `app-vitrine-v5.js`, no array `products`. Cada produto tem nome, anotação manuscrita (`note`), descrição curta (`desc`), descrição completa (`fullDesc`), lista de detalhes (`details`), preços e foto. O selo de desconto é calculado sozinho quando `fromPrice` é preenchido.

## Como criar uma v6/v7 nova (rascunho)

Para experimentar sem afetar o site no ar, crie um arquivo próprio na raiz (ex.: `v6.html`) apontando para seus próprios CSS/JS, e teste em `https://www.arimarutilidades.com.br/v6.html` depois do push. Ao aprovar, promova para `index.html`.

## Como arquivar uma versão que sai do ar

1. Mover o HTML para `versions/` (ex.: `git mv v4.html versions/v4.html`).
2. Corrigir os caminhos relativos para subir um nível (o snapshot passa a viver dentro de `versions/`):

```bash
sed -i \
  -e 's|href="assets/|href="../assets/|g' \
  -e 's|href="styles|href="../styles|g' \
  -e 's|src="assets/|src="../assets/|g' \
  -e 's|src="app|src="../app|g' \
  versions/v4.html
```

Os arquivos de CSS/JS na raiz continuam intactos, servindo tanto o site no ar quanto as versões arquivadas.
