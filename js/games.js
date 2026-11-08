/* ==========================================================================
   ДАННЫЕ КАТАЛОГА — правь только этот файл, чтобы добавить/убрать игру.
   ==========================================================================
   Поля игры:
     id          — уникальный ключ (латиница, без пробелов)
     title       — название на карточке
     description — краткое описание (до ~60 символов)
     url         — ссылка на игру в Telegram-боте  https://t.me/<bot>/<app_link>
     genre       — ключ жанра (см. GENRES ниже)
     glyph       — эмодзи/символ вместо картинки
     colors      — [accent, accent2] для градиентного баннера
     pattern     — фон баннера: rays | grid | dots | waves | hex
     players     — число игроком (для сортировки «Популярные»)
     released    — дата релиза "YYYY-MM-DD" (для «Сначала новые» и бейджа NEW)
     hot         — true = бейдж HOT
     image       — (необязательно) путь к баннеру, напр. "assets/neon-hive.jpg"
                   если задан — перекрывает градиент/glyph
   ========================================================================== */

const GENRES = [
  { key: 'arcade',    label: 'Аркады' },
  { key: 'puzzle',    label: 'Головоломки' },
  { key: 'racing',    label: 'Гонки' },
  { key: 'strategy',  label: 'Стратегии' },
  { key: 'casual',    label: 'На каждый день' },
  { key: 'action',    label: 'Экшен' },
];

const GAMES = [
  {
    id: 'neon-hive',
    title: 'Neon Hive',
    description: 'Аркада в неоновом мире: собери рой и захвати улей',
    url: 'https://t.me/NewStarGame_bot/neon_hive_game',
    genre: 'arcade',
    glyph: '🐝',
    colors: ['#ff2e88', '#7b2dff'],
    pattern: 'rays',
    players: 48200,
    released: '2025-02-14',
    hot: true,
  },
  {
    id: 'star-racer',
    title: 'Star Racer',
    description: 'Космические гонки на выживание сквозь астероиды',
    url: 'https://t.me/NewStarGame_bot/star_racer_game',
    genre: 'racing',
    glyph: '🚀',
    colors: ['#00e5ff', '#0a5cff'],
    pattern: 'waves',
    players: 39100,
    released: '2025-01-08',
    hot: true,
  },
  {
    id: 'pixel-forge',
    title: 'Pixel Forge',
    description: 'Головоломка: собирай пиксельные схемы и механизмы',
    url: 'https://t.me/NewStarGame_bot/pixel_forge_game',
    genre: 'puzzle',
    glyph: '🧩',
    colors: ['#ffb020', '#ff5c39'],
    pattern: 'grid',
    players: 27600,
    released: '2024-11-20',
  },
  {
    id: 'moon-colony',
    title: 'Moon Colony',
    description: 'Построй лунную базу и продержи колонию живой',
    url: 'https://t.me/NewStarGame_bot/moon_colony_game',
    genre: 'strategy',
    glyph: '🌙',
    colors: ['#9d7bff', '#2f2a7a'],
    pattern: 'hex',
    players: 21450,
    released: '2025-03-02',
  },
  {
    id: 'cyber-drift',
    title: 'Cyber Drift',
    description: 'Дрифт в ночном мегаполисе, таблица рекордов друзей',
    url: 'https://t.me/NewStarGame_bot/cyber_drift_game',
    genre: 'racing',
    glyph: '🏎️',
    colors: ['#00ffa3', '#0a8f6e'],
    pattern: 'grid',
    players: 33900,
    released: '2024-12-05',
  },
  {
    id: 'nano-tanks',
    title: 'Nano Tanks',
    description: 'Быстрые танковые бои на короткой волне',
    url: 'https://t.me/NewStarGame_bot/nano_tanks_game',
    genre: 'action',
    glyph: '🛰️',
    colors: ['#ff7a45', '#c0143c'],
    pattern: 'dots',
    players: 18700,
    released: '2024-10-11',
  },
  {
    id: 'gem-rush',
    title: 'Gem Rush',
    description: 'Копай, меняй местами и собирай кристаллы',
    url: 'https://t.me/NewStarGame_bot/gem_rush_game',
    genre: 'casual',
    glyph: '💎',
    colors: ['#33e0ff', '#b14cff'],
    pattern: 'dots',
    players: 44100,
    released: '2024-09-02',
  },
  {
    id: 'void-saga',
    title: 'Void Saga',
    description: 'Проведи корабль сквозь пустоту и её обитателей',
    url: 'https://t.me/NewStarGame_bot/void_saga_game',
    genre: 'action',
    glyph: '🌌',
    colors: ['#6f5bff', '#101338'],
    pattern: 'rays',
    players: 15200,
    released: '2025-03-28',
    hot: false,
  },
  {
    id: 'block-tower',
    title: 'Block Tower',
    description: 'Построй самую высокую башню и не урони её',
    url: 'https://t.me/NewStarGame_bot/block_tower_game',
    genre: 'casual',
    glyph: '🧱',
    colors: ['#ffd54a', '#f0733c'],
    pattern: 'hex',
    players: 12800,
    released: '2025-04-15',
  },
  {
    id: 'logic-core',
    title: 'Logic Core',
    description: 'Логические задачи на перегрузку ядра',
    url: 'https://t.me/NewStarGame_bot/logic_core_game',
    genre: 'puzzle',
    glyph: '⚙️',
    colors: ['#8ef0c9', '#1c7f8f'],
    pattern: 'waves',
    players: 9600,
    released: '2025-05-01',
  },
];
