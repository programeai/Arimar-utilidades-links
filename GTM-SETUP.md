# Configuração de métricas — GTM + GA4

Guia de como o site alimenta as métricas e o que configurar na conta Google.

- **Container GTM:** `GTM-5FJ655S4`
- **Propriedade GA4:** `G-2YQXF3HYTL`
- **Domínio:** https://www.arimarutilidades.com.br

## Como funciona (arquitetura)

O site **não carrega mais o GA4 direto**. Toda a coleta segue este caminho:

```
site (app*.js) --> dataLayer --> GTM (GTM-5FJ655S4) --> GA4 (G-2YQXF3HYTL)
                                                    \--> (futuro: Meta Pixel, Google Ads...)
```

- O código só empurra eventos para o `dataLayer` (função `emitAnalyticsEvent`).
- O **GTM** é a única "central": ele carrega o GA4 e decide o que encaminhar.
- **Regra de ouro:** nunca colocar o `gtag.js`/GA4 direto na página de novo. Se fizer, os números **contam em dobro**.

> Enquanto o GTM não tiver a **Tag de Configuração do GA4** publicada (passo 3.1), o GA4 fica **sem dados**. Faça a configuração abaixo e publique o container.

## O que mudou no código

Nos três arquivos de JS (`app.js`, `app-vitrine.js`, `app-vitrine-v5.js`):

1. `GTM_CONTAINER_ID` preenchido com `GTM-5FJ655S4` (antes estava vazio, GTM desligado).
2. `setupGA4()` e a chamada direta do `gtag` foram **removidas** (o GA4 agora vive dentro do GTM).
3. **Novo evento `product_store_redirect`** — o mais importante. Quando o cliente clica num produto/oferta/categoria, o site sorteia a loja e agora **registra qual produto foi para qual loja**. Antes isso se perdia.

## Contrato do dataLayer (eventos disponíveis)

Todo evento já vem com: `session_id`, `page_path`, `page_title`, `event_time`,
`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer`.

| Evento (`event`)          | Quando dispara                                   | Parâmetros próprios |
|---------------------------|--------------------------------------------------|---------------------|
| `page_view`               | Ao abrir a página                                | — (ver nota 3.4) |
| **`product_store_redirect`** ⭐ | Clique em produto/oferta/categoria (após sortear a loja) | `product_name`, `product_id`, `category_name`, `store_id`, `store_number`, `source` |
| `product_whatsapp_click`  | Clique no botão "Pedir no WhatsApp" (vitrine)    | `source`, `offer_name` (= nome do produto) |
| `offer_click`             | Clique na oferta da semana (index)               | `source`, `offer_name` |
| `category_whatsapp_click` | Clique em card de categoria (index)              | `source`, `category_id`, `category_name` |
| `offer_view`              | Oferta exibida no carrossel                       | `offer_name`, `offer_index`, `interaction` |
| `vitrine_slide_view`      | Produto exibido no carrossel (v5)                 | `offer_name`/`interaction` |
| `product_detail_view`     | Abriu a ficha de detalhes do produto (vitrine)   | dados do produto |
| `store_whatsapp_click`    | Clique num **card de loja** (vai direto, sem sorteio) | `source`, `store_id` |
| `map_tab_change`          | Trocou a aba de loja no mapa                       | `from_store_id`, `to_store_id` |
| `map_route_click`         | Clique em "Traçar rota"                            | `source`, `store_id` |
| `map_whatsapp_click`      | Clique em "Falar" no mapa                          | `source`, `store_id` |
| `instagram_click`         | Clique no card do Instagram                        | `source` |

**Mapa loja → número (`store_id`):** `1` = Rua Cel Araújo Lima 986 · `2` = Rua Cel Araújo Lima 1128 · `3` = Rua Pe. Raul Vieira 643 (também é o número padrão).

---

## Passo a passo no GTM

Abra https://tagmanager.google.com → container `GTM-5FJ655S4`.

### 1. Variáveis (Variables)

Ative as variáveis internas de clique/página em **Variables → Configure** (marque tudo em "Clicks" e "Page Variables").

Depois crie **Variáveis da camada de dados** (New → Data Layer Variable). O "Data Layer Variable Name" tem que ser **idêntico** ao parâmetro:

- `product_name`
- `product_id`
- `category_name`
- `store_id`
- `store_number`
- `source`
- `offer_name`
- `offer_index`
- `interaction`
- `session_id`
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer`

### 2. Acionadores (Triggers)

Crie um trigger do tipo **Custom Event** para cada evento que quiser mandar ao GA4. Comece pelo essencial (o resto é opcional):

| Nome do Trigger              | Tipo         | Event name (exato)         |
|------------------------------|--------------|----------------------------|
| CE - product_store_redirect ⭐ | Custom Event | `product_store_redirect`   |
| CE - product_whatsapp_click  | Custom Event | `product_whatsapp_click`   |
| CE - offer_click             | Custom Event | `offer_click`              |
| CE - store_whatsapp_click    | Custom Event | `store_whatsapp_click`     |
| CE - category_whatsapp_click | Custom Event | `category_whatsapp_click`  |
| CE - map_whatsapp_click      | Custom Event | `map_whatsapp_click`       |
| CE - offer_view              | Custom Event | `offer_view`               |

### 3. Tags

#### 3.1 Tag de Configuração do GA4 (obrigatória, primeiro)

- Tag type: **Google Tag** (Google tag)
- Tag ID / Measurement ID: `G-2YQXF3HYTL`
- Trigger: **Initialization - All Pages** (ou All Pages)

Isso liga o GA4 e já cobre o **pageview automático**.

#### 3.2 Tag de evento — `product_store_redirect` ⭐ (a métrica que você quer)

- Tag type: **GA4 Event**
- Configuration tag / Measurement ID: `G-2YQXF3HYTL`
- Event Name: `product_store_redirect`
- **Event Parameters** (Parameter → Value):
  - `product_name` → `{{product_name}}`
  - `product_id` → `{{product_id}}`
  - `category_name` → `{{category_name}}`
  - `store_id` → `{{store_id}}`
  - `store_number` → `{{store_number}}`
  - `source` → `{{source}}`
  - `session_id` → `{{session_id}}`
- Trigger: **CE - product_store_redirect**

#### 3.3 Demais tags de evento (opcional, mesmo molde)

Repita 3.2 para `product_whatsapp_click`, `offer_click`, `store_whatsapp_click`, etc., mapeando os parâmetros correspondentes da tabela.

#### 3.4 Sobre o `page_view` (importante)

O site empurra um evento `page_view` no dataLayer, **mas não crie uma tag para ele** — a Tag de Configuração do GA4 (3.1) já registra o pageview automaticamente. Criar uma tag para o `page_view` do dataLayer geraria **pageview em dobro** (`page_view` é nome reservado do GA4).

---

## GA4 — registrar dimensões personalizadas

No GA4, os parâmetros só viram coluna de relatório depois de registrados.

**Admin → Custom definitions → Create custom dimension** (escopo **Event**), um para cada:

| Dimension name | Scope | Event parameter |
|----------------|-------|-----------------|
| Loja (número)  | Event | `store_id`      |
| WhatsApp loja  | Event | `store_number`  |
| Produto        | Event | `product_name`  |
| ID do produto  | Event | `product_id`    |
| Origem clique  | Event | `source`        |
| Categoria      | Event | `category_name` |
| Sessão         | Event | `session_id`    |

> Custa nada, mas leva ~24–48h para os dados históricos aparecerem nos relatórios padrão. No **DebugView** aparece na hora.

---

## Relatório "produto X → loja Y"

No GA4: **Explore → Free form (Exploração em branco)**:

1. **Dimensions:** adicione `Produto` (product_name) e `Loja (número)` (store_id).
2. **Metrics:** adicione **Event count**.
3. **Rows:** `Produto`. **Columns:** `Loja (número)`.
4. **Filter:** `Event name` exatamente `product_store_redirect`.

Resultado: uma tabela cruzada com quantos cliques de cada produto foram para cada loja — exatamente "quantos clientes clicaram no produto X e foram para a loja Y".

Variações úteis:
- Trocar Rows para `Origem clique` (`source`) → de onde vêm os cliques (vitrine, oferta, categoria).
- Adicionar `Sessão` (`session_id`) como métrica de contagem distinta → cliques por pessoa.
- Filtrar por `utm_source`/`utm_campaign` → desempenho de campanhas (ex.: link do Instagram).

---

## Testar antes de publicar

1. No GTM, clique em **Preview** e informe `https://www.arimarutilidades.com.br` (ou rode o site localmente).
2. Clique num produto → no painel do Tag Assistant deve aparecer o evento `product_store_redirect` e a tag correspondente disparando.
3. No GA4, abra **Admin → DebugView** e confira o evento chegando com `store_id`, `product_name`, etc.
4. Deu certo? **Submit / Publish** o container no GTM.

## Checklist rápido

- [ ] Deploy do site com o novo código (GTM ligado, GA4 direto removido).
- [ ] Tag de Configuração do GA4 publicada no GTM (senão GA4 fica vazio).
- [ ] Tag + trigger de `product_store_redirect` publicados.
- [ ] Dimensões personalizadas criadas no GA4.
- [ ] Testado no Preview + DebugView.
- [ ] **Não** existe GA4/gtag direto na página nem tag duplicada de `page_view`.
