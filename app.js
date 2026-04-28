/* =====================================================
   ARIMAR UTILIDADES — Link in Bio
===================================================== */
const WHATSAPP_DEFAULT = "558896223840";
const WHATSAPP_STORES = ["558893491883", "558896145011", "558896223840"];

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
    return buildWhatsAppUrl(pickNextNumber(), msg);
  }

  return { buildRandomUrl };
})();

/* ---------- ICONS (inline SVG strings) ---------- */
const ICONS = {
  utensils: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.7 1.3 3 3 3v10"/><path d="M7 2v20"/><path d="M21 15V2c-2.2 0-4 1.8-4 4v6c0 1.7 1.3 3 3 3"/><path d="M21 15v7"/></svg>`,
  pot: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M3 12v6a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-6"/><path d="M7 12V8a5 5 0 0 1 10 0v4"/><path d="M5 8h2M17 8h2"/></svg>`,
  gift: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8s-2.5 0-4.5 0z"/><path d="M16.5 8a2.5 2.5 0 0 0 0-5C14.5 3 12 8 12 8s2.5 0 4.5 0z"/></svg>`,
  bed: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18V6"/><path d="M2 12h20v6"/><path d="M22 18v2"/><path d="M2 18v2"/><path d="M7 12V9a2 2 0 0 1 2-2h7a3 3 0 0 1 3 3v2"/></svg>`,
};

/* ---------- 1. CATEGORIES ---------- */
const categories = [
  { id: 1, title: "Cozinha & Mesa",        sub: "Pratos, talheres, copos",   icon: ICONS.utensils, color: "#E63946", shadow: "rgba(230, 57, 70, 0.5)",  msg: "Olá! Gostaria de ver produtos da categoria Cozinha & Mesa." },
  { id: 2, title: "Panelas & Utensílios",  sub: "Cookware e bazar",          icon: ICONS.pot,      color: "#2A9D5F", shadow: "rgba(42, 157, 95, 0.5)",  msg: "Olá! Gostaria de ver produtos da categoria Panelas & Utensílios." },
  { id: 3, title: "Presentes",             sub: "Lembrancinhas e kits",      icon: ICONS.gift,     color: "#F4B324", shadow: "rgba(244, 179, 36, 0.5)", msg: "Olá! Gostaria de ver produtos da categoria Presentes." },
  { id: 4, title: "Cama, Mesa & Banho",    sub: "Enxoval e roupa de cama",   icon: ICONS.bed,      color: "#2D7DD2", shadow: "rgba(45, 125, 210, 0.5)", msg: "Olá! Gostaria de ver produtos da categoria Cama, Mesa & Banho." },
];

function renderCats() {
  const grid = document.getElementById("cats-grid");
  grid.innerHTML = categories.map((c, i) => {
    const url = buildWhatsAppUrl(WHATSAPP_DEFAULT, c.msg);
    return `
      <a class="cat" href="${url}" target="_blank" rel="noopener"
         data-wa-msg="${c.msg}"
         style="--cat-color:${c.color};--cat-shadow:${c.shadow}"
         aria-label="Ver ${c.title}">
        <div class="cat__num">CAT · 0${c.id}</div>
        <svg class="cat__arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
        <div class="cat__icon">${c.icon}</div>
        <div>
          <h3 class="cat__title">${c.title}</h3>
          <p class="cat__sub">${c.sub}</p>
        </div>
      </a>
    `;
  }).join("");
}

/* ---------- 2. OFERTA — CARROSSEL ---------- */
/* Placeholder slides com SVG ilustrativos — substitua por fotos reais. */
const offers = [
  {
    name: "Jogo de Panelas Antiaderente",
    fromPrice: "89,90",
    price: "49,90",
    bg: "#FFE9D6",
    art: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="200" height="160" fill="none"/>
      <ellipse cx="100" cy="125" rx="70" ry="6" fill="#000" opacity="0.08"/>
      <path d="M40 60 Q40 50 50 50 H150 Q160 50 160 60 V100 Q160 120 140 120 H60 Q40 120 40 100 Z" fill="#1a1a1a"/>
      <path d="M40 60 H160 V70 H40 Z" fill="#F85C00"/>
      <rect x="22" y="62" width="22" height="6" rx="3" fill="#1a1a1a"/>
      <rect x="156" y="62" width="22" height="6" rx="3" fill="#1a1a1a"/>
      <ellipse cx="100" cy="58" rx="56" ry="6" fill="#444"/>
      <ellipse cx="100" cy="56" rx="50" ry="4" fill="#666"/>
    </svg>`
  },
  {
    name: "Kit Tigelas 12 peças",
    fromPrice: "79,90",
    price: "39,90",
    bg: "#E8F5E9",
    art: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="135" rx="80" ry="6" fill="#000" opacity="0.08"/>
      <path d="M50 80 Q50 120 100 120 Q150 120 150 80 Z" fill="#2A9D5F"/>
      <ellipse cx="100" cy="80" rx="50" ry="10" fill="#37b06c"/>
      <ellipse cx="100" cy="80" rx="42" ry="6" fill="#1d6d3f"/>
      <path d="M70 60 Q70 90 100 90 Q130 90 130 60 Z" fill="#F85C00" opacity="0.8"/>
      <ellipse cx="100" cy="60" rx="30" ry="6" fill="#FF7A2A"/>
      <path d="M85 48 Q85 60 100 60 Q115 60 115 48 Z" fill="#E63946"/>
      <ellipse cx="100" cy="48" rx="15" ry="3" fill="#ff6363"/>
    </svg>`
  },
  {
    name: "Jogo de Cama Casal 4 peças",
    fromPrice: "119,90",
    price: "69,90",
    bg: "#E3F2FD",
    art: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="140" rx="80" ry="5" fill="#000" opacity="0.08"/>
      <rect x="20" y="80" width="160" height="40" rx="6" fill="#2D7DD2"/>
      <rect x="20" y="80" width="160" height="12" rx="6" fill="#FFFFFF"/>
      <rect x="35" y="55" width="50" height="32" rx="6" fill="#FFFFFF"/>
      <rect x="115" y="55" width="50" height="32" rx="6" fill="#FFFFFF"/>
      <rect x="35" y="55" width="50" height="32" rx="6" fill="none" stroke="#2D7DD2" stroke-width="2"/>
      <rect x="115" y="55" width="50" height="32" rx="6" fill="none" stroke="#2D7DD2" stroke-width="2"/>
      <circle cx="60" cy="71" r="3" fill="#F85C00"/>
      <circle cx="140" cy="71" r="3" fill="#F85C00"/>
      <rect x="14" y="118" width="172" height="6" rx="2" fill="#1a3a5c"/>
    </svg>`
  },
  {
    name: "Cesto Organizador",
    fromPrice: "59,90",
    price: "29,90",
    bg: "#FFF4E0",
    art: `<svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="135" rx="70" ry="5" fill="#000" opacity="0.08"/>
      <path d="M55 60 L145 60 L155 130 L45 130 Z" fill="#F4B324"/>
      <path d="M55 60 L145 60 L150 75 L50 75 Z" fill="#FFD466"/>
      <path d="M50 75 L150 75 L155 130 L45 130 Z" fill="none" stroke="#b8830c" stroke-width="1" opacity="0.4"/>
      <line x1="60" y1="80" x2="62" y2="125" stroke="#b8830c" stroke-width="1.5" opacity="0.4"/>
      <line x1="80" y1="80" x2="82" y2="125" stroke="#b8830c" stroke-width="1.5" opacity="0.4"/>
      <line x1="100" y1="80" x2="100" y2="125" stroke="#b8830c" stroke-width="1.5" opacity="0.4"/>
      <line x1="120" y1="80" x2="118" y2="125" stroke="#b8830c" stroke-width="1.5" opacity="0.4"/>
      <line x1="140" y1="80" x2="138" y2="125" stroke="#b8830c" stroke-width="1.5" opacity="0.4"/>
      <ellipse cx="100" cy="60" rx="45" ry="6" fill="#d99a17"/>
      <ellipse cx="100" cy="58" rx="40" ry="3" fill="#FFE0A0"/>
    </svg>`
  },
];

let offerIdx = 0;

function getOfferUrl(offer) {
  const msg = `Olá! Tenho interesse na oferta da semana: ${offer.name} por R$ ${offer.price}.`;
  return buildWhatsAppUrl(WHATSAPP_DEFAULT, msg);
}

function getOfferMessage(offer) {
  return `Olá! Tenho interesse na oferta da semana: ${offer.name} por R$ ${offer.price}.`;
}

function formatOfferPrice(value) {
  const [intPart, decimalPart = "00"] = value.split(",");
  return `R$ ${intPart}<sup>,${decimalPart}</sup>`;
}

function stepOffer(step) {
  offerIdx = (offerIdx + step + offers.length) % offers.length;
  updateOffer();
}

function enableOfferSwipe() {
  const carouselEl = document.getElementById("offer-carousel");
  const slidesEl = document.getElementById("offer-slides");
  const swipeThreshold = 50;

  let startX = 0;
  let currentX = 0;
  let isSwiping = false;
  let suppressClick = false;

  const onSwipeStart = x => {
    startX = x;
    currentX = x;
    isSwiping = true;
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

    slidesEl.style.transform = `translateX(calc(-${offerIdx * 100}% + ${deltaX}px))`;
  };

  const onSwipeEnd = () => {
    if (!isSwiping) return;
    isSwiping = false;
    slidesEl.style.transition = "";

    const deltaX = currentX - startX;
    if (Math.abs(deltaX) >= swipeThreshold) {
      stepOffer(deltaX < 0 ? 1 : -1);
    } else {
      updateOffer();
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

  slidesEl.addEventListener("click", ev => {
    const clickedSlide = ev.target.closest(".offer__slide-link");
    if (!clickedSlide) return;
    if (!suppressClick) return;
    ev.preventDefault();
    ev.stopPropagation();
    suppressClick = false;
  }, true);
}

function renderOffer() {
  const slidesEl = document.getElementById("offer-slides");
  const dotsEl = document.getElementById("offer-dots");
  slidesEl.innerHTML = offers.map(o => `
    <a class="offer__slide offer__slide-link" href="${getOfferUrl(o)}" target="_blank" rel="noopener" data-wa-msg="${getOfferMessage(o)}" aria-label="Ver oferta de ${o.name}" style="--slide-bg:${o.bg}">
      <div class="offer__slide-art">${o.art}</div>
      <div class="offer__slide-name">${o.name}</div>
    </a>
  `).join("");
  dotsEl.innerHTML = offers.map((_, i) => `<button class="offer__dot${i === 0 ? " is-active" : ""}" data-idx="${i}" aria-label="Ir para slide ${i+1}"></button>`).join("");
  updateOffer();

  document.getElementById("offer-prev").addEventListener("click", () => stepOffer(-1));
  document.getElementById("offer-next").addEventListener("click", () => stepOffer(1));
  dotsEl.addEventListener("click", e => {
    const b = e.target.closest(".offer__dot");
    if (!b) return;
    offerIdx = +b.dataset.idx;
    updateOffer();
  });

  enableOfferSwipe();

  // Autoplay
  setInterval(() => {
    stepOffer(1);
  }, 5000);
}
function updateOffer() {
  const offer = offers[offerIdx];
  document.getElementById("offer-slides").style.transform = `translateX(-${offerIdx * 100}%)`;
  document.querySelectorAll(".offer__dot").forEach((d, i) => d.classList.toggle("is-active", i === offerIdx));
  document.getElementById("offer-from").textContent = `de R$ ${offer.fromPrice}`;
  document.getElementById("offer-price").innerHTML = formatOfferPrice(offer.price);

  const buyBtn = document.getElementById("offer-buy");
  buyBtn.href = getOfferUrl(offer);
  buyBtn.dataset.waMsg = getOfferMessage(offer);
  buyBtn.setAttribute("aria-label", `Quero a oferta ${offer.name}`);
}

function enableRandomWhatsappRouting() {
  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-wa-msg]");
    if (!link) return;

    const msg = link.dataset.waMsg;
    if (!msg) return;

    link.href = whatsappRouter.buildRandomUrl(msg);
  });
}

/* ---------- 3. STORES (cards) + 4. MAP (tabs) ---------- */
const stores = [
  {
    id: 1,
    address: "Rua Cel Araújo Lima, 986",
    reference: "Atrás do mercado velho, ao lado da Macavi e próx. à Loja Maravilha",
    whatsapp: "https://wa.me/558893491883",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Cel+Ara%C3%BAjo+Lima+986+Russas+CE",
    embed: "https://maps.google.com/maps?q=Rua+Cel+Araujo+Lima+986+Russas+CE&output=embed",
    bgFrom: "#F85C00", bgTo: "#C44400",
    photo: "assets/fachada.webp",
  },
  {
    id: 2,
    address: "Rua Cel Araújo Lima, 1128",
    reference: "Ao lado da lanchonete China e Brasil, em frente à DamDam Baby",
    whatsapp: "https://wa.me/558896145011",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Cel+Ara%C3%BAjo+Lima+1128+Russas+CE",
    embed: "https://maps.google.com/maps?q=Rua+Cel+Araujo+Lima+1128+Russas+CE&output=embed",
    bgFrom: "#2A9D5F", bgTo: "#176E3F",
    photo: "assets/fachada.webp",
  },
  {
    id: 3,
    address: "Rua Pe. Raul Vieira, 643",
    reference: "Próx. ao Bradesco e Americanas, ao lado da Ótica Diniz",
    whatsapp: "https://wa.me/558896223840",
    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Padre+Raul+Vieira+643+Russas+CE",
    embed: "https://maps.google.com/maps?q=Rua+Padre+Raul+Vieira+643+Russas+CE&output=embed",
    bgFrom: "#2D7DD2", bgTo: "#1a4d8a",
    photo: "assets/fachada.webp",
  },
];

function renderStores() {
  const list = document.getElementById("stores-list");
  list.innerHTML = stores.map(s => `
    <a class="store" href="${s.whatsapp}" target="_blank" rel="noopener"
       style="--store-bg-from:${s.bgFrom};--store-bg-to:${s.bgTo}"
       aria-label="Falar com Loja ${s.id}">
      <div class="store__media">
        ${s.photo ? `<img class="store__photo" src="${s.photo}" alt=""><div class="store__photo-overlay"></div>` : ""}
        <div class="store__num">
          <span class="store__num-prefix">LOJA</span>
          0${s.id}
        </div>
      </div>
      <div class="store__body">
        <div class="store__address" data-loja="${s.id}">${s.address}</div>
        <div class="store__ref">${s.reference}</div>
        <div class="store__cta">
          Falar no WhatsApp
          <svg class="store__cta-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
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
    mapIdx = +b.dataset.idx;
    document.querySelectorAll(".map__tab").forEach((t, i) => t.classList.toggle("is-active", i === mapIdx));
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
  document.getElementById("map-route").href = s.mapsUrl;
  document.getElementById("map-wpp").href = s.whatsapp;
}

/* ---------- 5. HOURS ---------- */
const schedule = [
  { day: "Segunda a Sexta", hours: "07h30 — 18h", days: [1, 2, 3, 4, 5], openingMin: 7 * 60 + 30, closingMin: 18 * 60 },
  { day: "Sábado",          hours: "07h30 — 16h", days: [6],             openingMin: 7 * 60 + 30, closingMin: 16 * 60 },
  { day: "Domingo",         hours: "Fechado",   days: [0],             openingMin: null,    closingMin: null   },
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

/* ---------- HERO STATUS (open/closed live) ---------- */
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

  if (!todaySched || todaySched.openingMin == null) {
    statusEl.classList.add("is-closed");
    labelEl.textContent = "Fechado hoje";
    const nextOpening = getNextOpeningInfo(day);
    if (nextOpening) {
      const openH = Math.floor(nextOpening.nextSched.openingMin / 60);
      const openM = nextOpening.nextSched.openingMin % 60;
      const openTime = openM === 0 ? `${openH}h` : `${openH}h${String(openM).padStart(2, "0")}`;
      hoursEl.textContent = `Abre ${nextOpening.nextSched.day.split(" ")[0].toLowerCase()} às ${openTime}`;
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
      const openH = Math.floor(todaySched.openingMin / 60);
      const openM = todaySched.openingMin % 60;
      const openTime = openM === 0 ? `${openH}h` : `${openH}h${String(openM).padStart(2, "0")}`;
      hoursEl.textContent = `abre às ${openTime}`;
    } else {
      const nextOpening = getNextOpeningInfo(day);
      if (nextOpening) {
        const openH = Math.floor(nextOpening.nextSched.openingMin / 60);
        const openM = nextOpening.nextSched.openingMin % 60;
        const openTime = openM === 0 ? `${openH}h` : `${openH}h${String(openM).padStart(2, "0")}`;
        if (nextOpening.offset === 1) {
          hoursEl.textContent = `abre amanhã às ${openTime}`;
        } else {
          hoursEl.textContent = `abre ${nextOpening.nextSched.day.split(" ")[0].toLowerCase()} às ${openTime}`;
        }
      } else {
        hoursEl.textContent = "sem horário disponível";
      }
    }
  }
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  enableRandomWhatsappRouting();
  renderCats();
  renderOffer();
  renderStores();
  renderMap();
  renderHours();
  renderStatus();
  document.getElementById("foot-year").textContent = new Date().getFullYear();
});
