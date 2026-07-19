/* =====================================================
   ARIMAR UTILIDADES — v5 "Vitrine Carrossel"
   Mesmo design da v4, com os produtos em um carrossel
   (setas, dots, swipe e autoplay — mesma lógica do index).
===================================================== */
const WHATSAPP_DEFAULT = "558896223840";
const WHATSAPP_STORES = ["558893491883", "558896145011", "558896223840"];
// Converte o número sorteado de volta no "número" da loja (Loja 1/2/3),
// para que as métricas mostrem "produto X → Loja Y".
const STORE_NUMBER_TO_ID = {
  "558893491883": 1,
  "558896145011": 2,
  "558896223840": 3,
};
const GTM_CONTAINER_ID = "GTM-5FJ655S4";
// O GA4 agora é carregado e disparado DENTRO do GTM (não é mais carregado
// direto pela página). Este ID fica aqui só como referência p/ configurar o GTM.
const GA4_MEASUREMENT_ID = "G-2YQXF3HYTL";
const ANALYTICS_SESSION_KEY = "arimar_session_id";
const ANALYTICS_ATTRIBUTION_KEY = "arimar_attribution";

/* =====================================================
   PRODUTOS DA VITRINE — edite aqui
   Cada produto aceita:
   - name        nome exibido no card e na ficha
   - note        anotação manuscrita (opcional, ex.: "queridinho da semana")
   - desc        descrição curta exibida no card
   - fullDesc    descrição completa exibida na ficha (opcional; usa desc se vazio)
   - details     lista de detalhes exibida na ficha e como chips no card
   - pricePrefix "por" | "a partir de"
   - fromPrice   preço antigo "139,00" (opcional — gera o selo de desconto)
   - price       preço atual "99,00"
   - badge       texto do selo (opcional; com fromPrice o desconto é calculado sozinho)
   - image       caminho da foto
===================================================== */
const products = [
  {
    id: "coxa-cama-casal",
    name: "Coxa para Cama de Casal",
    note: "queridinha das mães",
    desc: "Deixa a cama arrumada e aconchegante o dia inteiro, com cara de quarto de revista.",
    fullDesc: "Deixa a cama arrumada e aconchegante o dia inteiro, com cara de quarto de revista. Peça na loja para ver as estampas disponíveis.",
    details: ["Tamanho casal", "Estampas variadas na loja", "Pronta entrega"],
    pricePrefix: "por",
    fromPrice: null,
    price: "99,90",
    badge: "OFERTA",
    image: "assets/products/2026/dia-das-maes/coxa-de-cama.jpeg",
  },
  {
    id: "guarda-tudo",
    name: "Guarda Tudo",
    note: "organiza qualquer canto",
    desc: "Acaba com a bagunça do quarto: roupa de cama, brinquedo e o que mais precisar guardar.",
    fullDesc: "Acaba com a bagunça do quarto: serve para roupa de cama, roupa de estação, brinquedos e o que mais precisar guardar bem guardado.",
    details: ["Espaçoso", "Fácil de montar", "Pronta entrega"],
    pricePrefix: "por",
    fromPrice: "139,00",
    price: "99,00",
    badge: null,
    image: "assets/products/2026/dia-das-maes/guarda-tudo.jpeg",
  },
  {
    id: "kits-presenteaveis",
    name: "Kits Presenteáveis",
    note: "pra presentear sem erro",
    desc: "Kits prontos para presente, em vários tamanhos e preços. É só escolher e levar.",
    fullDesc: "Kits prontos para presente, montados com carinho em vários tamanhos e preços. Diga quanto quer gastar que a gente monta a sugestão certa.",
    details: ["Opções a partir de R$ 10", "Vários tamanhos", "Prontos para dar de presente"],
    pricePrefix: "a partir de",
    fromPrice: null,
    price: "10,00",
    badge: "KITS",
    image: "assets/products/2026/dia-das-maes/kit-tupperware.jpeg",
  },
  {
    id: "conjunto-pratos",
    name: "Conjunto de Pratos",
    note: "mesa posta bonita",
    desc: "Renova a mesa de casa por pouco: bonito no dia a dia e pronto para receber visita.",
    fullDesc: "Renova a mesa de casa por pouco: bonito no dia a dia e pronto para receber visita. Venha ver de perto os modelos disponíveis na loja.",
    details: ["Modelos variados na loja", "Preço de vitrine", "Pronta entrega"],
    pricePrefix: "por",
    fromPrice: null,
    price: "39,90",
    badge: null,
    image: "assets/products/2026/dia-das-maes/pratos.jpeg",
  },
];

/* =====================================================
   ANALYTICS (GA4 / GTM)
===================================================== */
function safeJsonParse(value, fallback = {}) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getOrCreateSessionId() {
  const existing = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
  if (existing) return existing;

  const randomPart = Math.random().toString(36).slice(2, 8);
  const sessionId = `${Date.now().toString(36)}-${randomPart}`;
  sessionStorage.setItem(ANALYTICS_SESSION_KEY, sessionId);
  return sessionId;
}

function readAttributionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    referrer: document.referrer || "",
  };
}

function getOrCreateAttributionContext() {
  const stored = safeJsonParse(sessionStorage.getItem(ANALYTICS_ATTRIBUTION_KEY), null);
  if (stored) return stored;

  const fromUrl = readAttributionFromUrl();
  sessionStorage.setItem(ANALYTICS_ATTRIBUTION_KEY, JSON.stringify(fromUrl));
  return fromUrl;
}

function setupGTM() {
  const id = GTM_CONTAINER_ID.trim();
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
  document.head.appendChild(script);
}

function emitAnalyticsEvent(eventName, params = {}) {
  const attribution = getOrCreateAttributionContext();
  const payload = {
    event: eventName,
    session_id: getOrCreateSessionId(),
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
    event_time: new Date().toISOString(),
    ...attribution,
    ...params,
  };

  // Fonte única: empurra tudo para o dataLayer. Quem encaminha para o GA4
  // (ou Meta/Ads) é o GTM, através das tags configuradas no container.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function trackDatasetClickEvents() {
  document.addEventListener("click", event => {
    const el = event.target.closest("[data-track-event]");
    if (!el) return;

    const {
      trackEvent,
      trackSource,
      trackStoreId,
      trackOfferName,
      trackAction,
    } = el.dataset;

    emitAnalyticsEvent(trackEvent, {
      source: trackSource || "",
      store_id: trackStoreId || "",
      offer_name: trackOfferName || "",
      action: trackAction || "click",
    });
  });
}

/* =====================================================
   WHATSAPP — roteia os atendimentos entre as lojas
===================================================== */
function buildWhatsAppUrl(number, msg) {
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

function shuffleArray(values) {
  const arr = [...values];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Usa uma fila embaralhada para distribuir melhor os atendimentos entre as lojas.
const whatsappRouter = (() => {
  let bag = [];
  let lastNumber = null;

  function refillBag() {
    bag = shuffleArray(WHATSAPP_STORES);
    if (lastNumber && bag.length > 1 && bag[0] === lastNumber) {
      const swapIdx = bag.findIndex(number => number !== lastNumber);
      if (swapIdx > 0) {
        [bag[0], bag[swapIdx]] = [bag[swapIdx], bag[0]];
      }
    }
  }

  function pickNextNumber() {
    if (WHATSAPP_STORES.length === 1) return WHATSAPP_STORES[0];
    if (bag.length === 0) refillBag();

    const selected = bag.shift();
    lastNumber = selected;
    return selected;
  }

  function buildRandomUrl(msg) {
    const number = pickNextNumber();
    return { url: buildWhatsAppUrl(number, msg), number };
  }

  return { buildRandomUrl };
})();

function enableRandomWhatsappRouting() {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-wa-msg]");
    if (!link) return;

    const msg = link.dataset.waMsg;
    if (!msg) return;

    const { url, number } = whatsappRouter.buildRandomUrl(msg);
    link.href = url;

    // ESTE é o evento-chave: liga o produto/oferta clicado à loja sorteada.
    // Só dispara para links de produto/oferta/categoria (que têm data-wa-msg
    // e passam pelo sorteio) — os cards de loja vão direto e não caem aqui.
    emitAnalyticsEvent("product_store_redirect", {
      source: link.dataset.trackSource || "whatsapp",
      product_name: link.dataset.trackOfferName || link.dataset.trackCategoryName || "",
      product_id: link.closest("[data-product-id]")?.dataset.productId || "",
      category_name: link.dataset.trackCategoryName || "",
      store_id: STORE_NUMBER_TO_ID[number] || "",
      store_number: number,
    });
  });
}

/* =====================================================
   VITRINE — carrossel de produtos
   (mesma lógica do carrossel de ofertas do index)
===================================================== */
let vitrineIdx = 0; // índice lógico do produto (0..n-1)
let vitrinePos = 1; // posição física nos slides (há clones nas duas pontas)
let vitrineAutoplayTimer = null;
const VITRINE_AUTOPLAY_MS = 5000;
function getProductMessage(product) {
  return `Olá! Vi na vitrine do site e tenho interesse: ${product.name} (${product.pricePrefix} R$ ${product.price}).`;
}

function getProductUrl(product) {
  return buildWhatsAppUrl(WHATSAPP_DEFAULT, getProductMessage(product));
}

function getProductBadge(product) {
  if (product.fromPrice) {
    const from = Number(product.fromPrice.replace(",", "."));
    const now = Number(product.price.replace(",", "."));
    if (from > now && from > 0) {
      return `-${Math.round((1 - now / from) * 100)}%`;
    }
  }
  return product.badge;
}

function formatPrice(value) {
  const [intPart, decimalPart = "00"] = value.split(",");
  return `R$ ${intPart}<sup>,${decimalPart}</sup>`;
}

function buildEtiquetaHtml(product) {
  return `
    ${product.fromPrice ? `<span class="etiqueta__de">de R$ ${product.fromPrice}</span>` : ""}
    <span class="etiqueta__por"><small>${product.pricePrefix}</small>${formatPrice(product.price)}</span>
  `;
}

function resetVitrineAutoplay() {
  if (vitrineAutoplayTimer) {
    clearTimeout(vitrineAutoplayTimer);
  }

  vitrineAutoplayTimer = setTimeout(() => {
    stepVitrine(1, { interaction: "autoplay" });
  }, VITRINE_AUTOPLAY_MS);
}

function stopVitrineAutoplay() {
  if (vitrineAutoplayTimer) {
    clearTimeout(vitrineAutoplayTimer);
    vitrineAutoplayTimer = null;
  }
}

function setVitrineIndex(index, { resetAutoplay = true, interaction = "dot" } = {}) {
  normalizeVitrinePos();
  vitrineIdx = (index + products.length) % products.length;
  vitrinePos = vitrineIdx + 1;
  updateVitrine();
  emitAnalyticsEvent("vitrine_slide_view", {
    offer_name: products[vitrineIdx].name,
    offer_index: vitrineIdx + 1,
    interaction,
  });

  if (resetAutoplay) {
    resetVitrineAutoplay();
  }
}

function stepVitrine(step, { resetAutoplay = true, interaction = "navigation" } = {}) {
  normalizeVitrinePos();
  vitrineIdx = (vitrineIdx + step + products.length) % products.length;
  vitrinePos += step; // pode cair num clone (0 ou n+1); o salto acontece após a transição
  updateVitrine();
  emitAnalyticsEvent("vitrine_slide_view", {
    offer_name: products[vitrineIdx].name,
    offer_index: vitrineIdx + 1,
    interaction,
  });

  if (resetAutoplay) {
    resetVitrineAutoplay();
  }
}

function applyVitrineTransform() {
  document.getElementById("vitrine-slides").style.transform = `translateX(-${vitrinePos * 100}%)`;
}

function updateVitrine() {
  applyVitrineTransform();
  document.querySelectorAll(".vitrine__dot").forEach((d, i) => d.classList.toggle("is-active", i === vitrineIdx));
}

// Quando a transição termina sobre um clone, salta (sem animação) para o
// slide real equivalente — é isso que fecha o circuito do carrossel.
function normalizeVitrinePos() {
  const lastPos = products.length;
  if (vitrinePos !== 0 && vitrinePos !== lastPos + 1) return;

  vitrinePos = vitrinePos === 0 ? lastPos : 1;
  const slidesEl = document.getElementById("vitrine-slides");
  slidesEl.style.transition = "none";
  applyVitrineTransform();
  void slidesEl.offsetWidth; // força reflow antes de reativar a transição
  slidesEl.style.transition = "";
}

function enableVitrineSwipe() {
  const carouselEl = document.getElementById("vitrine-carousel");
  const slidesEl = document.getElementById("vitrine-slides");
  const swipeThreshold = 50;

  let startX = 0;
  let currentX = 0;
  let isSwiping = false;
  let suppressClick = false;

  const onSwipeStart = x => {
    normalizeVitrinePos(); // garante que o arrasto parte de um slide real
    startX = x;
    currentX = x;
    isSwiping = true;
    suppressClick = false;
    slidesEl.style.transition = "none";
  };

  const onSwipeMove = (x, ev) => {
    if (!isSwiping) return;
    currentX = x;
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 8) {
      suppressClick = true;
      ev.preventDefault();
    }

    slidesEl.style.transform = `translateX(calc(-${vitrinePos * 100}% + ${deltaX}px))`;
  };

  const onSwipeEnd = () => {
    if (!isSwiping) return;
    isSwiping = false;
    slidesEl.style.transition = "";

    const deltaX = currentX - startX;
    if (Math.abs(deltaX) >= swipeThreshold) {
      stepVitrine(deltaX < 0 ? 1 : -1, { interaction: "swipe" });
    } else {
      updateVitrine();
    }
  };

  carouselEl.addEventListener("touchstart", ev => {
    if (ev.touches.length !== 1) return;
    onSwipeStart(ev.touches[0].clientX);
  }, { passive: true });

  carouselEl.addEventListener("touchmove", ev => {
    if (ev.touches.length !== 1) return;
    onSwipeMove(ev.touches[0].clientX, ev);
  }, { passive: false });

  carouselEl.addEventListener("touchend", onSwipeEnd);
  carouselEl.addEventListener("touchcancel", onSwipeEnd);

  // Depois de um arrasto, o "click" residual não deve abrir link nem ficha.
  slidesEl.addEventListener("click", ev => {
    if (!suppressClick) return;
    if (!ev.target.closest("a, button")) return;
    ev.preventDefault();
    ev.stopPropagation();
    suppressClick = false;
  }, true);
}

function renderVitrine() {
  const slidesEl = document.getElementById("vitrine-slides");
  const dotsEl = document.getElementById("vitrine-dots");

  const buildSlideHtml = (p, i, { clone = false } = {}) => {
    const badge = getProductBadge(p);
    return `
      <div class="vitrine__slide"${clone ? ` inert aria-hidden="true"` : ""}>
        <article class="produto" data-product-id="${p.id}">
          <div class="produto__media">
            <img src="${p.image}" alt="${p.name}" loading="${!clone && i === 0 ? "eager" : "lazy"}" decoding="async">
            ${badge ? `<span class="produto__badge">${badge}</span>` : ""}
          </div>
          <div class="produto__body">
            ${p.note ? `<span class="produto__note">${p.note}</span>` : ""}
            <h3 class="produto__name">${p.name}</h3>
            <p class="produto__desc">${p.desc}</p>
            ${p.details?.length ? `<ul class="produto__details">${p.details.slice(0, 3).map(d => `<li>${d}</li>`).join("")}</ul>` : ""}
            <div class="produto__foot">
              <div class="etiqueta">${buildEtiquetaHtml(p)}</div>
              <div class="produto__actions">
                <a class="produto__buy" href="${getProductUrl(p)}" target="_blank" rel="noopener"
                   data-wa-msg="${getProductMessage(p)}"
                   data-track-event="product_whatsapp_click"
                   data-track-source="vitrine_card"
                   data-track-offer-name="${p.name}"
                   aria-label="Pedir ${p.name} no WhatsApp">
                  Pedir no WhatsApp
                </a>
                <button class="produto__more" data-open-product="${p.id}" aria-label="Ver detalhes de ${p.name}">
                  Ver detalhes
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    `;
  };

  // Clones do último e do primeiro nas pontas fecham o circuito:
  // retroceder do primeiro mostra o último chegando, e vice-versa.
  slidesEl.innerHTML = [
    buildSlideHtml(products[products.length - 1], products.length - 1, { clone: true }),
    ...products.map((p, i) => buildSlideHtml(p, i)),
    buildSlideHtml(products[0], 0, { clone: true }),
  ].join("");

  dotsEl.innerHTML = products.map((p, i) => `<button class="vitrine__dot${i === 0 ? " is-active" : ""}" data-idx="${i}" aria-label="Ir para ${p.name}"></button>`).join("");

  slidesEl.addEventListener("transitionend", event => {
    if (event.target !== slidesEl || event.propertyName !== "transform") return;
    normalizeVitrinePos();
  });

  slidesEl.addEventListener("click", event => {
    const btn = event.target.closest("[data-open-product]");
    if (!btn) return;
    const product = products.find(p => p.id === btn.dataset.openProduct);
    if (product) openSheet(product);
  });

  document.getElementById("vitrine-prev").addEventListener("click", () => stepVitrine(-1, { interaction: "prev" }));
  document.getElementById("vitrine-next").addEventListener("click", () => stepVitrine(1, { interaction: "next" }));
  dotsEl.addEventListener("click", e => {
    const b = e.target.closest(".vitrine__dot");
    if (!b) return;
    setVitrineIndex(+b.dataset.idx, { interaction: "dot" });
  });

  enableVitrineSwipe();

  // Posiciona no primeiro slide real (após o clone) sem animar o carregamento.
  slidesEl.style.transition = "none";
  updateVitrine();
  void slidesEl.offsetWidth;
  slidesEl.style.transition = "";

  emitAnalyticsEvent("vitrine_slide_view", {
    offer_name: products[vitrineIdx].name,
    offer_index: vitrineIdx + 1,
    interaction: "initial",
  });

  // Autoplay com reset a cada troca de slide.
  resetVitrineAutoplay();
}

/* =====================================================
   FICHA DO PRODUTO (bottom sheet)
===================================================== */
let sheetLastFocus = null;

function openSheet(product) {
  const sheet = document.getElementById("product-sheet");
  const badge = getProductBadge(product);

  document.getElementById("sheet-image").src = product.image;
  document.getElementById("sheet-image").alt = product.name;
  document.getElementById("sheet-name").textContent = product.name;
  document.getElementById("sheet-desc").textContent = product.fullDesc || product.desc;

  const badgeEl = document.getElementById("sheet-badge");
  badgeEl.hidden = !badge;
  if (badge) badgeEl.textContent = badge;

  const noteEl = document.getElementById("sheet-note");
  noteEl.hidden = !product.note;
  if (product.note) noteEl.textContent = product.note;

  document.getElementById("sheet-details").innerHTML =
    (product.details || []).map(d => `<li>${d}</li>`).join("");

  document.getElementById("sheet-price").innerHTML = buildEtiquetaHtml(product);

  const buyBtn = document.getElementById("sheet-buy");
  buyBtn.href = getProductUrl(product);
  buyBtn.dataset.waMsg = getProductMessage(product);
  buyBtn.dataset.trackEvent = "product_whatsapp_click";
  buyBtn.dataset.trackSource = "product_sheet";
  buyBtn.dataset.trackOfferName = product.name;

  // Pausa o carrossel enquanto a ficha está aberta.
  stopVitrineAutoplay();

  sheetLastFocus = document.activeElement;
  sheet.hidden = false;
  requestAnimationFrame(() => sheet.classList.add("is-open"));
  document.body.classList.add("sheet-open");
  document.getElementById("sheet-close").focus();

  emitAnalyticsEvent("product_detail_view", {
    offer_name: product.name,
    source: "vitrine_card",
  });
}

function closeSheet() {
  const sheet = document.getElementById("product-sheet");
  if (sheet.hidden) return;

  sheet.classList.remove("is-open");
  document.body.classList.remove("sheet-open");

  const hide = () => { sheet.hidden = true; };
  const panel = sheet.querySelector(".sheet__panel");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    hide();
  } else {
    panel.addEventListener("transitionend", hide, { once: true });
    setTimeout(hide, 420); // fallback caso o transitionend não dispare
  }

  if (sheetLastFocus) sheetLastFocus.focus();

  resetVitrineAutoplay();
}

function setupSheet() {
  document.getElementById("sheet-close").addEventListener("click", closeSheet);
  document.getElementById("sheet-backdrop").addEventListener("click", closeSheet);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeSheet();
  });
}

/* =====================================================
   LOJAS + MAPA
===================================================== */
const stores = [
  {
    id: 1,
    address: "Rua Cel Araújo Lima, 986",
    reference: "Atrás do mercado velho, ao lado da Macavi e próx. à Loja Maravilha",
    whatsapp: "https://wa.me/558893491883",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Cel+Ara%C3%BAjo+Lima+986+Russas+CE",
    embed: "https://maps.google.com/maps?q=Rua+Cel+Araujo+Lima+986+Russas+CE&output=embed",
    photo: "assets/loja1.webp",
  },
  {
    id: 2,
    address: "Rua Cel Araújo Lima, 1128",
    reference: "Ao lado da lanchonete China e Brasil, em frente à DamDam Baby",
    whatsapp: "https://wa.me/558896145011",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Cel+Ara%C3%BAjo+Lima+1128+Russas+CE",
    embed: "https://maps.google.com/maps?q=Rua+Cel+Araujo+Lima+1128+Russas+CE&output=embed",
    photo: "assets/loja2.webp",
  },
  {
    id: 3,
    address: "Rua Pe. Raul Vieira, 643",
    reference: "Próx. ao Bradesco e Americanas, ao lado da Ótica Diniz",
    whatsapp: "https://wa.me/558896223840",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Padre+Raul+Vieira+643+Russas+CE",
    embed: "https://maps.google.com/maps?q=Rua+Padre+Raul+Vieira+643+Russas+CE&output=embed",
    photo: "assets/loja3.webp",
  },
];

function renderStores() {
  const list = document.getElementById("stores-list");
  list.innerHTML = stores.map(s => `
    <a class="store" href="${s.whatsapp}" target="_blank" rel="noopener"
       data-track-event="store_whatsapp_click"
       data-track-source="store_card"
       data-track-store-id="${s.id}"
       aria-label="Falar com a Loja ${s.id} no WhatsApp">
      <div class="store__media">
        ${s.photo ? `<img class="store__photo" src="${s.photo}" alt="" loading="lazy">` : ""}
        <div class="store__num">LOJA 0${s.id}</div>
      </div>
      <div class="store__body">
        <div class="store__address">${s.address}</div>
        <div class="store__ref">${s.reference}</div>
        <div class="store__cta">
          Falar no WhatsApp
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </div>
      </div>
    </a>
  `).join("");
}

let mapIdx = 0;

function renderMap() {
  const tabs = document.getElementById("map-tabs");
  tabs.innerHTML = stores.map((s, i) => `<button class="map__tab${i === 0 ? " is-active" : ""}" data-idx="${i}">Loja ${s.id}</button>`).join("");
  tabs.addEventListener("click", e => {
    const b = e.target.closest(".map__tab");
    if (!b) return;
    const previousStore = stores[mapIdx]?.id || "";
    mapIdx = +b.dataset.idx;
    document.querySelectorAll(".map__tab").forEach((t, i) => t.classList.toggle("is-active", i === mapIdx));
    emitAnalyticsEvent("map_tab_change", {
      from_store_id: previousStore,
      to_store_id: stores[mapIdx].id,
    });
    updateMap();
  });
  updateMap();
}

function updateMap() {
  const s = stores[mapIdx];
  document.getElementById("map-info").innerHTML = `
    <div class="map__address">${s.address}</div>
    <div class="map__ref">${s.reference}</div>
  `;
  document.getElementById("map-iframe").src = s.embed;

  const routeBtn = document.getElementById("map-route");
  routeBtn.href = s.mapsUrl;
  routeBtn.dataset.trackEvent = "map_route_click";
  routeBtn.dataset.trackSource = "map_actions";
  routeBtn.dataset.trackStoreId = String(s.id);

  const wppBtn = document.getElementById("map-wpp");
  wppBtn.href = s.whatsapp;
  wppBtn.dataset.trackEvent = "map_whatsapp_click";
  wppBtn.dataset.trackSource = "map_actions";
  wppBtn.dataset.trackStoreId = String(s.id);
}

/* =====================================================
   HORÁRIO + STATUS
===================================================== */
const schedule = [
  { day: "Segunda a Sexta", hours: "07h30 — 18h", days: [1, 2, 3, 4, 5], openingMin: 7 * 60 + 30, closingMin: 18 * 60 },
  { day: "Sábado",          hours: "07h30 — 16h", days: [6],             openingMin: 7 * 60 + 30, closingMin: 16 * 60 },
  { day: "Domingo",         hours: "Fechado",     days: [0],             openingMin: null,        closingMin: null },
];

function renderHours() {
  const today = new Date().getDay();
  document.getElementById("hours-card").innerHTML = schedule.map(s => {
    const isToday = s.days.includes(today);
    const isClosed = s.hours === "Fechado";
    return `
      <div class="hours__row${isToday ? " is-today" : ""}">
        <div class="hours__day">
          ${s.day}
          ${isToday ? `<span class="hours__today-badge">HOJE</span>` : ""}
        </div>
        <div class="hours__time${isClosed ? " is-closed" : ""}">${s.hours}</div>
      </div>
    `;
  }).join("");
}

function renderStatus() {
  const now = new Date();
  const day = now.getDay();
  const min = now.getHours() * 60 + now.getMinutes();
  const todaySched = schedule.find(s => s.days.includes(day));
  const statusEl = document.getElementById("hero-status");
  const labelEl = document.getElementById("hero-status-label");
  const hoursEl = document.getElementById("hero-status-hours");

  function getNextOpeningInfo(fromDay) {
    for (let offset = 1; offset <= 7; offset++) {
      const targetDay = (fromDay + offset) % 7;
      const nextSched = schedule.find(s => s.days.includes(targetDay) && s.openingMin != null);
      if (nextSched) {
        return { offset, targetDay, nextSched };
      }
    }
    return null;
  }

  function formatOpening(openingMin) {
    const openH = Math.floor(openingMin / 60);
    const openM = openingMin % 60;
    return openM === 0 ? `${openH}h` : `${openH}h${String(openM).padStart(2, "0")}`;
  }

  if (!todaySched || todaySched.openingMin == null) {
    statusEl.classList.add("is-closed");
    labelEl.textContent = "Fechado hoje";
    const nextOpening = getNextOpeningInfo(day);
    if (nextOpening) {
      hoursEl.textContent = `abre ${nextOpening.nextSched.day.split(" ")[0].toLowerCase()} às ${formatOpening(nextOpening.nextSched.openingMin)}`;
    } else {
      hoursEl.textContent = "sem horário disponível";
    }
    return;
  }

  if (min >= todaySched.openingMin && min < todaySched.closingMin) {
    statusEl.classList.remove("is-closed");
    labelEl.textContent = "Aberto agora";
    const closeH = Math.floor(todaySched.closingMin / 60);
    hoursEl.textContent = `fecha às ${closeH}h`;
  } else {
    statusEl.classList.add("is-closed");
    labelEl.textContent = "Fechado agora";
    if (min < todaySched.openingMin) {
      hoursEl.textContent = `abre às ${formatOpening(todaySched.openingMin)}`;
    } else {
      const nextOpening = getNextOpeningInfo(day);
      if (nextOpening) {
        if (nextOpening.offset === 1) {
          hoursEl.textContent = `abre amanhã às ${formatOpening(nextOpening.nextSched.openingMin)}`;
        } else {
          hoursEl.textContent = `abre ${nextOpening.nextSched.day.split(" ")[0].toLowerCase()} às ${formatOpening(nextOpening.nextSched.openingMin)}`;
        }
      } else {
        hoursEl.textContent = "sem horário disponível";
      }
    }
  }
}

/* =====================================================
   REVEAL AO ROLAR
===================================================== */
function setupReveal() {
  const targets = document.querySelectorAll(".vitrine__carousel, .procura, .store, .map__card, .hours__card, .social");
  targets.forEach(el => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, i) => {
      const el = entry.target;
      const delay = Math.min(i * 90, 360);
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("is-in");
      io.unobserve(el);
      // Limpa o delay depois da entrada para não atrasar os hovers.
      setTimeout(() => { el.style.transitionDelay = ""; }, delay + 700);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  targets.forEach(el => io.observe(el));
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupGTM();
  trackDatasetClickEvents();
  emitAnalyticsEvent("page_view");

  enableRandomWhatsappRouting();
  renderVitrine();
  setupSheet();
  renderStores();
  renderMap();
  renderHours();
  renderStatus();
  setupReveal();

  const instagramLink = document.querySelector('.social[href*="instagram.com"]');
  if (instagramLink) {
    instagramLink.dataset.trackEvent = "instagram_click";
    instagramLink.dataset.trackSource = "social_card";
  }

  document.getElementById("foot-year").textContent = new Date().getFullYear();
});
