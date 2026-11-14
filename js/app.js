/* ==========================================================================
   Каталог игр NewStarGames — логика Telegram Mini App
   Зависимости: telegram-web-app.js, js/games.js (GENRES, GAMES)
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Telegram WebApp ------------------------------------------- */
  let tg = (window.Telegram && window.Telegram.WebApp) || null;
  let isTg = !!tg && !!tg.isTelegram;

  function tuneTelegram() {
    if (!tg) return;
    tg.ready();
    tg.expand();

    // Тёмная шапка и фон в цвет каталога
    try {
      if (tg.setHeaderColor) tg.setHeaderColor('#07070d');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#07070d');
    } catch (e) { /* старые клиенты */ }
  }
  tuneTelegram();

  // SDK грузится асинхронно и может прийти позже страницы:
  // подождать до 4 секунд, а нет — работать как обычный сайт
  if (!tg) {
    let tries = 0;
    const waitSdk = setInterval(() => {
      tg = (window.Telegram && window.Telegram.WebApp) || null;
      if (tg) {
        isTg = !!tg.isTelegram;
        tuneTelegram();
        greet();
        clearInterval(waitSdk);
      } else if (++tries >= 40) {
        clearInterval(waitSdk);
      }
    }, 100);
  }

  const haptic = (style) => {
    try {
      if (!tg || !tg.HapticFeedback) return;
      if (style === 'soft' || style === 'light' || style === 'medium' || style === 'heavy') {
        tg.HapticFeedback.impactOccurred(style);
      } else {
        tg.HapticFeedback.notificationOccurred(style);
      }
    } catch (e) { /* ignore */ }
  };

  const openGame = (url) => {
    haptic('medium');
    if (tg && tg.openTelegramLink && /^https:\/\/t\.me\//i.test(url)) {
      const res = tg.openTelegramLink(url);
      if (res === 'fail' && tg.openLink) tg.openLink(url);
      return;
    }
    if (tg && tg.openLink) { tg.openLink(url); return; }
    window.location.href = url;
  };

  /* ---------- Утилиты ---------------------------------------------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const GENRE_MAP = {};
  (typeof GENRES !== 'undefined' ? GENRES : []).forEach((g) => { GENRE_MAP[g.key] = g.label; });
  const ALL_GAMES = (typeof GAMES !== 'undefined' ? GAMES : []);

  const NEW_WINDOW_DAYS = 45;
  const DAY = 86400000;

  const fmtPlayers = (n) => {
    if (!n && n !== 0) return '';
    if (n < 1000) return String(n);
    if (n < 1000000) {
      const v = (Math.round(n / 100) / 10).toFixed(1).replace(/\.0$/, '');
      return v.replace('.', ',') + 'K';
    }
    return (Math.round(n / 100000) / 10).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'M';
  };

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const isNew = (released) => {
    if (!released) return false;
    const d = new Date(released).getTime();
    return !isNaN(d) && (Date.now() - d) < NEW_WINDOW_DAYS * DAY;
  };

  const storage = {
    get(key, fallback) {
      try { const v = localStorage.getItem('nsg:' + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('nsg:' + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
  };

  /* ---------- Состояние -------------------------------------------------- */
  const state = {
    q: '',
    genre: storage.get('genre', 'all'),
    sort: storage.get('sort', 'popular'),
  };
  if (state.genre !== 'all' && !GENRE_MAP[state.genre]) state.genre = 'all';
  if (!['popular', 'new', 'title', 'az'].includes(state.sort)) state.sort = 'popular';

  /* ---------- Deep-линки: ?startapp=... ---------------------------------- */
  /* Формы параметра startapp:
       genre:puzzle   — открыть каталог с фильтром по жанру
       q:бомб         — сразу показать поиск
       play:tanks-8bit— сразу запустить игру
       tanks-8bit     — показать карточку игры и подсветить её
     Работает и при запуске через main app (https://t.me/bot?startapp=...),
     и через direct link (https://t.me/bot/games?startapp=...), и в браузере (?startapp=...). */
  const deepAction = applyDeepLink(readStartParam());

  function readStartParam() {
    try {
      const p = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param;
      if (p) return String(p);
    } catch (e) { /* ignore */ }
    try {
      const u = new URLSearchParams(window.location.search);
      return u.get('tgWebAppStartParam') || u.get('startapp') || '';
    } catch (e) { return ''; }
  }

  function findGame(key) {
    const k = String(key).toLowerCase();
    for (let i = 0; i < ALL_GAMES.length; i++) {
      if (String(ALL_GAMES[i].id).toLowerCase() === k) return ALL_GAMES[i];
    }
    return null;
  }

  function applyDeepLink(raw) {
    if (!raw) return null;
    let value;
    try { value = decodeURIComponent(String(raw)).trim(); } catch (e) { value = String(raw).trim(); }
    if (!value) return null;

    const m = value.match(/^(genre|q|play|game|id):(.+)$/i);
    const kind = m ? m[1].toLowerCase() : '';
    const arg = (m ? m[2] : value).trim();

    if (kind === 'q') { state.q = arg; state.genre = 'all'; return null; }
    if (GENRE_MAP[arg] && (kind === 'genre' || !kind)) { state.genre = arg; state.q = ''; return null; }

    const game = findGame(arg);
    if (game) return { open: kind === 'play', id: game.id };

    state.q = arg; // на худой конец считаем это поисковым запросом
    state.genre = 'all';
    return null;
  }

  function focusCard(id) {
    const card = grid.querySelector('.card[data-id="' + id + '"]');
    if (!card) return;
    card.classList.add('is-flash');
    setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 140);
  }

  /* ---------- DOM -------------------------------------------------------- */
  const grid = $('#grid');
  const chipsBar = $('#chips');
  const resultsEl = $('#results');
  const emptyEl = $('#empty');
  const countEl = $('#count');
  const searchInput = $('#search');
  const searchClear = $('#searchClear');
  const sortSelect = $('#sort');

  countEl.textContent = ALL_GAMES.length;

  /* ---------- Приветствие ------------------------------------------------ */
  const greet = () => {
    const user = isTg && tg.initDataUnsafe && tg.initDataUnsafe.user;
    const name = user && (user.first_name || user.username);
    $('#hello').textContent = name
      ? 'Привет, ' + name + '! Выбери игру 👇'
      : 'Витрина игр NewStarGames — играй в один тап';
  };
  greet();

  /* ---------- Чипы жанров ------------------------------------------------ */
  function buildChips() {
    const counts = { all: ALL_GAMES.length };
    ALL_GAMES.forEach((g) => { counts[g.genre] = (counts[g.genre] || 0) + 1; });

    Object.keys(GENRE_MAP).forEach((key) => {
      if (!counts[key]) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.genre = key;
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = escapeHtml(GENRE_MAP[key]) +
        ' <span class="chip__num">' + counts[key] + '</span>';
      chipsBar.appendChild(btn);
    });

    $('.chip[data-genre="all"] .chip__num').textContent = counts.all;
    chipsBar.querySelectorAll('[data-count-for]').forEach((el) => {
      el.textContent = counts[el.dataset.countFor] || 0;
    });
  }

  function paintChips() {
    $$('.chip', chipsBar).forEach((btn) => {
      const active = btn.dataset.genre === state.genre;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  /* ---------- Фильтрация + сортировка ------------------------------------ */
  function visibleGames() {
    const q = state.q.trim().toLowerCase();
    let list = ALL_GAMES.filter((g) => {
      if (state.genre !== 'all' && g.genre !== state.genre) return false;
      if (!q) return true;
      const hay = (g.title + ' ' + g.description + ' ' + (GENRE_MAP[g.genre] || '')).toLowerCase();
      return hay.indexOf(q) !== -1;
    });

    const cmp = {
      popular: (a, b) => (b.players || 0) - (a.players || 0),
      new: (a, b) => new Date(b.released || 0) - new Date(a.released || 0),
      title: (a, b) => a.title.localeCompare(b.title, 'ru'),
      az: (a, b) => b.title.localeCompare(a.title, 'ru'),
    }[state.sort];

    return cmp ? list.sort(cmp) : list;
  }

  /* ---------- Карточка --------------------------------------------------- */
  function cardHtml(g, index) {
    const [a, b] = g.colors || ['#7c5cff', '#00e5ff'];
    const pattern = 'pat--' + (g.pattern || 'grid');
    const badge = g.hot
      ? '<span class="badge badge--hot">HOT</span>'
      : (isNew(g.released) ? '<span class="badge badge--new">NEW</span>' : '');
    // Картинка (если есть) поверх градиента; если не загрузилась — остаётся градиент + glyph
    const glyph = '<span class="card__glyph" aria-hidden="true">' + escapeHtml(g.glyph || '🎮') + '</span>';
    const img = g.image
      ? '<img class="card__img" src="' + escapeHtml(g.image) + '" alt="' + escapeHtml(g.title) + '" loading="lazy" ' +
        'onerror="this.parentNode.classList.remove(\'has-img\');this.remove()">'
      : '';
    const players = g.players
      ? '<span class="card__meta"><i class="dot" aria-hidden="true"></i>' + fmtPlayers(g.players) + ' игроков</span>'
      : '';

    return '' +
      '<article class="card" data-id="' + escapeHtml(g.id) + '" style="--a:' + a + ';--b:' + b + ';--i:' + index + '">' +
        '<a class="card__link js-game" href="' + escapeHtml(g.url) + '" data-url="' + escapeHtml(g.url) +
          '" aria-label="Играть в ' + escapeHtml(g.title) + '">' +
          '<div class="card__banner ' + pattern + (g.image ? ' has-img' : '') + '">' +
            '<span class="card__shine" aria-hidden="true"></span>' +
            badge +
            img +
            glyph +
          '</div>' +
          '<div class="card__body">' +
            '<span class="card__genre">' + escapeHtml(GENRE_MAP[g.genre] || 'Игры') + '</span>' +
            '<h3 class="card__title">' + escapeHtml(g.title) + '</h3>' +
            '<p class="card__desc">' + escapeHtml(g.description) + '</p>' +
            '<div class="card__foot">' +
              '<div class="card__meta-wrap">' + players + '</div>' +
              '<span class="btn-play">Играть' +
                '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</article>';
  }

  /* ---------- Рендер ----------------------------------------------------- */
  let rendered = 0;

  function render() {
    const list = visibleGames();
    const html = list.map(cardHtml).join('');

    grid.innerHTML = html;
    emptyEl.hidden = list.length !== 0;
    grid.hidden = list.length === 0;

    rendered = list.length;
    resultsEl.textContent = list.length === 0
      ? ''
      : 'Показано ' + list.length + ' из ' + ALL_GAMES.length +
        (state.genre === 'all' ? '' : ' · ' + (GENRE_MAP[state.genre] || ''));

    sortSelect.value = state.sort;
    searchInput.value = state.q;
    searchClear.hidden = !state.q;
    paintChips();
  }

  /* ---------- События ---------------------------------------------------- */
  chipsBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    state.genre = btn.dataset.genre;
    storage.set('genre', state.genre);
    haptic('light');
    render();
  });

  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    storage.set('sort', state.sort);
    haptic('light');
    render();
  });

  let typingTimer = null;
  searchInput.addEventListener('input', () => {
    state.q = searchInput.value;
    searchClear.hidden = !state.q;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(render, 120);
  });

  searchClear.addEventListener('click', () => {
    state.q = '';
    searchInput.value = '';
    searchClear.hidden = true;
    searchInput.focus();
    haptic('light');
    render();
  });

  $('#resetFilters').addEventListener('click', () => {
    state.q = '';
    state.genre = 'all';
    storage.set('genre', 'all');
    haptic('light');
    render();
  });

  // Открытие игры: нативный Telegram-роутинг вместо перехода страницы
  grid.addEventListener('click', (e) => {
    const link = e.target.closest('.js-game');
    if (!link) return;
    if (!isTg && !(tg && tg.openTelegramLink)) return; // обычный браузер — идём по href
    e.preventDefault();
    openGame(link.dataset.url || link.href);
  });

  /* ---------- Старт ------------------------------------------------------ */
  buildChips();
  render();

  if (deepAction) {
    const g = findGame(deepAction.id);
    if (deepAction.open && g) {
      setTimeout(() => openGame(g.url), 300);
    } else {
      focusCard(deepAction.id);
    }
  }
})();
