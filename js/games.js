/* ==========================================================================
   ДАННЫЕ КАТАЛОГА — правь только этот файл, чтобы добавить/убрать игру.
   ==========================================================================
   Поля игры:
     id          — уникальный ключ (латиница, без пробелов)
     title       — название на карточке
     description — краткое описание (до ~60 символов)
     url         — ссылка на игру в Telegram-боте
     genre       — ключ жанра (см. GENRES ниже)
     glyph       — эмодзи вместо картинки
     colors      — [accent, accent2] для градиентного баннера
     pattern     — фон баннера: rays | grid | dots | waves | hex
     hot         — true = бейдж HOT на карточке
     players     — (необязательно) число игроков: «48,2K игроков» + сортировка
     released    — (необязательно) "YYYY-MM-DD": бейдж NEW + сортировка «Сначала новые»
     image       — (необязательно) путь к баннеру, напр. "assets/bombman.jpg"
                   если задан — перекрывает градиент и glyph

   Порядок элементов в массиве = порядок по умолчанию (сортировка «По умолчанию»).
   ========================================================================== */

const GENRES = [
  { key: 'arcade',   label: 'Аркады' },
  { key: 'strategy', label: 'Стратегии' },
  { key: 'puzzle',   label: 'Головоломки' },
];

const GAMES = [
  {
    id: 'space-ai-commander',
    title: 'Space AI Commander',
    description: 'Командуй героическим пилотом, бросившим вызов вселенскому злу!',
    url: 'https://t.me/NewStarGame_bot/play?mode=fullscreen',
    image: 'assets/space-ai-commander.jpg',
    genre: 'strategy',
    glyph: '🚀',
    colors: ['#4b6bff', '#0b1f6b'],
    pattern: 'hex',
    hot: true,
  },
  {
    id: 'tanks-8bit',
    title: 'Танки 8-бит',
    description: 'Танчики, почти те самые.',
    url: 'https://t.me/NewStarGame_bot/tanks?mode=fullscreen',
    image: 'assets/tanks-8bit.jpg',
    genre: 'arcade',
    glyph: '🎮',
    colors: ['#7cff5c', '#0d8f5a'],
    pattern: 'grid',
  },
  {
    id: 'bombman',
    title: 'BombMan',
    description: 'Классическая игра про бомбы',
    url: 'https://t.me/NewStarGame_bot/bombman_game',
    image: 'assets/bombman.jpg',
    genre: 'arcade',
    glyph: '💣',
    colors: ['#ff9a2e', '#ff2e50'],
    pattern: 'dots',
  },
  {
    id: 'tower-defence',
    title: 'Tower Defence',
    description: 'Обороняйся! пока не стало слишком поздно!',
    url: 'https://t.me/NewStarGame_bot/tower_defence_game',
    image: 'assets/tower-defence.jpg',
    genre: 'strategy',
    glyph: '🗼',
    colors: ['#00e5ff', '#0a5cff'],
    pattern: 'waves',
  },
  {
    id: 'radiance',
    title: 'Radiance',
    description: 'Последний луч света против сгущающейся тьмы!',
    url: 'https://t.me/NewStarGame_bot/play_radiance',
    image: 'assets/radiance.jpg',
    genre: 'puzzle',
    glyph: '✨',
    colors: ['#ffd54a', '#ff6a00'],
    pattern: 'rays',
  },
  {
    id: 'neon-hive',
    title: 'Neon Hive',
    description: 'Аркада в неоновом мире: собери рой и захвати улей',
    url: 'https://t.me/NewStarGame_bot/neon_hive_game',
    image: 'assets/neon-hive.jpg',
    genre: 'arcade',
    glyph: '🐝',
    colors: ['#ff2e88', '#7b2dff'],
    pattern: 'rays',
  },
];
