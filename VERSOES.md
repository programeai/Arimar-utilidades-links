# Versões do site

A versão publicada é sempre o `index.html` da raiz. As versões antigas ficam guardadas em `versions/` e as versões novas ficam em arquivos próprios na raiz até serem promovidas.

## Histórico

| Versão | Arquivo | Estilo | Situação |
|--------|---------|--------|----------|
| v1 | `versions/v1.html` | Primeira versão (usa `styles.css`) | Arquivada |
| v2 | `versions/v2.html` | Cabeçalho limpo, com card VIP (usa `styles.css`) | Arquivada |
| v3 | `versions/v3.html` | Snapshot da versão ao ar em 07/2026 (usa `styles.css` + `app.js`) | **No ar** (é o `index.html` atual) |
| v4 | `v4.html` | "Vitrine" — vitrine de produtos com detalhes (usa `styles-vitrine.css` + `app-vitrine.js`) | Em avaliação |
| v5 | `v5.html` | "Vitrine Carrossel" — mesmo visual da v4, com os produtos em carrossel como no index (usa `styles-vitrine-v5.css` + `app-vitrine-v5.js`) | Em avaliação |
| v6 | `v6.html` | Rascunho a partir da v4 (ainda usa `styles-vitrine.css` + `app-vitrine.js`, sem mudança funcional própria ainda) | Em avaliação |

## Como visualizar a v4 sem publicar

Localmente, abra `v4.html` no navegador. Depois de dar push, ela também fica acessível em:

```
https://www.arimarutilidades.com.br/v4.html
```

## Como publicar a v4

A v4 usa arquivos próprios (`styles-vitrine.css` e `app-vitrine.js`), então basta trocar o `index.html`:

```bash
cp v4.html index.html
```

Os arquivos `styles.css` e `app.js` continuam intactos, servindo as versões arquivadas.

## Como voltar para a v3

```bash
sed -e 's|\.\./||g' versions/v3.html > index.html
```

(O `sed` só corrige os caminhos `../` do snapshot para a raiz.)

## Como editar os produtos da v4

Os produtos da vitrine ficam no topo de `app-vitrine.js`, no array `products`. Cada produto tem nome, anotação manuscrita (`note`), descrição curta (`desc`), descrição completa (`fullDesc`), lista de detalhes (`details`), preços e foto. O selo de desconto é calculado sozinho quando `fromPrice` é preenchido.

## v5 — Vitrine Carrossel

A v5 preserva todo o design da v4, mas troca a "prateleira" de cards empilhados por um carrossel de produtos com a mesma lógica do carrossel de ofertas do index: setas, dots, swipe no celular e autoplay a cada 5 segundos (pausado enquanto a ficha do produto está aberta).

- Visualizar sem publicar: abra `v5.html` no navegador (ou `https://www.arimarutilidades.com.br/v5.html` depois do push).
- Publicar: `cp v5.html index.html` (ela usa arquivos próprios, `styles-vitrine-v5.css` e `app-vitrine-v5.js`).
- Editar produtos: mesmo esquema da v4, no array `products` no topo de `app-vitrine-v5.js`.
