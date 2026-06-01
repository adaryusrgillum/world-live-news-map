// Common ways countries appear in headlines, mapped to their canonical name in the
// world GeoJSON. Lets the detector catch "U.S.", "UK", "UAE" etc.
const COUNTRY_ALIASES = {
  "united states": "United States of America",
  "u.s.": "United States of America",
  "u.s": "United States of America",
  us: "United States of America",
  usa: "United States of America",
  america: "United States of America",
  american: "United States of America",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  britain: "United Kingdom",
  british: "United Kingdom",
  england: "United Kingdom",
  russia: "Russia",
  russian: "Russia",
  uae: "United Arab Emirates",
  "south korea": "South Korea",
  "north korea": "North Korea",
  "czech republic": "Czechia",
  burma: "Myanmar",
  "ivory coast": "Côte d'Ivoire",
  drc: "Dem. Rep. Congo",
  "democratic republic of congo": "Dem. Rep. Congo",
  "republic of congo": "Congo",
  swaziland: "eSwatini",
  turkey: "Turkey",
  türkiye: "Turkey"
};

const FALLBACK_ARTICLES = [
  ["United States of America", "Technology leaders brief officials on AI infrastructure investment", "Regional Desk", "ai"],
  ["United Kingdom", "Markets open mixed as investors weigh retail and banking updates", "Market Daily", "business"],
  ["Ukraine", "Front-line commanders report shifting positions amid renewed strikes", "Wire Service", "politics"],
  ["China", "Manufacturers race to ship advanced semiconductors before new rules", "Trade Monitor", "technology"],
  ["India", "Health systems expand mobile care teams across rural districts", "Health Review", "health"],
  ["Israel", "Negotiators weigh next steps as ceasefire talks continue", "Global Desk", "politics"],
  ["Germany", "Energy operators monitor demand as a heat wave spreads across Europe", "Energy Wire", "weather"],
  ["Brazil", "Football federation overhauls youth recruitment ahead of new season", "Sports Desk", "sports"]
].map(([state, title, source, category], index) => ({
  id: `fallback-${index}`,
  title,
  source,
  category,
  state,
  onMap: true,
  url: "#",
  seen: new Date(Date.now() - index * 28 * 60 * 1000).toISOString()
}));

const HAS_HTTP_ORIGIN = /^https?:$/.test(window.location.protocol);
const YOUTUBE_EMBED_ORIGIN = HAS_HTTP_ORIGIN ? window.location.origin : "";
const YOUTUBE_EMBED_PARAMS = "autoplay=0&mute=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1";

const LIVE_STREAMS = [
  {
    name: "Al Jazeera English",
    group: "War & Conflict",
    category: "Middle East",
    accent: "#ff4138",
    preview: "Middle East, Gaza, Ukraine, global conflict desk",
    channelId: "UCNye-wNBqNL5ZzHSJj3l8Bg",
    url: "https://www.youtube.com/@aljazeeraenglish/live"
  },
  {
    name: "DW News",
    group: "War & Conflict",
    category: "Europe",
    accent: "#4da3ff",
    preview: "Ukraine, Russia, Europe, Middle East",
    channelId: "UCknLrEdhRCp1aegoMqRaCZg",
    url: "https://www.youtube.com/@dwnews/live"
  },
  {
    name: "France 24 English",
    group: "War & Conflict",
    category: "Global",
    accent: "#2f6fff",
    preview: "Conflict zones, Africa, Middle East",
    channelId: "UCQfwfsi5VrQ8yKZ-UWmAEFg",
    url: "https://www.youtube.com/@France24_en/live"
  },
  {
    name: "TRT World",
    group: "War & Conflict",
    category: "Middle East",
    accent: "#28c7d8",
    preview: "Middle East, Syria, Gaza, global breaking",
    channelId: "UC7fWeaHhqgM4Ry-RMpM2YYw",
    url: "https://www.youtube.com/@trtworld/live"
  },
  {
    name: "Times of Israel",
    group: "War & Conflict",
    category: "Israel",
    accent: "#8ab4ff",
    preview: "Israel-Gaza war updates",
    channelId: "UCKM3VQFIITaRegPDkLlLeKA",
    url: "https://www.youtube.com/@TimesofIsrael/live"
  },
  {
    name: "i24NEWS English",
    group: "War & Conflict",
    category: "Israel",
    accent: "#36a3ff",
    preview: "Israel and Middle East coverage",
    channelId: "UCvHDpsWKADrDia0c99X37vg",
    url: "https://www.youtube.com/@i24NEWS_EN/live"
  },
  {
    name: "The Kyiv Independent",
    group: "War & Conflict",
    category: "Ukraine",
    accent: "#ffd447",
    preview: "Ukraine war reporting in English",
    channelId: "UCGAC5yzlYgjKoJABDZ7zEyw",
    url: "https://www.youtube.com/@kyivindependent/live"
  },
  {
    name: "UATV English",
    group: "War & Conflict",
    category: "Ukraine",
    accent: "#6bb7ff",
    preview: "Ukraine official English news",
    channelId: "UCOmfcmDrWs7iJrXx7V5Cnwg",
    url: "https://www.youtube.com/@UATVEnglish/live"
  },
  {
    name: "FREEDOM.LIVE",
    group: "War & Conflict",
    category: "Ukraine",
    accent: "#7b61ff",
    preview: "Ukraine front-line coverage",
    channelId: "UCOqFkpNwNLPGOb8EC-mwZYg",
    url: "https://www.youtube.com/channel/UCOqFkpNwNLPGOb8EC-mwZYg/live"
  },
  {
    name: "Sky News",
    group: "War & Conflict",
    category: "UK",
    accent: "#e34242",
    preview: "Ukraine and global breaking news",
    channelId: "UCoMdktPbSTixAyNGwb-UYkQ",
    url: "https://www.youtube.com/@SkyNews/live"
  },
  {
    name: "Yahoo Finance",
    group: "Business & AI",
    category: "Markets & Tech",
    accent: "#7b61ff",
    preview: "24/7 markets, Big Tech and AI coverage",
    channelId: "UCEAZeUIeJs0IjQiqTCdVSIg",
    url: "https://www.youtube.com/@YahooFinance/live"
  },
  {
    name: "CNBC Television",
    group: "Business & AI",
    category: "Markets & Tech",
    accent: "#36a3ff",
    preview: "Business, markets and tech earnings live",
    channelId: "UCrp_UI8XtuYfpiqluWLD7Lw",
    url: "https://www.youtube.com/@CNBCtelevision/live"
  },
  {
    name: "Bloomberg Originals",
    group: "Business & AI",
    category: "Tech & Future",
    accent: "#5b8cff",
    preview: "AI, technology and the future of business",
    channelId: "UCUMZ7gohGI9HcU9VNsr2FJQ",
    url: "https://www.youtube.com/@business/live"
  },
  {
    name: "ABC News",
    group: "United States",
    category: "National",
    accent: "#2d7dff",
    preview: "National breaking coverage",
    channelId: "UCBi2mrWuNuyYy4gbM6fU18Q",
    url: "https://www.youtube.com/@ABCNews/live"
  },
  {
    name: "NBC News NOW",
    group: "United States",
    category: "National",
    accent: "#ff5c7a",
    preview: "National breaking coverage",
    channelId: "UCeY0bbntWzzVIaj2z3QigXg",
    url: "https://www.youtube.com/@NBCNews/live"
  },
  {
    name: "CBS News",
    group: "United States",
    category: "National",
    accent: "#36a3ff",
    preview: "National news and politics",
    channelId: "UC8p1vwvWtl6T73JiExfWs1g",
    url: "https://www.youtube.com/@CBSNews/live"
  },
  {
    name: "LiveNOW from FOX",
    group: "United States",
    category: "Breaking",
    accent: "#ff4138",
    preview: "Raw live feeds and breaking events",
    channelId: "UCJg9wBPyKMNA5sRDnvzmkdg",
    url: "https://www.youtube.com/@livenowfox/live"
  },
  {
    name: "C-SPAN",
    group: "United States",
    category: "Government",
    accent: "#d7e0ea",
    preview: "Congress, White House, raw politics",
    channelId: "UCb--64Gl51jIEVE-GLDAVTg",
    url: "https://www.youtube.com/@cspan/live"
  },
  {
    name: "PBS NewsHour",
    group: "United States",
    category: "Public media",
    accent: "#f5a623",
    preview: "In-depth public broadcasting",
    channelId: "UC6ZFN9Tx6xh-skXCuRHCDpQ",
    url: "https://www.youtube.com/@PBSNewsHour/live"
  },
  {
    name: "Bloomberg Television",
    group: "United States",
    category: "Business",
    accent: "#7b61ff",
    preview: "Markets and business",
    channelId: "UCIALMKvObZNtJ6AmdCLP7Lg",
    url: "https://www.youtube.com/@markets/live"
  },
  {
    name: "Reuters",
    group: "United States",
    category: "Wire service",
    accent: "#f0a000",
    preview: "Wire-service live events",
    channelId: "UChqUTb7kYRX8-EiaN3XFrSQ",
    url: "https://www.youtube.com/@Reuters/live"
  },
  {
    name: "The Weather Channel",
    group: "United States",
    category: "Weather",
    accent: "#52c7ff",
    preview: "Storms and disasters",
    channelId: "UCGTUbwceCMibvpbd2NaIP7A",
    url: "https://www.youtube.com/@TheWeatherChannel/live"
  },
  {
    name: "AccuWeather",
    group: "United States",
    category: "Weather",
    accent: "#54d1ff",
    preview: "Severe weather live",
    channelId: "UCuYqi3hOfz6-3Hdp6tEJjAg",
    url: "https://www.youtube.com/@accuweather/live"
  },
  {
    name: "Euronews",
    group: "Europe",
    category: "Pan-Europe",
    accent: "#5b8cff",
    preview: "European and global live news",
    channelId: "UCSrZ3UV4jOidv8ppoVuvW9Q",
    url: "https://www.youtube.com/@euronews/live"
  },
  {
    name: "GB News",
    group: "Europe",
    category: "UK",
    accent: "#ff5f57",
    preview: "UK news and opinion",
    channelId: "UC0vn8ISa4LKMunLbzaXLnOQ",
    url: "https://www.youtube.com/@GBNewsOnline/live"
  },
  {
    name: "Times Radio",
    group: "Europe",
    category: "UK",
    accent: "#d7e0ea",
    preview: "UK politics and analysis",
    channelId: "UCTjDhFuGXlhx9Us0gq0VK2w",
    url: "https://www.youtube.com/channel/UCTjDhFuGXlhx9Us0gq0VK2w/live"
  },
  {
    name: "CNA",
    group: "Asia & Middle East",
    category: "Singapore",
    accent: "#ff4138",
    preview: "Singapore and Southeast Asia",
    channelId: "UC83jt4dlz1Gjl58fzQrrKZg",
    url: "https://www.youtube.com/@channelnewsasia/live"
  },
  {
    name: "WION",
    group: "Asia & Middle East",
    category: "India",
    accent: "#f5a623",
    preview: "India and world news",
    channelId: "UC_gUM8rL-Lrg6O3adPW9K1g",
    url: "https://www.youtube.com/@WION/live"
  },
  {
    name: "NDTV 24x7",
    group: "Asia & Middle East",
    category: "India",
    accent: "#e34242",
    preview: "India live news",
    channelId: "UCZFMm1mMw0F81Z37aaEzTUA",
    url: "https://www.youtube.com/@ndtv/live"
  },
  {
    name: "Firstpost",
    group: "Asia & Middle East",
    category: "India",
    accent: "#ff7a3d",
    preview: "India and geopolitics",
    channelId: "UCz8QaiQxApLq8sLNcszYyJw",
    url: "https://www.youtube.com/@firstpost/live"
  },
  {
    name: "NHK World-Japan",
    group: "Asia & Middle East",
    category: "Japan",
    accent: "#d7e0ea",
    preview: "Japan and Asia",
    channelId: "UCSPEjw8F2nQDtmUKPFNF7_A",
    url: "https://www.youtube.com/@nhkworldjapan/live"
  },
  {
    name: "Arirang News",
    group: "Asia & Middle East",
    category: "South Korea",
    accent: "#42d392",
    preview: "South Korea and world news",
    channelId: "UCCW7Z4RTTQoFix1dvn0D3LA",
    url: "https://www.youtube.com/@ArirangTV/live"
  },
  {
    name: "CGTN",
    group: "Asia & Middle East",
    category: "China",
    accent: "#ff4138",
    preview: "China and global news",
    channelId: "UCgrNz-aDmcr2uuto8_DL2jg",
    url: "https://www.youtube.com/@CGTN/live"
  },
  {
    name: "Al Arabiya English",
    group: "Asia & Middle East",
    category: "Gulf",
    accent: "#2fd0c4",
    preview: "Gulf and Middle East news",
    channelId: "UCahpxixMCwoANAftn6IxkTg",
    url: "https://www.youtube.com/@AlArabiyaEnglish/live"
  },
  {
    name: "ABC News Australia",
    group: "Africa & Americas",
    category: "Australia",
    accent: "#2d7dff",
    preview: "Australia and Pacific",
    channelId: "UCVgO39Bk5sMo66-6o6Spn6Q",
    url: "https://www.youtube.com/@abcnewsaustralia/live"
  },
  {
    name: "eNCA",
    group: "Africa & Americas",
    category: "South Africa",
    accent: "#36a3ff",
    preview: "South Africa live news",
    channelId: "UC8KUq_3hcN7p7rMFU1nFm1g",
    url: "https://www.youtube.com/@eNCA/live"
  },
  {
    name: "SABC News",
    group: "Africa & Americas",
    category: "South Africa",
    accent: "#f5a623",
    preview: "South African public news",
    channelId: "UC8yH-uI81UUtEMDsowQyx1g",
    url: "https://www.youtube.com/channel/UC8yH-uI81UUtEMDsowQyx1g/live"
  },
  {
    name: "CBC News",
    group: "Africa & Americas",
    category: "Canada",
    accent: "#ff4138",
    preview: "Canada live news",
    channelId: "UCuFFtHWoLl5fauMMD5Ww2jA",
    url: "https://www.youtube.com/@CBCNews/live"
  },
  {
    name: "TeleSUR English",
    group: "Africa & Americas",
    category: "Latin America",
    accent: "#ff7a3d",
    preview: "Latin America live news",
    channelId: "UCmuTmpLY35O3csvhyA6vrkg",
    url: "https://www.youtube.com/@telesurenglish/live"
  }
].map((stream, index) => ({
  id: index,
  access: stream.channelId ? "YouTube Live" : "Open link",
  ...stream,
  embedUrl: youtubeLiveEmbed(stream.channelId)
}));

// Streams whose embed reported "video unavailable" — filtered out of the list.
const deadStreams = new Set();

const WORLD_GEOJSON = window.WORLD_GEOJSON || { type: "FeatureCollection", features: [] };
const WORLD_VIEW_BOUNDS = [
  [-55, -165],
  [78, 178]
];

const map = L.map("map", {
  attributionControl: false,
  zoomControl: false,
  minZoom: 1,
  maxZoom: 7,
  zoomSnap: 0.25,
  worldCopyJump: true,
  wheelPxPerZoomLevel: 90,
  maxBounds: [
    [-90, -210],
    [90, 210]
  ],
  maxBoundsViscosity: 0.6
}).fitBounds(WORLD_VIEW_BOUNDS, { padding: [10, 10] });

L.control.zoom({ position: "bottomright" }).addTo(map);

const stateMapLayer = L.geoJSON(WORLD_GEOJSON, {
  style: stateBaseStyle,
  onEachFeature: setupStateFeature
}).addTo(map);
const markerLayer = L.layerGroup().addTo(map);

// Build the country index (name/alias -> centroid) straight from the rendered shapes,
// so there's no separate centroid table to keep in sync — Leaflet hands us each
// country's bounds and we take the center.
const stateByName = new Map(); // lowercased country name + aliases -> record
const stateByCode = new Map(); // ISO-2 code -> record
stateMapLayer.eachLayer((layer) => {
  const props = layer.feature && layer.feature.properties;
  const name = props && props.name;
  if (!name) return;
  const center = layer.getBounds().getCenter();
  const record = { name, code: props.code || "", lat: center.lat, lng: center.lng };
  stateByName.set(name.toLowerCase(), record);
  if (record.code && record.code !== "-99") stateByCode.set(record.code, record);
});
for (const [alias, canonical] of Object.entries(COUNTRY_ALIASES)) {
  const record = stateByName.get(canonical.toLowerCase());
  if (record) stateByName.set(alias, record);
}
// Longest names first so "United States of America" wins over the "America" alias.
const STATE_NAMES_BY_LENGTH = [...stateByName.entries()].sort((a, b) => b[0].length - a[0].length);
// Uppercase abbreviations are matched case-sensitively against the original headline so
// the pronoun "us" never resolves to the country "US".
const CODE_TO_COUNTRY = [
  ["USA", "United States of America"],
  ["US", "United States of America"],
  ["UK", "United Kingdom"],
  ["UAE", "United Arab Emirates"]
];

const feedList = document.querySelector("#feedList");
const feedTitle = document.querySelector("#feedTitle");
const statusText = document.querySelector("#statusText");
const articleCount = document.querySelector("#articleCount");
const stateStrip = document.querySelector("#stateStrip");
const briefingBody = document.querySelector("#briefingBody");
const briefingMeta = document.querySelector("#briefingMeta");
const aiPulseList = document.querySelector("#aiPulseList");
const aiPulseMeta = document.querySelector("#aiPulseMeta");
const pulseTabs = document.querySelector("#pulseTabs");
const streamList = document.querySelector("#streamList");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const refreshButton = document.querySelector("#refreshButton");
const timeScrubber = document.querySelector("#timeScrubber");
const timeWindowLabel = document.querySelector("#timeWindowLabel");
const tourButton = document.querySelector("#tourButton");
const tourStatus = document.querySelector("#tourStatus");

let articles = [];
let markers = [];
let selectedState = "";
let markerSignature = "";
let markersByState = new Map();
let searchTimer;
let currentStateCounts = {};
let spotlightTimer;
let spotlightActive = false;
let spotlightIndex = 0;
let timeWindowHours = Number(timeScrubber?.value || 24);

const SPOTLIGHT_INTERVAL_MS = 30000;

const AI_QUERY =
  '(artificial intelligence OR OpenAI OR Anthropic OR ChatGPT OR "machine learning" OR chatbot OR "generative AI" OR Nvidia)';

function gdeltUrl() {
  const topic = searchInput.value.trim();
  const category = categorySelect.value;
  const countryQuery = selectedState ? `"${selectedState}"` : "";
  // The "ai" filter expands into a richer query so GDELT returns real AI coverage,
  // not just stories that happen to contain the two letters "ai".
  const categoryTerm = category === "ai" ? AI_QUERY : category;
  const terms = [topic, categoryTerm, countryQuery].filter(Boolean).join(" ");
  const query = encodeURIComponent(terms || "world news");
  return `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&maxrecords=75&sort=HybridRel&timespan=24h`;
}

async function loadNews() {
  setStatus("Loading live articles...");
  refreshButton.disabled = true;
  refreshButton.classList.add("is-loading");

  try {
    const response = await fetch(gdeltUrl(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Feed returned ${response.status}`);
    const data = await response.json();
    const parsed = (data.articles || []).map(normalizeArticle).filter(Boolean);
    parsed.sort((left, right) => new Date(right.seen).getTime() - new Date(left.seen).getTime());
    articles = parsed.length ? parsed : FALLBACK_ARTICLES;
    setStatus(parsed.length ? `Live GDELT feed updated ${formatTime(new Date())}` : "Showing sample feed while live results warm up");
  } catch (error) {
    articles = FALLBACK_ARTICLES;
    setStatus("Live feed unavailable in this browser. Showing sample headlines.");
  } finally {
    refreshButton.disabled = false;
    refreshButton.classList.remove("is-loading");
    render();
  }
}

/* ---------- Translate-to-English (free, no signup: Google gtx + MyMemory fallback) ---------- */
const translateCache = new Map(); // original text -> english text
const translatePending = new Set();
let translateOn = false;

// Mostly-Latin text with no CJK/Cyrillic/Arabic/etc. is treated as English to skip a round trip.
function looksEnglish(text) {
  return !/[^-˿]/.test(text);
}

async function translateText(text) {
  if (!text) return text;
  if (translateCache.has(text)) return translateCache.get(text);
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    if (!res.ok) throw new Error("gtx");
    const data = await res.json();
    const out = data[2] === "en" ? text : (data[0] || []).map((seg) => seg[0]).join("") || text;
    translateCache.set(text, out);
    return out;
  } catch (error) {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`
      );
      const data = await res.json();
      const out = (data && data.responseData && data.responseData.translatedText) || text;
      translateCache.set(text, out);
      return out;
    } catch (err) {
      translateCache.set(text, text); // give up gracefully; never retry forever
      return text;
    }
  }
}

// What to show for a feed/ticker title given the global Translate toggle.
function displayTitle(article) {
  return translateOn ? translateCache.get(article.title) || article.title : article.title;
}

let translateRerenderTimer;
function ensureFeedTranslations(items) {
  const todo = items
    .slice(0, 30)
    .map((a) => a.title)
    .filter((t) => t && !looksEnglish(t) && !translateCache.has(t) && !translatePending.has(t));
  if (!todo.length) return;
  todo.forEach((t) => translatePending.add(t));
  Promise.all(todo.map((t) => translateText(t).finally(() => translatePending.delete(t)))).then(() => {
    clearTimeout(translateRerenderTimer);
    translateRerenderTimer = setTimeout(() => {
      renderFeed(lastVisible);
      renderTicker(lastVisible);
    }, 40);
  });
}

/* ---------- Pulse: multi-source live panel (AI · GitHub · Tech · World) ---------- */
const PULSE_TABS = [
  { id: "ai", label: "AI" },
  { id: "github", label: "GitHub" },
  { id: "tech", label: "Tech" },
  { id: "world", label: "World" }
];
let pulseTab = "ai";

const AI_PULSE_RE =
  /\b(a\.?i\.?|openai|anthropic|llm|llms|chatgpt|gpt|gemini|claude|copilot|machine learning|deep learning|neural|nvidia|transformer|model|models|agent|agents)\b/i;

function currentPulseLabel() {
  return (PULSE_TABS.find((tab) => tab.id === pulseTab) || {}).label || "Pulse";
}

function renderPulseTabs() {
  if (!pulseTabs) return;
  pulseTabs.innerHTML = PULSE_TABS.map(
    (tab) =>
      `<button class="pulse-tab ${tab.id === pulseTab ? "active" : ""}" type="button" data-tab="${tab.id}">${escapeHtml(tab.label)}</button>`
  ).join("");
}

function hnItem(hit) {
  return {
    title: hit.title,
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    metric: `▲ ${hit.points || 0}`,
    extra: `${hit.num_comments || 0} comments`,
    source: hit.url ? hostname(hit.url) : "news.ycombinator.com",
    time: hit.created_at
  };
}

function formatCount(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value || 0);
}

const PULSE_LOADERS = {
  async ai() {
    const res = await fetch("https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=50", {
      cache: "no-store"
    });
    const data = await res.json();
    aiPulseMeta.textContent = `Hacker News · ${formatTime(new Date())}`;
    return (data.hits || [])
      .filter((h) => h.title && AI_PULSE_RE.test(h.title))
      .slice(0, 12)
      .map(hnItem);
  },
  async tech() {
    const res = await fetch("https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=14", {
      cache: "no-store"
    });
    const data = await res.json();
    aiPulseMeta.textContent = `HN front page · ${formatTime(new Date())}`;
    return (data.hits || []).filter((h) => h.title).slice(0, 12).map(hnItem);
  },
  async github() {
    const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    const res = await fetch(
      `https://api.github.com/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=12`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    const data = await res.json();
    aiPulseMeta.textContent = `GitHub trending · ${formatTime(new Date())}`;
    return (data.items || []).map((repo) => ({
      title: repo.full_name,
      sub: repo.description || "",
      url: repo.html_url,
      metric: `★ ${formatCount(repo.stargazers_count)}`,
      source: repo.language || "code",
      time: repo.pushed_at
    }));
  },
  async world() {
    const url =
      "https://api.gdeltproject.org/api/v2/doc/doc?query=" +
      encodeURIComponent("world news") +
      "&mode=ArtList&format=json&maxrecords=24&sort=DateDesc&timespan=24h";
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    aiPulseMeta.textContent = `Global · translated · ${formatTime(new Date())}`;
    const seen = new Set();
    const items = (data.articles || [])
      .filter((a) => a.title && !seen.has(a.title) && seen.add(a.title))
      .slice(0, 12)
      .map((a) => ({
        title: cleanText(a.title),
        url: a.url || "#",
        source: hostname(a.url || ""),
        time: parseGdeltDate(a.seendate)
      }));
    // Always render the World tab in English.
    await Promise.all(
      items.map(async (it) => {
        if (!looksEnglish(it.title)) it.title = await translateText(it.title);
      })
    );
    return items;
  }
};

async function loadPulse() {
  renderPulseTabs();
  aiPulseList.innerHTML = `<p class="briefing-empty is-loading">Loading ${escapeHtml(currentPulseLabel())}…</p>`;
  try {
    renderPulse(await PULSE_LOADERS[pulseTab]());
  } catch (error) {
    aiPulseList.innerHTML = `<p class="briefing-empty">${escapeHtml(currentPulseLabel())} is unavailable right now.</p>`;
    aiPulseMeta.textContent = "offline";
  }
}

// Map a publisher's domain to a country: curated outlets first, then the ccTLD,
// then a sensible default of US for generic .com/.org/.net/.io.
const DOMAIN_COUNTRY = {
  "bbc.co": "GB", "bbc.com": "GB", "theguardian": "GB", "reuters.com": "GB", "ft.com": "GB",
  "telegraph.co": "GB", "dailymail": "GB", "sky.com": "GB", "skynews": "GB", "economist": "GB",
  "dw.com": "DE", "spiegel": "DE", "bloomberg": "US", "nvidia": "US", "fortune": "US",
  "lemonde": "FR", "france24": "FR", "afp.com": "FR",
  "aljazeera": "QA",
  "timesofindia": "IN", "ndtv": "IN", "thehindu": "IN", "wionews": "IN", "firstpost": "IN", "hindustantimes": "IN",
  "nhk.or": "JP", "japantimes": "JP", "nikkei": "JP",
  "scmp.com": "HK", "cgtn": "CN", "globaltimes": "CN", "xinhua": "CN",
  "rt.com": "RU", "tass.": "RU",
  "abc.net.au": "AU", "smh.com": "AU", "theage": "AU",
  "cbc.ca": "CA", "globeandmail": "CA",
  "timesofisrael": "IL", "i24news": "IL", "jpost": "IL", "haaretz": "IL",
  "kyivindependent": "UA", "pravda": "UA",
  "channelnewsasia": "SG", "straitstimes": "SG",
  "arirang": "KR", "koreatimes": "KR", "koreaherald": "KR",
  "alarabiya": "AE", "thenationalnews": "AE",
  "enca.com": "ZA", "sabcnews": "ZA", "news24": "ZA"
};
const TLD_COUNTRY = {
  uk: "GB", de: "DE", fr: "FR", in: "IN", jp: "JP", cn: "CN", ru: "RU", ca: "CA", au: "AU",
  br: "BR", il: "IL", ua: "UA", sg: "SG", kr: "KR", za: "ZA", es: "ES", it: "IT", nl: "NL",
  se: "SE", no: "NO", ch: "CH", ie: "IE", mx: "MX", ar: "AR", hk: "HK", tw: "TW", ae: "AE",
  qa: "QA", sa: "SA", ng: "NG", ke: "KE", eg: "EG", pl: "PL", pt: "PT", gr: "GR", tr: "TR"
};

function countryCode(host) {
  host = (host || "").toLowerCase();
  for (const key in DOMAIN_COUNTRY) {
    if (host.includes(key)) return DOMAIN_COUNTRY[key];
  }
  const parts = host.split(".");
  const tld = parts[parts.length - 1];
  if (tld === "uk") return "GB";
  if (TLD_COUNTRY[tld]) return TLD_COUNTRY[tld];
  return "US"; // generic gTLDs default to US
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

function renderPulse(items) {
  if (!items || !items.length) {
    aiPulseList.innerHTML = `<p class="briefing-empty">Nothing fresh for ${escapeHtml(currentPulseLabel())} right now.</p>`;
    return;
  }
  aiPulseList.innerHTML = items
    .map((it) => {
      const code = countryCode(hostname(it.url));
      const flag = `<span class="pulse-flag" title="${escapeHtml(code)}">${flagEmoji(code)} ${escapeHtml(code)}</span>`;
      const metric = it.metric ? `<span class="pulse-pts">${escapeHtml(it.metric)}</span>` : "";
      const rest = [it.extra, it.source, it.time ? relativeTime(it.time) : ""]
        .filter(Boolean)
        .map((m) => `<span>${escapeHtml(m)}</span>`)
        .join("");
      return `
        <a class="pulse-item" href="${escapeHtml(it.url)}" target="_blank" rel="noreferrer">
          <strong>${escapeHtml(it.title)}</strong>
          ${it.sub ? `<span class="pulse-sub">${escapeHtml(it.sub)}</span>` : ""}
          <span class="pulse-meta">${flag}${metric}${rest}</span>
        </a>
      `;
    })
    .join("");
}

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (error) {
    return "link";
  }
}

function normalizeArticle(item, index) {
  const title = cleanText(item.title);
  if (!title) return null;
  // Prefer a country named in the headline; otherwise fall back to GDELT's
  // sourcecountry (the publisher's country) so far more stories land on the globe.
  const country = detectState(title) || countryFromSource(item.sourcecountry);
  return {
    id: item.url || `${title}-${index}`,
    title,
    source: cleanText(item.domain || "News source"),
    category: detectCategory(title),
    state: country ? country.name : "Global",
    onMap: Boolean(country),
    url: item.url || "#",
    seen: parseGdeltDate(item.seendate)
  };
}

function countryFromSource(sourcecountry) {
  if (!sourcecountry) return null;
  const key = String(sourcecountry).toLowerCase().trim();
  return stateByName.get(key) || stateByName.get(COUNTRY_ALIASES[key]?.toLowerCase()) || null;
}

function detectState(text) {
  const lower = ` ${text.toLowerCase()} `;
  for (const [name, country] of STATE_NAMES_BY_LENGTH) {
    // Skip short aliases here (handled case-sensitively below) so "us"/"uk" don't match
    // the pronoun or stray letters; require a word boundary on the rest.
    if (name.length < 5) continue;
    if (new RegExp(`(?:^|[^a-z])${escapeRegExp(name)}(?:[^a-z]|$)`).test(lower)) return country;
  }
  return detectByCode(text);
}

function detectByCode(text) {
  for (const [code, canonical] of CODE_TO_COUNTRY) {
    if (new RegExp(`(?:^|[^A-Za-z.])${code}(?:$|[^A-Za-z])`).test(text)) {
      return stateByName.get(canonical.toLowerCase()) || null;
    }
  }
  return null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectCategory(title) {
  const lower = title.toLowerCase();
  const rules = [
    [
      "ai",
      [
        "artificial intelligence",
        "openai",
        "anthropic",
        "chatgpt",
        "machine learning",
        "generative ai",
        "chatbot",
        "nvidia",
        "llm",
        " a.i."
      ]
    ],
    ["technology", ["tech", "software", "cyber", "data", "semiconductor", "startup"]],
    ["business", ["market", "stock", "bank", "retail", "company", "economy"]],
    ["health", ["health", "hospital", "medical", "doctor", "disease", "care"]],
    ["weather", ["storm", "heat", "flood", "fire", "weather", "hurricane"]],
    ["sports", ["nfl", "nba", "mlb", "soccer", "football", "basketball", "sports"]],
    ["politics", ["senate", "house", "governor", "mayor", "election", "court", "lawmakers"]]
  ];
  return rules.find(([, words]) => words.some((word) => lower.includes(word)))?.[0] || "news";
}

function youtubeLiveEmbed(channelId) {
  if (!channelId || !HAS_HTTP_ORIGIN) return "";
  const params = new URLSearchParams(YOUTUBE_EMBED_PARAMS);
  params.set("channel", channelId);
  params.set("origin", YOUTUBE_EMBED_ORIGIN);
  params.set("widget_referrer", window.location.href);
  return `https://www.youtube.com/embed/live_stream?${params.toString()}`;
}

function stateBaseStyle(count = 0) {
  return stateStyleForVolume(count, "base");
}

function stateHoverStyle(count = 0) {
  return stateStyleForVolume(count, "hover");
}

function stateSelectedStyle(count = 0) {
  return stateStyleForVolume(count, "selected");
}

function stateStyleForVolume(count, mode = "base") {
  const intensity = Math.min(1, count / 8);
  const hot = count >= 6;
  const warm = count >= 3;
  const color = hot ? "#ff6d67" : warm ? "#f0b24f" : count > 0 ? "#67adff" : "#4f6278";
  const fillColor = hot ? "#2f151d" : warm ? "#302416" : count > 0 ? "#132335" : "#101a26";
  const baseOpacity = 0.72 + intensity * 0.14;

  if (mode === "hover") {
    return {
      color: "#91fff3",
      weight: 1.5,
      opacity: 1,
      fillColor: hot ? "#40212b" : warm ? "#324459" : "#182a3b",
      fillOpacity: 0.92
    };
  }

  if (mode === "selected") {
    return {
      color: "#ff5b53",
      weight: 2,
      opacity: 1,
      fillColor: "#281620",
      fillOpacity: 0.96
    };
  }

  return {
    color,
    weight: hot ? 1.7 : warm ? 1.35 : 1,
    opacity: 0.78 + intensity * 0.18,
    fillColor,
    fillOpacity: baseOpacity
  };
}

function setupStateFeature(feature, layer) {
  const stateName = feature.properties?.name;
  if (!stateName) return;

  layer.bindTooltip(stateName, {
    direction: "center",
    opacity: 0.92,
    sticky: true,
    className: "state-tooltip"
  });

  layer.on({
    click: () => {
      selectedState = selectedState === stateName ? "" : stateName;
      render();
    },
    mouseover: () => {
      if (selectedState !== stateName) layer.setStyle(stateHoverStyle(currentStateCounts[stateName] || 0));
    },
    mouseout: () => {
      layer.setStyle(
        selectedState === stateName
          ? stateSelectedStyle(currentStateCounts[stateName] || 0)
          : stateBaseStyle(currentStateCounts[stateName] || 0)
      );
    }
  });
}

function highlightSelectedState(items) {
  currentStateCounts = countByState(items);
  stateMapLayer.eachLayer((layer) => {
    const stateName = layer.feature?.properties?.name;
    const count = currentStateCounts[stateName] || 0;
    layer.setStyle(selectedState === stateName ? stateSelectedStyle(count) : stateBaseStyle(count));
  });
}

function filteredArticles() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const cutoff = Date.now() - timeWindowHours * 60 * 60 * 1000;
  return articles.filter((article) => {
    const seenAt = new Date(article.seen).getTime();
    const timeOk = Number.isNaN(seenAt) || seenAt >= cutoff;
    const stateOk = !selectedState || article.state === selectedState;
    const categoryOk = !category || article.category === category;
    const termOk =
      !term ||
      article.title.toLowerCase().includes(term) ||
      article.source.toLowerCase().includes(term) ||
      article.state.toLowerCase().includes(term);
    return timeOk && stateOk && categoryOk && termOk;
  });
}

function render() {
  const visible = filteredArticles();
  lastVisible = visible;
  renderFeed(visible);
  renderStreams();
  renderMarkers(visible);
  highlightSelectedState(visible);
  feedTitle.textContent = selectedState ? `${selectedState} Headlines` : "Global Headlines";
  articleCount.textContent = visible.length;
  updateReplayReadout();
  updateSpotlightReadout();
  updateGeoViz(visible);
  renderTicker(visible);
  updateHash();
  if (translateOn) ensureFeedTranslations(visible);
}

function renderFeed(items) {
  if (!items.length) {
    feedList.innerHTML = `<p class="empty">No matching stories right now. Try a broader topic or refresh the feed.</p>`;
    return;
  }

  feedList.innerHTML = items
    .map(
      (article) => `
        <a class="story${article.state === selectedState ? " is-selected" : ""}" href="${article.url}" target="_blank" rel="noreferrer">
          <h3>${escapeHtml(displayTitle(article))}</h3>
          <div class="story-meta">
            <span class="pill">${escapeHtml(article.state)}</span>
            <span>${escapeHtml(article.source)}</span>
            <span>${escapeHtml(article.category)}</span>
            <span>${relativeTime(article.seen)}</span>
          </div>
        </a>
      `
    )
    .join("");
}

function renderStateStrip(items) {
  const counts = countByState(items);
  const topStates = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  stateStrip.innerHTML = [
    `<button class="state-chip ${selectedState ? "" : "active"}" type="button" data-state="">World</button>`,
    ...topStates.map(
      ([state, count]) =>
        `<button class="state-chip ${selectedState === state ? "active" : ""}" type="button" data-state="${escapeHtml(state)}">${escapeHtml(stateByName.get(state.toLowerCase())?.code || state)} ${count}</button>`
    )
  ].join("");
}

const BRIEFING_STOPWORDS = new Set(
  ("the a an and or of to in on for with at by from as is are was were be been being this that " +
    "these those will would can could should may might over after into amid new news report reports " +
    "says say said update updates live latest us united states more than its their his her they them you " +
    "your we our about how why what when who which while have has had not but out off per via amid plan " +
    "plans set top first two three week day days year years time home away back down up still get got make")
    .split(/\s+/)
);

const CATEGORY_LABELS = {
  ai: "AI & tech",
  technology: "technology",
  business: "business",
  health: "health",
  weather: "weather",
  sports: "sports",
  politics: "politics",
  news: "general news"
};

// Tiny sentiment lexicon for an at-a-glance read on how heavy the news cycle is.
const POSITIVE_WORDS = new Set(
  ("win wins won record growth boost boosts surge surges soar gains gain rally breakthrough deal deals " +
    "agree approve approved relief recovery rescue hope support success best rise rising upgrade funding award")
    .split(/\s+/)
);
const NEGATIVE_WORDS = new Set(
  ("war attack attacks killed dead death deaths strike strikes crisis crash collapse fear threat warning " +
    "ban lawsuit fraud layoffs cuts loss losses fire flood storm shooting protest fall falling risk recession dies")
    .split(/\s+/)
);

function feedTone(items) {
  let score = 0;
  items.forEach((article) => {
    article.title
      .toLowerCase()
      .split(/\W+/)
      .forEach((word) => {
        if (POSITIVE_WORDS.has(word)) score += 1;
        else if (NEGATIVE_WORDS.has(word)) score -= 1;
      });
  });
  const ratio = score / Math.max(1, items.length);
  if (ratio > 0.15) return { label: "Upbeat", tone: "pos" };
  if (ratio < -0.15) return { label: "Tense", tone: "neg" };
  return { label: "Mixed", tone: "mixed" };
}

// Lightweight on-device text mining: surfaces the most distinctive phrases and words in
// the current headlines, preferring two-word phrases ("artificial intelligence") over
// single tokens so the briefing reads like a real topic list.
function topKeywords(items, limit) {
  const stateWords = new Set();
  for (const name of stateByName.keys()) name.split(" ").forEach((word) => stateWords.add(word));

  const unigrams = new Map();
  const bigrams = new Map();
  items.forEach((article) => {
    const tokens = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const kept = tokens.map((word) =>
      word.length >= 4 && !BRIEFING_STOPWORDS.has(word) && !stateWords.has(word) ? word : null
    );

    new Set(kept.filter(Boolean)).forEach((word) => unigrams.set(word, (unigrams.get(word) || 0) + 1));

    const phrases = new Set();
    for (let i = 0; i < kept.length - 1; i += 1) {
      if (kept[i] && kept[i + 1]) phrases.add(`${kept[i]} ${kept[i + 1]}`);
    }
    phrases.forEach((phrase) => bigrams.set(phrase, (bigrams.get(phrase) || 0) + 1));
  });

  const scored = [];
  bigrams.forEach((count, phrase) => {
    if (count > 1) scored.push([phrase, count, count * 2]); // weight phrases higher
  });
  unigrams.forEach((count, word) => {
    if (count > 1) scored.push([word, count, count]);
  });
  scored.sort((a, b) => b[2] - a[2] || b[1] - a[1] || a[0].localeCompare(b[0]));

  const out = [];
  const usedWords = new Set();
  for (const [term, count] of scored) {
    if (out.length >= limit) break;
    if (term.includes(" ")) {
      out.push([term, count]);
      term.split(" ").forEach((word) => usedWords.add(word));
    } else if (!usedWords.has(term)) {
      out.push([term, count]);
      usedWords.add(term);
    }
  }
  return out;
}

function renderBriefing(items) {
  if (!items.length) {
    briefingBody.innerHTML =
      `<p class="briefing-empty">No stories to summarize yet. Refresh or broaden your filters and the AI briefing will rebuild itself.</p>`;
    briefingMeta.textContent = "Standing by";
    return;
  }

  const scope = selectedState || "the world";
  const categoryCounts = items.reduce((counts, article) => {
    counts[article.category] = (counts[article.category] || 0) + 1;
    return counts;
  }, {});
  const leadCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const topStates = Object.entries(countByState(items))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const keywords = topKeywords(items, 6);
  const tone = feedTone(items);
  const headline = items[0];

  const sentence = [
    `Tracking ${items.length} ${items.length === 1 ? "story" : "stories"} across ${scope} in the last 24 hours.`,
    leadCategory ? `Coverage leans toward ${CATEGORY_LABELS[leadCategory[0]] || leadCategory[0]}.` : "",
    topStates.length ? `Most active: ${topStates.map(([state, count]) => `${state} (${count})`).join(", ")}.` : ""
  ]
    .filter(Boolean)
    .join(" ");

  briefingBody.innerHTML = `
    <p class="briefing-lead"><span class="tone-chip tone-${tone.tone}">${tone.label} cycle</span> ${escapeHtml(sentence)}</p>
    ${
      keywords.length
        ? `<div class="briefing-tags">${keywords
            .map(
              ([word, count]) =>
                `<button class="briefing-tag" type="button" data-term="${escapeHtml(word)}">${escapeHtml(word)} <b>${count}</b></button>`
            )
            .join("")}</div>`
        : ""
    }
    ${
      headline
        ? `<a class="briefing-top" href="${escapeHtml(headline.url)}" target="_blank" rel="noreferrer">
            <span>Top read · ${escapeHtml(headline.state)}</span>
            <strong>${escapeHtml(headline.title)}</strong>
          </a>`
        : ""
    }
  `;
  briefingMeta.textContent = `Updated ${formatTime(new Date())}`;
}

let streamSignature = "";

function renderStreams() {
  const live = LIVE_STREAMS.filter((stream) => !deadStreams.has(stream.id));
  // Only rebuild when the set actually changes, so iframes don't reload on every keystroke.
  const signature = live.map((stream) => stream.id).join(",");
  if (signature === streamSignature) return;
  streamSignature = signature;

  const groups = live.reduce((grouped, stream) => {
    if (!grouped.has(stream.group)) grouped.set(stream.group, []);
    grouped.get(stream.group).push(stream);
    return grouped;
  }, new Map());

  streamList.innerHTML = [...groups]
    .map(([group, streams]) => {
      return `
        <section class="stream-group">
          <div class="stream-group-title">
            <span>${escapeHtml(group)}</span>
            <small>${streams.length}</small>
          </div>
          <div class="stream-group-grid">
            ${streams.map(streamCardHtml).join("")}
          </div>
        </section>
      `;
    })
    .join("");
  scheduleStreamHealthCheck();
}

// Country of origin for each live channel.
const STREAM_COUNTRY = {
  "Al Jazeera English": "QA", "DW News": "DE", "France 24 English": "FR", "TRT World": "TR",
  "Times of Israel": "IL", "i24NEWS English": "IL", "The Kyiv Independent": "UA", "UATV English": "UA",
  "FREEDOM.LIVE": "UA", "Sky News": "GB", "Yahoo Finance": "US", "CNBC Television": "US",
  "Bloomberg Originals": "US", "ABC News": "US", "NBC News NOW": "US", "CBS News": "US",
  "LiveNOW from FOX": "US", "C-SPAN": "US", "PBS NewsHour": "US", "Bloomberg Television": "US",
  Reuters: "GB", "The Weather Channel": "US", AccuWeather: "US", Euronews: "FR",
  "GB News": "GB", "Times Radio": "GB", CNA: "SG", WION: "IN", "NDTV 24x7": "IN", Firstpost: "IN",
  "NHK World-Japan": "JP", "Arirang News": "KR", CGTN: "CN", "Al Arabiya English": "AE",
  "ABC News Australia": "AU", eNCA: "ZA", "SABC News": "ZA", "CBC News": "CA", "TeleSUR English": "VE"
};

// Coordinates for anchoring each channel to its country of origin on the globe.
const STREAM_COORDS = {
  QA: [25.3, 51.2], DE: [51.1, 10.4], FR: [46.6, 2.3], TR: [39.0, 35.2], IL: [31.5, 34.9],
  UA: [48.4, 31.2], GB: [54.0, -2.0], US: [39.5, -98.4], SG: [1.35, 103.8], IN: [22.0, 79.0],
  JP: [36.2, 138.3], KR: [36.5, 127.8], CN: [35.9, 104.2], AE: [24.0, 54.0], AU: [-25.7, 133.8],
  ZA: [-29.0, 24.0], CA: [56.1, -106.3], VE: [6.4, -66.6]
};

// One representative live channel per country, anchored on the globe.
const GLOBE_STREAMS = (() => {
  const seen = new Set();
  const out = [];
  LIVE_STREAMS.forEach((stream) => {
    const code = STREAM_COUNTRY[stream.name];
    const coords = code && STREAM_COORDS[code];
    if (!code || !coords || seen.has(code) || !stream.embedUrl) return;
    seen.add(code);
    out.push({ ...stream, code, lat: coords[0], lng: coords[1] });
  });
  return out;
})();

function liveGlobeStreams() {
  return GLOBE_STREAMS.filter((stream) => !deadStreams.has(stream.id));
}

function buildGlobeStream(stream) {
  const el = document.createElement("div");
  el.className = "globe-stream";
  el.dataset.streamId = stream.id;
  el.innerHTML =
    `<div class="gs-head"><span>${flagEmoji(stream.code)} ${escapeHtml(stream.code)}</span>` +
    `<b>${escapeHtml(stream.name)}</b><span class="gs-live"><span class="live-dot"></span>LIVE</span></div>` +
    `<div class="gs-frame" data-embed="${escapeHtml(stream.embedUrl.replace("autoplay=0", "autoplay=1"))}"></div>`;
  el.addEventListener("click", () => {
    window.open(stream.url, "_blank", "noreferrer");
  });
  return el;
}

function streamCardHtml(stream) {
  const code = STREAM_COUNTRY[stream.name] || "US";
  return `
        <article class="stream-card" data-card="${stream.id}" style="--stream-accent: ${stream.accent}">
          <span class="macbook-preview">
            <span class="macbook-lid">
              <span class="macbook-bar">
                <i></i>
                <i></i>
                <i></i>
              </span>
              <span class="preview-screen stream-iframe-screen">
                <span class="preview-glow"></span>
                ${streamPlayerHtml(stream)}
                <span class="preview-live">
                  <span class="live-dot"></span>
                  LIVE
                </span>
              </span>
            </span>
            <span class="macbook-base"></span>
          </span>
          <span class="stream-info">
            <span class="stream-main">
              <strong>${escapeHtml(stream.name)}</strong>
              <small>${escapeHtml(stream.preview)}</small>
            </span>
            <span class="stream-actions">
              <span class="stream-flag" title="${escapeHtml(code)}">${flagEmoji(code)} ${escapeHtml(code)}</span>
              <span class="stream-access">${escapeHtml(stream.access)}</span>
              <a class="stream-open" href="${escapeHtml(stream.url)}" target="_blank" rel="noreferrer">Open</a>
            </span>
          </span>
        </article>
      `;
}

function streamPlayerHtml(stream) {
  if (!stream.embedUrl) {
    return `
      <span class="stream-fallback">
        <strong>${escapeHtml(stream.name)}</strong>
        <small>${HAS_HTTP_ORIGIN ? "Embed unavailable. Open the live page." : "Run from localhost to enable embeds."}</small>
      </span>
    `;
  }

  return `
    <iframe
      id="stream-frame-${stream.id}"
      class="stream-frame"
      src="${stream.embedUrl}"
      title="${escapeHtml(stream.name)} live stream"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  `;
}

/* ---------- Remove streams whose embed reports "video unavailable" ----------
 * Uses the YouTube IFrame API: any player that fires onError (100/101/150 =
 * removed / embedding disabled / not live) gets pulled from the list. */
let ytApiPromise;
let streamHealthTimer;

function loadYouTubeApi() {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve();
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previous === "function") previous();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiPromise;
}

function scheduleStreamHealthCheck() {
  if (!HAS_HTTP_ORIGIN) return; // embeds (and the API) only work over http(s)
  clearTimeout(streamHealthTimer);
  streamHealthTimer = setTimeout(checkStreamHealth, 1500);
}

async function checkStreamHealth() {
  await loadYouTubeApi();
  document.querySelectorAll(".stream-frame").forEach((iframe) => {
    if (iframe.dataset.checked || !iframe.id) return;
    iframe.dataset.checked = "1";
    try {
      new window.YT.Player(iframe.id, {
        events: { onError: () => markStreamDead(iframe) }
      });
    } catch (error) {
      /* ignore players that can't be attached */
    }
  });
}

function markStreamDead(iframe) {
  const card = iframe.closest("[data-card]");
  if (!card) return;
  const id = Number(card.dataset.card);
  if (!deadStreams.has(id)) deadStreams.add(id);
  const section = card.closest(".stream-group");
  card.remove();
  if (section) {
    const remaining = section.querySelectorAll(".stream-card").length;
    if (!remaining) section.remove();
    else {
      const badge = section.querySelector(".stream-group-title small");
      if (badge) badge.textContent = String(remaining);
    }
  }
  // Keep the signature in sync so a later re-render doesn't reload everything.
  streamSignature = LIVE_STREAMS.filter((stream) => !deadStreams.has(stream.id))
    .map((stream) => stream.id)
    .join(",");
  refreshGlobeStreams();
}

// Health-check a globe-anchored tile's iframe; drop the tile if its embed errors.
async function checkGlobeFrame(iframe, streamId) {
  if (!HAS_HTTP_ORIGIN) return;
  await loadYouTubeApi();
  try {
    new window.YT.Player(iframe.id, {
      events: { onError: () => markGlobeStreamDead(streamId) }
    });
  } catch (error) {
    /* ignore */
  }
}

function markGlobeStreamDead(streamId) {
  if (deadStreams.has(streamId)) return;
  deadStreams.add(streamId);
  refreshGlobeStreams();
  // The same channel may also be in the sidebar list — rebuild it too.
  streamSignature = "";
  renderStreams();
}

function refreshGlobeStreams() {
  if (!globe) return;
  if (typeof tvOn !== "undefined" && tvOn) {
    globe.htmlElementsData(liveGlobeStreams());
  }
  globe.arcsData(webArcs()); // keep the web in sync as streams come and go
}

// Give every link a second chance: clear the dead list, re-render, and re-run the
// health check so channels that were merely slow to load come back in.
function retestStreams() {
  if (!deadStreams.size) return;
  deadStreams.clear();
  streamSignature = ""; // force a rebuild so the health check re-attaches
  renderStreams();
  refreshGlobeStreams();
  setStatus(`Re-tested live streams ${formatTime(new Date())}`);
}

function renderMarkers(items) {
  const counts = countByState(items);
  const entries = Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  const nextSignature = entries.map(([stateName, count]) => `${stateName}:${count}`).join("|");
  if (nextSignature === markerSignature) return;

  markerSignature = nextSignature;
  markerLayer.clearLayers();
  markers = [];

  entries.forEach(([stateName, count]) => {
    const state = stateByName.get(stateName.toLowerCase());
    if (!state) return;
    const tier = count >= 5 ? "hot" : count >= 3 ? "warm" : "cool";
    const size = Math.min(46, 22 + count * 4);
    const iconSize = size + 22;
    if (count >= 4) {
      const ring = L.marker([state.lat, state.lng], {
        icon: L.divIcon({
          className: "breaking-ring-icon",
          html: `<span class="breaking-ring breaking-ring-${tier}" style="width:${iconSize}px;height:${iconSize}px"></span>`,
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize / 2]
        }),
        interactive: false,
        keyboard: false
      }).addTo(markerLayer);
      markers.push(ring);
    }
    const icon = L.divIcon({
      className: "news-div-icon",
      html: `<span class="map-dot map-dot-${tier}" style="--dot-size: ${size}px"><b>${count}</b></span>`,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2]
    });
    const marker = L.marker([state.lat, state.lng], {
      icon,
      keyboard: true,
      title: `${stateName}: ${count} ${count === 1 ? "story" : "stories"}`
    })
      .bindPopup(popupHtml(stateName, count))
      .on("click", () => {
        selectedState = stateName;
        render();
      })
      .addTo(markerLayer);
    markers.push(marker);
    markersByState.set(stateName, marker);
  });
}

function popupHtml(stateName, count) {
  const latest = articles.find((article) => article.state === stateName);
  return `
    <div class="popup-title">${escapeHtml(stateName)}: ${count} ${count === 1 ? "story" : "stories"}</div>
    <div class="popup-meta">${latest ? escapeHtml(latest.title) : "Select to filter the feed"}</div>
  `;
}

function countByState(items) {
  return items.reduce((counts, article) => {
    counts[article.state] = (counts[article.state] || 0) + 1;
    return counts;
  }, {});
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}

function relativeTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "recent";
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

function parseGdeltDate(value) {
  const text = String(value || "");
  const match = text.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!match) return new Date().toISOString();
  const [, year, month, day, hour, minute, second] = match;
  return new Date(Date.UTC(year, Number(month) - 1, day, hour, minute, second)).toISOString();
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function setStatus(message) {
  statusText.classList.add("is-updating");
  statusText.textContent = message;
  requestAnimationFrame(() => statusText.classList.remove("is-updating"));
}

function updateReplayReadout() {
  if (timeWindowLabel) timeWindowLabel.textContent = `${timeWindowHours}h`;
}

function updateSpotlightReadout() {
  if (!tourButton || !tourStatus) return;
  tourButton.classList.toggle("is-active", spotlightActive);
  tourButton.textContent = spotlightActive ? "Spotlight on" : "Spotlight off";
  tourStatus.textContent = spotlightActive
    ? "Auto-tour cycling the busiest countries"
    : `Auto-tour paused${lastVisible.length ? ` · ${lastVisible.length} visible stories` : ""}`;
}

function rankStates(items, limit = 5) {
  return Object.entries(countByState(items))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

// Rank countries from the current filters but ignore the spotlight's own country
// selection — otherwise the queue collapses to the single highlighted country.
function tourQueue() {
  const saved = selectedState;
  selectedState = "";
  const items = filteredArticles();
  selectedState = saved;
  return rankStates(items, 20);
}

function spotlightStep() {
  const queue = tourQueue();
  if (!queue.length) {
    stopSpotlightTour();
    return;
  }

  if (spotlightIndex >= queue.length) spotlightIndex = 0;
  const [stateName] = queue[spotlightIndex];
  spotlightIndex = (spotlightIndex + 1) % queue.length;

  const state = stateByName.get(stateName.toLowerCase());
  if (!state) return;

  selectedState = stateName;
  render();
  if (globe && globeMode) {
    // Orbit the globe so the spotlighted country rotates to face the viewer.
    globe.pointOfView({ lat: state.lat, lng: state.lng, altitude: 1.7 }, 1300);
  } else {
    map.flyTo([state.lat, state.lng], Math.min(3.5, Math.max(2.25, map.getZoom() + 0.4)), {
      animate: true,
      duration: 1.6,
      easeLinearity: 0.22
    });
    markersByState.get(stateName)?.openPopup();
  }
  showSpotlightPreview(stateName);
}

// The channel that actually originates from each country (no cross-country fallback —
// we don't show Al Jazeera over Brazil).
const COUNTRY_STREAM = {
  Ukraine: "The Kyiv Independent",
  Russia: "DW News",
  Israel: "i24NEWS English",
  China: "CGTN",
  India: "WION",
  Japan: "NHK World-Japan",
  "South Korea": "Arirang News",
  "United Kingdom": "Sky News",
  "United States of America": "ABC News",
  Singapore: "CNA",
  Australia: "ABC News Australia",
  "South Africa": "eNCA",
  Canada: "CBC News",
  Germany: "DW News",
  France: "France 24 English",
  Turkey: "TRT World",
  Qatar: "Al Jazeera English",
  "United Arab Emirates": "Al Arabiya English",
  Venezuela: "TeleSUR English"
};

function streamForCountry(name) {
  const wanted = COUNTRY_STREAM[name];
  if (!wanted) return null; // no local channel for this country → no preview
  return LIVE_STREAMS.find((s) => s.name === wanted && s.embedUrl && !deadStreams.has(s.id)) || null;
}

function showSpotlightPreview(country) {
  const panel = document.querySelector("#spotlightPreview");
  if (!panel || !HAS_HTTP_ORIGIN) return;
  const stream = streamForCountry(country);
  if (!stream) {
    hideSpotlightPreview();
    return;
  }

  document.querySelector("#spotlightCaption").textContent = country;

  // Tie the preview to the actual top story for that country.
  const story = lastVisible.find((article) => article.state === country);
  document.querySelector("#spotlightFoot").innerHTML =
    `<span class="sp-chan">${escapeHtml(stream.name)}</span>` +
    (story ? `<span class="sp-line">${escapeHtml(displayTitle(story))}</span>` : "");

  // Each stream keeps its OWN iframe: create it once, then just toggle which is shown.
  const container = document.querySelector("#spotlightFrame");
  container.querySelectorAll("iframe").forEach((frame) => frame.classList.remove("active"));
  const frameId = `sp-frame-${stream.id}`;
  let frame = document.getElementById(frameId);
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = frameId;
    frame.src = stream.embedUrl.replace("autoplay=0", "autoplay=1");
    frame.title = `${stream.name} live`;
    frame.allow = "autoplay; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    container.appendChild(frame);
  }
  frame.classList.add("active");
  panel.hidden = false;
}

function hideSpotlightPreview() {
  const panel = document.querySelector("#spotlightPreview");
  if (!panel) return;
  panel.hidden = true;
  const frame = document.querySelector("#spotlightFrame");
  if (frame) frame.innerHTML = ""; // tear down all per-stream players to stop playback
}

function startSpotlightTour() {
  if (spotlightActive) return;
  spotlightActive = true;
  spotlightIndex = 0;
  if (globe) globe.controls().autoRotate = false; // hold still while we fly between hotspots
  updateSpotlightReadout();
  spotlightStep();
  spotlightTimer = window.setInterval(spotlightStep, SPOTLIGHT_INTERVAL_MS);
}

function stopSpotlightTour() {
  spotlightActive = false;
  if (spotlightTimer) {
    clearInterval(spotlightTimer);
    spotlightTimer = undefined;
  }
  if (globe) globe.controls().autoRotate = true;
  hideSpotlightPreview();
  updateSpotlightReadout();
}

function toggleSpotlightTour() {
  if (spotlightActive) stopSpotlightTour();
  else startSpotlightTour();
}

searchInput.addEventListener("input", () => {
  render();
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadNews, 650);
});
timeScrubber.addEventListener("input", (event) => {
  timeWindowHours = Number(event.target.value);
  render();
});
categorySelect.addEventListener("change", () => loadNews());
refreshButton.addEventListener("click", () => loadNews());
tourButton.addEventListener("click", () => toggleSpotlightTour());
if (pulseTabs) {
  pulseTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (!tab || tab.dataset.tab === pulseTab) return;
    pulseTab = tab.dataset.tab;
    loadPulse();
  });
}

window.addEventListener("resize", () => map.invalidateSize());
setTimeout(() => map.invalidateSize(), 80);

// Keep the feed fresh on its own; skip refreshing while the tab is hidden.
const AUTO_REFRESH_MS = 5 * 60 * 1000;
setInterval(() => {
  if (document.hidden) return;
  loadNews();
  loadPulse();
  if (quakeOn) loadQuakes();
  if (alertOn) loadAlerts();
}, AUTO_REFRESH_MS);

applyHashToState();
loadNews();
loadPulse();

// Re-test every stream link once after 20s, so slow-loading channels can come back.
setTimeout(retestStreams, 20000);

/* ============================================================================
 *  ENHANCEMENTS: 3D globe · AI news radio · quake/alert overlays · news arcs · PWA
 * ========================================================================== */

let lastVisible = [];
let quakes = [];
let alertPoints = [];

const tierColors = { hot: "#ff4138", warm: "#e1a23a", cool: "#5796ff" };
function tierColor(count) {
  return count >= 5 ? tierColors.hot : count >= 3 ? tierColors.warm : tierColors.cool;
}

// Subtle per-continent tint so the globe's hex landmasses read as distinct regions.
const CONTINENT_COLORS = {
  "North America": "rgba(95, 200, 255, 0.5)",
  "South America": "rgba(120, 230, 180, 0.5)",
  Europe: "rgba(150, 170, 255, 0.5)",
  Africa: "rgba(245, 190, 120, 0.5)",
  Asia: "rgba(255, 150, 160, 0.5)",
  Oceania: "rgba(130, 220, 235, 0.5)",
  Antarctica: "rgba(210, 225, 240, 0.45)"
};

// Per-country counts joined to centroids — the shared input for arcs, globe points and pins.
function geoCounts(items) {
  const counts = countByState(items);
  const out = [];
  for (const [name, count] of Object.entries(counts)) {
    const record = stateByName.get(name.toLowerCase());
    if (record) out.push({ name, count, lat: record.lat, lng: record.lng });
  }
  return out.sort((a, b) => b.count - a.count);
}

// A never-ending web: connect every live-preview location to all the others.
function webArcs() {
  const nodes = liveGlobeStreams();
  const arcs = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      arcs.push({
        startLat: nodes[i].lat,
        startLng: nodes[i].lng,
        endLat: nodes[j].lat,
        endLng: nodes[j].lng,
        from: nodes[i].name,
        to: nodes[j].name
      });
    }
  }
  return arcs;
}

/* ---------- 3D globe (lazy-loaded globe.gl, vendored / offline-capable) ---------- */
const mapEl = document.querySelector("#map");
const globeEl = document.querySelector("#globe");
const viewToggle = document.querySelector("#viewToggle");
let globe = null;
let globeMode = false;
let scriptPromise = null;

function loadScriptOnce(src) {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = src;
    tag.onload = resolve;
    tag.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(tag);
  });
  return scriptPromise;
}

async function ensureGlobe() {
  if (globe) return globe;
  await loadScriptOnce("./vendor/globe.gl.min.js");
  globe = window
    .Globe()(globeEl)
    .backgroundColor("rgba(0,0,0,0)")
    .showGlobe(true)
    .showGraticules(true)
    .showAtmosphere(true)
    .atmosphereColor("#43e3ff")
    .atmosphereAltitude(0.24)
    .hexPolygonsData(WORLD_GEOJSON.features)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.28)
    .hexPolygonUseDots(true)
    .hexPolygonColor((d) => CONTINENT_COLORS[d.properties && d.properties.continent] || "rgba(120, 200, 230, 0.5)")
    .pointLat("lat")
    .pointLng("lng")
    .pointAltitude((d) => (d.kind === "alert" ? 0.12 : Math.min(0.55, 0.06 + d.count * 0.035)))
    .pointRadius((d) => (d.kind === "alert" ? 0.3 : 0.45))
    .pointColor((d) =>
      d.kind === "alert" ? (d.severe ? "#ff4138" : "#f5a623") : tierColor(d.count)
    )
    .pointLabel((d) =>
      d.kind === "alert"
        ? `⚠ ${d.name}`
        : `${d.name}: ${d.count} ${d.count === 1 ? "story" : "stories"}`
    )
    .pointsTransitionDuration(600)
    .arcColor(() => ["rgba(255,65,56,0.9)", "rgba(47,208,196,0.9)"])
    .arcDashLength(0.5)
    .arcDashGap(0.25)
    .arcDashAnimateTime(1600)
    .arcStroke(0.5)
    .arcAltitudeAutoScale(0.4)
    .arcLabel((d) => `${d.from} → ${d.to}`)
    // Quake ripples are red; the busiest country gets a teal "breaking" pulse.
    .ringColor((d) =>
      d.kind === "breaking" ? (t) => `rgba(47,208,196,${1 - t})` : (t) => `rgba(255,90,80,${1 - t})`
    )
    .ringMaxRadius((d) => (d.kind === "breaking" ? 5 : 2 + d.mag))
    .ringPropagationSpeed((d) => (d.kind === "breaking" ? 3 : 2))
    .ringRepeatPeriod((d) => (d.kind === "breaking" ? 700 : 900))
    // Floating labels for the top hotspots.
    .labelLat("lat")
    .labelLng("lng")
    .labelText("label")
    .labelSize(1)
    .labelDotRadius(0.32)
    .labelColor(() => "rgba(238, 245, 247, 0.92)")
    .labelResolution(2)
    .labelLabel((d) => `${d.name}: ${d.count}`)
    .onLabelClick((d) => {
      if (d.name !== "West Virginia") selectCountry(d.name);
    })
    // Click a country bar to filter the feed and orbit to it.
    .onPointClick((d) => {
      if (d && !d.kind) selectCountry(d.name);
    })
    // Live-stream iframes anchored to each channel's country of origin.
    .htmlElementsData(liveGlobeStreams())
    .htmlLat("lat")
    .htmlLng("lng")
    .htmlAltitude(0.02)
    .htmlElement(buildGlobeStream)
    .htmlElementVisibilityModifier((el, isVisible) => {
      // Only the front-facing channels are shown; their iframe loads on first reveal.
      el.style.opacity = isVisible ? "1" : "0";
      el.style.pointerEvents = isVisible ? "auto" : "none";
      const frame = el.querySelector(".gs-frame");
      if (isVisible && frame && !frame.firstChild && frame.dataset.embed) {
        const streamId = Number(el.dataset.streamId);
        const iframe = document.createElement("iframe");
        iframe.id = `globe-frame-${streamId}`;
        iframe.src = frame.dataset.embed;
        iframe.loading = "lazy";
        iframe.allow = "autoplay; encrypted-media; picture-in-picture";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        frame.appendChild(iframe);
        checkGlobeFrame(iframe, streamId);
      }
    });

  // Dark ocean material and a slow auto-spin for the cinematic feel.
  const material = globe.globeMaterial();
  if (material && material.color && material.color.set) material.color.set("#0a1622");
  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.45;

  // Pause the spin while the user is dragging the globe.
  globeEl.addEventListener("pointerdown", () => {
    globe.controls().autoRotate = false;
  });
  globeEl.addEventListener("pointerup", () => {
    if (!spotlightActive) globe.controls().autoRotate = true;
  });

  globe.arcsData(webArcs()); // the never-ending intersecting web between live previews

  sizeGlobe();
  return globe;
}

function flyToSelected() {
  if (!globe || !globeMode || !selectedState) return;
  const record = stateByName.get(selectedState.toLowerCase());
  if (record) globe.pointOfView({ lat: record.lat, lng: record.lng, altitude: 1.8 }, 1200);
}

function selectCountry(name) {
  if (!name) return;
  selectedState = selectedState === name ? "" : name;
  render();
  flyToSelected();
}

function sizeGlobe() {
  if (!globe) return;
  globe.width(globeEl.clientWidth).height(globeEl.clientHeight);
}

async function setGlobeMode(on) {
  globeMode = on;
  viewToggle.setAttribute("aria-pressed", String(on));
  viewToggle.querySelector(".tool-label").textContent = on ? "2D Map" : "3D Globe";
  if (on) {
    globeEl.hidden = false;
    mapEl.style.display = "none";
    try {
      await ensureGlobe();
      sizeGlobe();
      updateGeoViz(lastVisible);
    } catch (error) {
      setStatus("3D globe failed to load. Showing the 2D map.");
      return setGlobeMode(false);
    }
  } else {
    globeEl.hidden = true;
    mapEl.style.display = "";
    map.invalidateSize();
  }
}

viewToggle.addEventListener("click", () => setGlobeMode(!globeMode));

/* ---------- 2D animated news-flow arcs (curved Leaflet polylines) ---------- */
const arcLayer = L.layerGroup().addTo(map);

function quadraticArcPoints(a, b) {
  // A simple bowed curve between two centroids so flows read as arcs, not straight lines.
  const points = [];
  const midLat = (a.lat + b.lat) / 2;
  const midLng = (a.lng + b.lng) / 2;
  const dx = b.lng - a.lng;
  const dy = b.lat - a.lat;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(28, dist * 0.28);
  const ctrlLat = midLat + (-dx / (dist || 1)) * lift;
  const ctrlLng = midLng + (dy / (dist || 1)) * lift;
  for (let t = 0; t <= 1; t += 0.05) {
    const u = 1 - t;
    points.push([
      u * u * a.lat + 2 * u * t * ctrlLat + t * t * b.lat,
      u * u * a.lng + 2 * u * t * ctrlLng + t * t * b.lng
    ]);
  }
  return points;
}

function render2dArcs() {
  arcLayer.clearLayers(); // 2D map is unused in globe-only mode
}

// The globe always shows the whole world (every detected country), independent of
// which country is selected/spotlighted — so arcs and points never collapse to one.
function geoScopeItems() {
  const saved = selectedState;
  selectedState = "";
  const items = filteredArticles();
  selectedState = saved;
  return items;
}

/* ---------- one entry point to refresh every geo visualization ---------- */
function updateGeoViz() {
  render2dArcs();
  if (globe && globeMode) {
    const scope = geoScopeItems();
    const counts = geoCounts(scope);
    globe.pointsData(counts.concat(alertOn ? alertPoints : []));
    globe.ringsData(quakeOn ? quakes : []);
    globe.labelsData(
      counts.slice(0, 8).map((d) => ({
        ...d,
        label: `${stateByName.get(d.name.toLowerCase())?.code || d.name} ${d.count}`
      }))
    );
    // The arc web is static; only (re)set it when the stream set changes (see refreshGlobeStreams).
  }
}

/* ---------- live headline ticker across the bottom of the globe ---------- */
const ticker = document.querySelector("#ticker");
const tickerTrack = document.querySelector("#tickerTrack");

function renderTicker(items) {
  const top = items.slice(0, 14);
  if (!top.length) {
    ticker.hidden = true;
    return;
  }
  ticker.hidden = false;
  const html = top
    .map(
      (article) =>
        `<a class="ticker-item" href="${escapeHtml(article.url)}" target="_blank" rel="noreferrer"><b>${escapeHtml(
          stateByName.get(article.state.toLowerCase())?.code || article.state
        )}</b>${escapeHtml(displayTitle(article))}</a>`
    )
    .join("");
  tickerTrack.innerHTML = html + html; // duplicate so the loop is seamless (-50% keyframe)
  tickerTrack.style.animationDuration = `${Math.max(28, top.length * 5)}s`;
}

/* ---------- shareable deep-link state (URL hash) ---------- */
function applyHashToState() {
  const params = new URLSearchParams(location.hash.replace(/^#/, ""));
  if (![...params].length) return;
  if (params.get("q")) searchInput.value = params.get("q");
  if (params.get("cat")) categorySelect.value = params.get("cat");
  if (params.get("c")) selectedState = params.get("c");
  const windowHours = Number(params.get("w"));
  if (windowHours >= 1 && windowHours <= 24) {
    timeWindowHours = windowHours;
    if (timeScrubber) timeScrubber.value = String(windowHours);
    if (timeWindowLabel) timeWindowLabel.textContent = `${windowHours}h`;
  }
}

function updateHash() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("q", searchInput.value.trim());
  if (categorySelect.value) params.set("cat", categorySelect.value);
  if (selectedState) params.set("c", selectedState);
  if (timeWindowHours !== 24) params.set("w", String(timeWindowHours));
  const query = params.toString();
  history.replaceState(null, "", query ? `#${query}` : location.pathname + location.search);
}

/* ---------- AI news radio (Web Speech API, no dependency) ---------- */
const radioBtn = document.querySelector("#radioBtn");
const synth = window.speechSynthesis;
let speaking = false;

function buildRadioScript() {
  const items = lastVisible.length ? lastVisible : articles;
  const scope = selectedState || "around the world";
  const tone = items.length ? feedTone(items) : { label: "calm" };
  const top = items.slice(0, 6);
  const lines = [
    `Here is your live news briefing for ${scope}.`,
    `Tracking ${items.length} ${items.length === 1 ? "story" : "stories"} in the last 24 hours. The news cycle looks ${tone.label.toLowerCase()}.`,
    ...top.map((article, index) => `Number ${index + 1}, from ${article.state}: ${article.title}.`),
    "That is your update. I will keep listening to the world for you."
  ];
  return lines.join(" ");
}

function stopRadio() {
  if (synth) synth.cancel();
  speaking = false;
  radioBtn.setAttribute("aria-pressed", "false");
  radioBtn.querySelector(".tool-label").textContent = "Radio";
}

function startRadio() {
  if (!synth) {
    setStatus("Voice playback is not supported in this browser.");
    return;
  }
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(buildRadioScript());
  utterance.rate = 1.02;
  utterance.pitch = 1;
  utterance.onend = stopRadio;
  utterance.onerror = stopRadio;
  speaking = true;
  radioBtn.setAttribute("aria-pressed", "true");
  radioBtn.querySelector(".tool-label").textContent = "Stop";
  synth.speak(utterance);
}

radioBtn.addEventListener("click", () => (speaking ? stopRadio() : startRadio()));
window.addEventListener("beforeunload", stopRadio);

/* ---------- live overlays: USGS earthquakes + NWS weather alerts ---------- */
const quakeLayer = L.layerGroup().addTo(map);
const alertLayer = L.layerGroup().addTo(map);
const quakeToggle = document.querySelector("#quakeToggle");
const alertToggle = document.querySelector("#alertToggle");
let quakeOn = false;
let alertOn = false;

async function loadQuakes() {
  try {
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
      { cache: "no-store" }
    );
    if (!response.ok) throw new Error(`USGS ${response.status}`);
    const data = await response.json();
    quakes = (data.features || [])
      .map((feature) => {
        const [lng, lat] = feature.geometry?.coordinates || [];
        return {
          lat,
          lng,
          mag: feature.properties?.mag || 0,
          place: feature.properties?.place || "Unknown location",
          time: feature.properties?.time
        };
      })
      .filter((quake) => Number.isFinite(quake.lat) && quake.mag >= 1);
    drawQuakes();
    if (globe && globeMode) updateGeoViz(lastVisible);
  } catch (error) {
    setStatus("Quake feed (USGS) unavailable right now.");
  }
}

function drawQuakes() {
  quakeLayer.clearLayers();
  if (!quakeOn) return;
  quakes.forEach((quake) => {
    const color = quake.mag >= 5 ? "#ff4138" : quake.mag >= 3 ? "#ff9f1c" : "#ffd447";
    L.circleMarker([quake.lat, quake.lng], {
      radius: Math.max(3, quake.mag * 2.2),
      color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.35
    })
      .bindPopup(
        `<div class="popup-title">M${quake.mag.toFixed(1)} earthquake</div><div class="popup-meta">${escapeHtml(quake.place)} · ${relativeTime(quake.time)}</div>`
      )
      .addTo(quakeLayer);
  });
}

async function loadAlerts() {
  try {
    const response = await fetch("https://api.weather.gov/alerts/active?status=actual", {
      cache: "no-store",
      headers: { Accept: "application/geo+json" }
    });
    if (!response.ok) throw new Error(`NWS ${response.status}`);
    const data = await response.json();
    drawAlerts(data.features || []);
  } catch (error) {
    setStatus("Weather alert feed (NWS) unavailable right now.");
  }
}

function alertCentroid(geometry) {
  if (!geometry) return null;
  let ring = null;
  if (geometry.type === "Polygon") ring = geometry.coordinates[0];
  else if (geometry.type === "MultiPolygon") ring = geometry.coordinates[0][0];
  if (!ring || !ring.length) return null;
  let sumLat = 0;
  let sumLng = 0;
  ring.forEach(([lng, lat]) => {
    sumLat += lat;
    sumLng += lng;
  });
  return [sumLat / ring.length, sumLng / ring.length];
}

function drawAlerts(features) {
  alertLayer.clearLayers();
  alertPoints = [];
  features.forEach((feature) => {
    const center = alertCentroid(feature.geometry);
    if (!center) return;
    const props = feature.properties || {};
    const severe = /(Severe|Extreme)/i.test(props.severity || "");
    alertPoints.push({
      kind: "alert",
      name: props.event || "Weather alert",
      lat: center[0],
      lng: center[1],
      severe
    });
    if (!alertOn) return;
    const color = severe ? "#ff4138" : "#f5a623";
    L.circleMarker(center, {
      radius: 6,
      color,
      weight: 1.5,
      fillColor: color,
      fillOpacity: 0.5
    })
      .bindPopup(
        `<div class="popup-title">${escapeHtml(props.event || "Weather alert")}</div><div class="popup-meta">${escapeHtml((props.areaDesc || "").slice(0, 120))}</div>`
      )
      .addTo(alertLayer);
  });
  if (globe && globeMode) updateGeoViz(lastVisible);
}

quakeToggle.addEventListener("click", () => {
  quakeOn = !quakeOn;
  quakeToggle.setAttribute("aria-pressed", String(quakeOn));
  if (quakeOn) loadQuakes();
  else {
    drawQuakes();
    if (globe && globeMode) updateGeoViz(lastVisible);
  }
});

alertToggle.addEventListener("click", () => {
  alertOn = !alertOn;
  alertToggle.setAttribute("aria-pressed", String(alertOn));
  if (alertOn) {
    loadAlerts();
  } else {
    alertLayer.clearLayers();
    if (globe && globeMode) updateGeoViz(lastVisible);
  }
});

/* ---------- live translation of the feed + ticker to English ---------- */
const translateBtn = document.querySelector("#translateBtn");
if (translateBtn) {
  translateBtn.addEventListener("click", () => {
    translateOn = !translateOn;
    translateBtn.setAttribute("aria-pressed", String(translateOn));
    translateBtn.querySelector(".tool-label").textContent = translateOn ? "English ✓" : "Translate";
    if (translateOn) ensureFeedTranslations(lastVisible);
    renderFeed(lastVisible);
    renderTicker(lastVisible);
  });
}

/* ---------- toggle the globe-anchored live-stream tiles (perf) ---------- */
let tvOn = true;
const tvToggle = document.querySelector("#tvToggle");
if (tvToggle) {
  tvToggle.addEventListener("click", () => {
    tvOn = !tvOn;
    tvToggle.setAttribute("aria-pressed", String(tvOn));
    if (globe) globe.htmlElementsData(tvOn ? liveGlobeStreams() : []);
  });
}

/* ---------- responsive: keep both renderers sized ---------- */
window.addEventListener("resize", sizeGlobe);

/* ---------- PWA: install prompt + service worker ---------- */
const installBtn = document.querySelector("#installBtn");
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installBtn.hidden = true;
});

if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* offline support is a progressive enhancement; ignore failures */
    });
  });
}

/* ---------- Globe-only experience: the 3D globe is the one and only map ---------- */
// Hide the 2D/3D switch and boot straight into the globe.
viewToggle.hidden = true;
setGlobeMode(true).then(flyToSelected);
