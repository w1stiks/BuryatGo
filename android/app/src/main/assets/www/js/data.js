/* BuryatGo — учебный контент, предметы магазина, лиги */
window.BG_DATA = (function () {
  'use strict';

  const words = {
    // ── v1.8: новые модули ──
    b_tolgoi:  { bu: 'Толгой',   ru: 'Голова',  emoji: '🙂', note: '«Толгой» — голова, а ещё «главный, старший».' },
    b_gar:     { bu: 'Гар',       ru: 'Рука',    emoji: '✋', note: '«Хоёр гар» — две руки.' },
    b_hul:     { bu: 'Хүл',       ru: 'Нога',    emoji: '🦵', note: 'Буква «Ү» читается как немецкая ü.' },
    b_nyuden:  { bu: 'Нюдэн',    ru: 'Глаз',    emoji: '👁️', note: 'Множественное число — «нюддад».' },
    b_shehen:  { bu: 'Шэхэн',    ru: 'Ухо',      emoji: '👂', note: '«Шэ» произносится мягко.' },
    b_hamar:   { bu: 'Хамар',    ru: 'Нос',      emoji: '👃', note: 'Ударение на первый слог.' },
    b_ama:     { bu: 'Ама',       ru: 'Рот',      emoji: '👄', note: 'Короткое и простое слово.' },
    b_uhen:    { bu: 'Үһэн',     ru: 'Волосы',  emoji: '💇', note: '«Һ» — мягкий выдох [h].' },
    b_ubel:    { bu: 'Үбэл',     ru: 'Зима',    emoji: '❄️', note: 'Бурятская зима длинная и солнечная.' },
    b_habar:   { bu: 'Хабар',    ru: 'Весна',   emoji: '🌱', note: 'Весной отмечают Сагаалган.' },
    b_zun:     { bu: 'Зун',       ru: 'Лето',    emoji: '☀️', note: 'Летом проходит Сурхарбаан.' },
    b_namar:   { bu: 'Намар',    ru: 'Осень',   emoji: '🍂', note: 'Время сбора урожая.' },
    b_boroo:   { bu: 'Бороо',    ru: 'Дождь',   emoji: '🌧️', note: '«Бороо орожо байна» — идёт дождь.' },
    b_sahan:   { bu: 'Саһан',    ru: 'Снег',    emoji: '🌨️', note: 'Зимой степь под саһаном.' },
    b_halhin:  { bu: 'Һалхин',   ru: 'Ветер',   emoji: '🌬️', note: 'В степи он очень сильный.' },
    b_huiten:  { bu: 'Хүйтэн',   ru: 'Холодно', emoji: '🥶', note: 'Противоположность — «халуун».' },
    b_haluun:  { bu: 'Халуун',   ru: 'Жарко',   emoji: '🥵', note: 'Долгое «уу» тянется.' },
    b_yabaha:  { bu: 'Ябаха',    ru: 'Идти',    emoji: '🚶', note: '«Би ябанаб» — я иду.' },
    b_edihe:   { bu: 'Эдихэ',    ru: 'Есть',    emoji: '🍽️', note: '«Бууза эдихэ» — есть буузы.' },
    b_uuha:    { bu: 'Ууха',     ru: 'Пить',    emoji: '🥤', note: '«Сай ууха» — пить чай.' },
    b_untaha:  { bu: 'Унтаха',   ru: 'Спать',   emoji: '😴', note: '«Бато унтана» — Бато спит.' },
    b_unshaha: { bu: 'Уншаха',   ru: 'Читать',  emoji: '📖', note: '«Ном уншаха» — читать книгу.' },
    b_beshehe: { bu: 'Бэшэхэ',   ru: 'Писать',  emoji: '✍️', note: 'Оба «э» читаются чётко.' },
    b_hurguuli:{ bu: 'Һургуули', ru: 'Школа',   emoji: '🏫', note: 'От глагола «һураха» — учиться.' },
    b_bagsha:  { bu: 'Багша',    ru: 'Учитель', emoji: '🧑‍🏫', note: 'Уважительное обращение к педагогу.' },
    b_nom:     { bu: 'Ном',       ru: 'Книга',   emoji: '📕', note: '«Шэнэ ном» — новая книга.' },
    b_huragsha:{ bu: 'Һурагша',  ru: 'Ученик',  emoji: '🧒', note: 'Тот, кто учится.' },
    b_debter:  { bu: 'Дэбтэр',   ru: 'Тетрадь', emoji: '📒', note: 'Для домашнего задания.' },
    b_nuur:    { bu: 'Нуур',      ru: 'Озеро',   emoji: '🏞️', note: '«Байгал нуур» — озеро Байкал.' },
    b_gol:     { bu: 'Гол',       ru: 'Река',    emoji: '🌊', note: 'Селенга — главная река Бурятии.' },
    b_aral:    { bu: 'Арал',      ru: 'Остров',  emoji: '🏝️', note: 'Ольхон — самый большой арал Байкала.' },
    b_zagahan: { bu: 'Загаһан',  ru: 'Рыба',    emoji: '🐟', note: 'Омуль — знаменитая рыба Байкала.' },
    b_dolgin:  { bu: 'Долгин',   ru: 'Волна',   emoji: '🌊', note: 'На Байкале волны бывают как на море.' },
    b_erie:    { bu: 'Эрье',     ru: 'Берег',   emoji: '🏖️', note: 'Мягкий знак смягчает «р».' },
    b_bayaskhalan:{ bu: 'Баясхалан', ru: 'Радость', emoji: '😄', note: 'Корень «баяр» — радость.' },
    b_gunig:   { bu: 'Гуниг',    ru: 'Грусть',  emoji: '😔', note: 'Противоположность радости.' },
    b_duratai: { bu: 'Дуратай',  ru: 'Любимый', emoji: '❤️', note: '«Би сайд дуратай» — я люблю чай.' },
    b_uhaatai: { bu: 'Ухаатай',  ru: 'Умный',  emoji: '🧠', note: '«Ухаан» — ум, «-тай» — «с».' },
    b_zorigtoi:{ bu: 'Зоригтой', ru: 'Смелый',  emoji: '🦁', note: '«Зориг» — смелость.' },
    b_erhim:   { bu: 'Эрхим',    ru: 'Отличный', emoji: '🌟', note: 'Высшая похвала.' },
    b_zam:     { bu: 'Зам',       ru: 'Дорога',  emoji: '🛣️', note: '«Урта зам» — длинная дорога.' },
    b_hoto:    { bu: 'Хото',      ru: 'Город',   emoji: '🏙️', note: 'Улан-Удэ — столичный хото.' },
    b_toskhon: { bu: 'Тосхон',   ru: 'Село',    emoji: '🏡', note: 'Небольшое поселение.' },
    b_buudal:  { bu: 'Буудал',   ru: 'Остановка', emoji: '🚏', note: 'Место, где останавливаются.' },
    b_tergen:  { bu: 'Тэргэн',   ru: 'Повозка', emoji: '🛤', note: 'Телега; так же говорят про транспорт.' },
    b_guur:    { bu: 'Гүүр',      ru: 'Мост',    emoji: '🌉', note: 'Долгое «үү».' },
    // ── Модуль 1: Приветствие ──
    amar:      { bu: 'Амар мэндэ!',      ru: 'Здравствуйте!',  emoji: '👋', note: 'Самое распространённое приветствие. Дословно — «мира и здоровья».' },
    sain:      { bu: 'Сайн байна!',      ru: 'Привет!',        emoji: '😊', note: 'Дружеское приветствие. Дословно — «хорошо живётся».' },
    bayartai:  { bu: 'Баяртай!',         ru: 'До свидания!',   emoji: '🙋', note: 'Прощание. Корень «баяр» означает «радость».' },
    sain_gut:  { bu: 'Сайн байна гүт?',  ru: 'Как поживаете?', emoji: '🤔', note: '«гүт» — вопросительная частица.' },
    hain:      { bu: 'Һайн',             ru: 'Хорошо',         emoji: '👍', note: 'Буква «Һ» — мягкий выдох, похожий на английское [h].' },
    bayarlaa:  { bu: 'Баярлаа!',         ru: 'Спасибо!',        emoji: '🙏', note: 'Благодарность. «Ехэ баярлаа» — большое спасибо.' },
    bi:        { bu: 'Би',               ru: 'Я',              emoji: '🙋‍♂️' },
    shi:       { bu: 'Ши',               ru: 'Ты',             emoji: '👉' },
    nere:      { bu: 'Минии нэрэ',       ru: 'Меня зовут',     emoji: '🏷️', note: 'Дословно — «моё имя».' },
    tiime:     { bu: 'Тиимэ',            ru: 'Да',             emoji: '✅' },
    ugy:       { bu: 'Үгы',              ru: 'Нет',            emoji: '❌' },

    // ── Цвета и формы (заменил модуль «Числа») ──
    hohe:      { bu: 'Хөхэ',      ru: 'Синий',      emoji: '🔵', note: 'Также «голубой». «Хөхэ тэнгэри» — синее небо.' },
    ulaan:     { bu: 'Улаан',     ru: 'Красный',    emoji: '🔴', note: 'Название Улан-Удэ означает «Красная Уда».' },
    shara:     { bu: 'Шара',      ru: 'Жёлтый',     emoji: '🟡' },
    nogoon:    { bu: 'Ногоон',    ru: 'Зелёный',    emoji: '🟢' },
    sagaan:    { bu: 'Сагаан',    ru: 'Белый',      emoji: '⚪', note: 'Сагаалган — праздник Белого месяца, бурятский Новый год.' },
    hara:      { bu: 'Хара',      ru: 'Чёрный',     emoji: '⚫' },
    tontoloo:  { bu: 'Тонтолоо',  ru: 'Круглый',    emoji: '⭕' },
    durbeljen: { bu: 'Дүрбэлжэн', ru: 'Квадратный', emoji: '🟪', note: 'От «дүрбэн» — четыре: «четырёхугольный».' },

    // ── Модуль 3: Семья ──
    ezhy:    { bu: 'Эжы',        ru: 'Мама',            emoji: '👩' },
    aba:     { bu: 'Аба',        ru: 'Папа',            emoji: '👨' },
    aha:     { bu: 'Аха',        ru: 'Старший брат',    emoji: '👦' },
    egeshe:  { bu: 'Эгэшэ',      ru: 'Старшая сестра',  emoji: '👧' },
    duu:     { bu: 'Дүү',        ru: 'Младший брат',    emoji: '🧒', note: 'Также «младшая сестра».' },
    hugshen: { bu: 'Хүгшэн эжы', ru: 'Бабушка',         emoji: '👵' },
    ubgen:   { bu: 'Үбгэн аба',  ru: 'Дедушка',         emoji: '👴' },
    ger:     { bu: 'Гэр бүлэ',   ru: 'Семья',           emoji: '👨‍👩‍👧' },

    // ── Модуль 4: Еда ──
    sai:      { bu: 'Сай',      ru: 'Чай',     emoji: '🍵', note: 'Бурятский чай часто пьют с молоком.' },
    sun:      { bu: 'Сүн',      ru: 'Молоко',  emoji: '🥛' },
    hileemen: { bu: 'Хилээмэн', ru: 'Хлеб',    emoji: '🍞' },
    uhan:     { bu: 'Уһан',     ru: 'Вода',    emoji: '💧' },
    mahan:    { bu: 'Мяхан',    ru: 'Мясо',    emoji: '🥩' },
    buuza:    { bu: 'Бууза',    ru: 'Буузы',   emoji: '🥟', note: 'Национальное блюдо — паровые «позы».' },
    amtatai:  { bu: 'Амтатай',  ru: 'Вкусный', emoji: '😋' },

    // ── Модуль 5: Природа и животные ──
    dalai:  { bu: 'Далай',  ru: 'Байкал',  emoji: '🌊', note: 'Дословно — «море». Буряты называют Байкал «Байгал далай».' },
    shono:  { bu: 'Шоно',   ru: 'Волк',    emoji: '🐺' },
    temeen: { bu: 'Тэмээн', ru: 'Верблюд', emoji: '🐫' },
    morin:  { bu: 'Морин',  ru: 'Лошадь',  emoji: '🐎', note: '«Морин хуур» — скрипка с головой коня.' },
    nohoi:  { bu: 'Нохой',  ru: 'Собака',  emoji: '🐕' },
    uher:   { bu: 'Үхэр',   ru: 'Корова',  emoji: '🐄' },
    honin:  { bu: 'Хонин',  ru: 'Овца',    emoji: '🐑' },
    uula:   { bu: 'Уула',   ru: 'Гора',    emoji: '⛰️' },
    modon:  { bu: 'Модон',  ru: 'Дерево',  emoji: '🌳' },
    naran:  { bu: 'Наран',  ru: 'Солнце',  emoji: '☀️' },

    // ── Модуль 6: Одежда и быт ──
    degel:    { bu: 'Дэгэл',    ru: 'Традиционный костюм', emoji: '👘', note: 'Национальный халат с запахом, его носят с поясом.' },
    malgai:   { bu: 'Малгай',   ru: 'Шапка',   emoji: '🎩', note: 'Традиционный малгай венчает красная кисточка — залаа.' },
    gutal:    { bu: 'Гутал',    ru: 'Сапоги',  emoji: '👢', note: 'Традиционные гутулы шьют с загнутыми вверх носами.' },
    buhe:     { bu: 'Бүһэ',     ru: 'Пояс',    emoji: '🎗️' },
    hubsahan: { bu: 'Хубсаһан', ru: 'Одежда',  emoji: '👕' },
    geer:     { bu: 'Гэр',      ru: 'Дом',     emoji: '🏠', note: 'Также «юрта». «Гэр бүлэ» — семья.' },
    ayaga:    { bu: 'Аяга',     ru: 'Пиала',   emoji: '🥣' },
    shiree:   { bu: 'Ширээ',    ru: 'Стол',    emoji: '🪑' },
    // ── Super: Праздники и традиции ──
    sagaalgan: { bu: 'Сагаалган', ru: 'Белый месяц', emoji: '🎊', note: 'Бурятский Новый год по лунному календарю.' },
    surharban: { bu: 'Сурхарбаан', ru: 'Праздник лучников', emoji: '🏹', note: 'Летний праздник: стрельба из лука, борьба и скачки.' },
    yokhor:    { bu: 'Ёохор',      ru: 'Круговой танец', emoji: '💃', note: 'Танец в кругу — символ дружбы и единства.' },
    hadag:     { bu: 'Хадаг',      ru: 'Шарф почёта', emoji: '🧣', note: 'Голубой или белый шарф, его дарят дорогим гостям.' },
    naadan:    { bu: 'Наадан',     ru: 'Игра',     emoji: '🎲' },
    duun:      { bu: 'Дуун',       ru: 'Песня',    emoji: '🎵' },
    // ── Super: Числа и время ──
    negen:     { bu: 'Нэгэн',      ru: 'Один',     emoji: '1️⃣' },
    hoyor:     { bu: 'Хоёр',       ru: 'Два',      emoji: '2️⃣' },
    gurban:    { bu: 'Гурбан',     ru: 'Три',      emoji: '3️⃣' },
    durben:    { bu: 'Дүрбэн',     ru: 'Четыре',   emoji: '4️⃣' },
    taban:     { bu: 'Табан',      ru: 'Пять',     emoji: '5️⃣' },
    udur:      { bu: 'Үдэр',       ru: 'День',     emoji: '☀️' },
    hara_m:    { bu: 'Һара',       ru: 'Месяц',    emoji: '🌙', note: 'Также «луна». Не путайте с «Хара» — чёрный.' },
    jel:       { bu: 'Жэл',        ru: 'Год',      emoji: '📅' }
  };

  const units = [
    {
      id: 'u1', title: 'Приветствие', subtitle: 'Амар мэндэ! Сайн байна! Баяртай!',
      color: '#58CC02', shade: '#46A302', premium: false, icon: '👋',
      lessons: [
        { id: 'u1l1', title: 'Первые слова', words: ['amar', 'sain', 'bayartai'], review: [],
          phrases: [
            { bu: ['Амар', 'мэндэ,', 'Сэсэг!'], ru: ['Здравствуй,', 'Сэсэг!'] },
            { bu: ['Баяртай,', 'Бато!'], ru: ['До', 'свидания,', 'Бато!'] }
          ] },
        { id: 'u1l2', title: 'Как дела?', words: ['sain_gut', 'hain', 'bayarlaa'], review: ['amar', 'sain', 'bayartai'],
          phrases: [
            { bu: ['Сайн', 'байна', 'гүт?'], ru: ['Как', 'поживаете?'] },
            { bu: ['Һайн,', 'баярлаа!'], ru: ['Хорошо,', 'спасибо!'] }
          ] },
        { id: 'u1l3', title: 'Знакомство', words: ['bi', 'shi', 'nere', 'tiime', 'ugy'], review: ['amar', 'bayarlaa'],
          phrases: [
            { bu: ['Минии', 'нэрэ', 'Бато.'], ru: ['Меня', 'зовут', 'Бато.'] },
            { bu: ['Тиимэ,', 'би', 'Сэсэг.'], ru: ['Да,', 'я', 'Сэсэг.'] }
          ] }
      ]
    },
    {
      id: 'u7', title: 'Цвета и формы', subtitle: 'Хөхэ, улаан, шара…',
      color: '#1CB0F6', shade: '#1899D6', premium: false, icon: '🎨',
      lessons: [
        { id: 'u7l1', title: 'Яркие цвета', words: ['hohe', 'ulaan', 'shara', 'nogoon'], review: [],
          phrases: [
            { bu: ['Хөхэ', 'тэнгэри'], ru: ['Синее', 'небо'] },
            { bu: ['Улаан,', 'шара,', 'ногоон'], ru: ['Красный,', 'жёлтый,', 'зелёный'] }
          ] },
        { id: 'u7l2', title: 'Белый, чёрный и формы', words: ['sagaan', 'hara', 'tontoloo', 'durbeljen'], review: ['hohe', 'ulaan'],
          phrases: [{ bu: ['Сагаан', 'һара'], ru: ['Белый', 'месяц'] }] }
      ]
    },
    {
      id: 'u3', title: 'Семья', subtitle: 'Эжы, аба, аха…',
      color: '#CE82FF', shade: '#A568CC', premium: false, icon: '👨‍👩‍👧',
      lessons: [
        { id: 'u3l1', title: 'Родители', words: ['ezhy', 'aba', 'aha', 'egeshe'], review: [],
          phrases: [
            { bu: ['Минии', 'эжы'], ru: ['Моя', 'мама'] },
            { bu: ['Минии', 'аба'], ru: ['Мой', 'папа'] }
          ] },
        { id: 'u3l2', title: 'Вся семья', words: ['duu', 'hugshen', 'ubgen', 'ger'], review: ['ezhy', 'aba'],
          phrases: [{ bu: ['Минии', 'гэр', 'бүлэ'], ru: ['Моя', 'семья'] }] }
      ]
    },
    {
      id: 'u4', title: 'Еда', subtitle: 'Сай, бууза, хилээмэн…',
      color: '#FF9600', shade: '#E08600', premium: false, icon: '🥟',
      lessons: [
        { id: 'u4l1', title: 'Напитки и хлеб', words: ['sai', 'sun', 'hileemen', 'uhan'], review: [],
          phrases: [{ bu: ['Би', 'сай', 'уунаб.'], ru: ['Я', 'пью', 'чай.'] }] },
        { id: 'u4l2', title: 'За столом', words: ['mahan', 'buuza', 'amtatai'], review: ['sai', 'hileemen'],
          phrases: [{ bu: ['Бууза', 'амтатай!'], ru: ['Буузы', 'вкусные!'] }] }
      ]
    },
    {
      id: 'u5', title: 'Природа и животные', subtitle: 'Далай, шоно, морин…',
      color: '#2BB673', shade: '#1F9A5C', premium: false, icon: '🐺',
      lessons: [
        { id: 'u5l1', title: 'Байкал и степь', words: ['dalai', 'uula', 'modon'], review: [],
          phrases: [{ bu: ['Байгал', 'далай'], ru: ['Озеро', 'Байкал'] }] },
        { id: 'u5l2', title: 'Дикие и домашние', words: ['shono', 'temeen', 'morin', 'nohoi'], review: ['dalai', 'uula'],
          phrases: [
            { bu: ['Минии', 'морин'], ru: ['Моя', 'лошадь'] },
            { bu: ['Һайн', 'нохой'], ru: ['Хорошая', 'собака'] }
          ] },
        { id: 'u5l3', title: 'На пастбище', words: ['uher', 'honin', 'naran'], review: ['morin', 'temeen', 'shono'],
          phrases: [{ bu: ['Минии', 'хонин'], ru: ['Моя', 'овца'] }] }
      ]
    },
    {
      id: 'u6', title: 'Одежда и быт', subtitle: 'Дэгэл, малгай, гутал…',
      color: '#FF4B4B', shade: '#D93A3A', premium: false, icon: '👘',
      lessons: [
        { id: 'u6l1', title: 'Национальный костюм', words: ['degel', 'malgai', 'gutal', 'buhe'], review: [],
          phrases: [
            { bu: ['Минии', 'дэгэл'], ru: ['Мой', 'дэгэл'] },
            { bu: ['Шэнэ', 'малгай'], ru: ['Новая', 'шапка'] }
          ] },
        { id: 'u6l2', title: 'Дома', words: ['hubsahan', 'geer', 'ayaga', 'shiree'], review: ['degel', 'malgai'],
          phrases: [{ bu: ['Минии', 'гэр'], ru: ['Мой', 'дом'] }] }
      ]
    },
    {
      id: 'u10', title: 'Тело человека', subtitle: 'Толгой, гар, хүл…',
      color: '#FF86A8', shade: '#E06A8C', premium: false, icon: '🧍',
      lessons: [
        { id: 'u10l1', title: 'Голова и лицо', words: ['b_tolgoi', 'b_nyuden', 'b_shehen', 'b_hamar'], review: [],
          phrases: [
            { bu: ['Минии', 'толгой'], ru: ['Моя', 'голова'] },
            { bu: ['Хоёр', 'нюдэн'], ru: ['Два', 'глаза'] }
          ] },
        { id: 'u10l2', title: 'Руки и ноги', words: ['b_gar', 'b_hul', 'b_ama', 'b_uhen'], review: ['b_tolgoi', 'b_nyuden'],
          phrases: [
            { bu: ['Хоёр', 'гар'], ru: ['Две', 'руки'] },
            { bu: ['Ута', 'үһэн'], ru: ['Длинные', 'волосы'] }
          ] }
      ]
    },
    {
      id: 'u11', title: 'Погода и времена года', subtitle: 'Үбэл, зун, саһан…',
      color: '#4DA8FF', shade: '#2F86D9', premium: false, icon: '🌦️',
      lessons: [
        { id: 'u11l1', title: 'Времена года', words: ['b_ubel', 'b_habar', 'b_zun', 'b_namar'], review: [],
          phrases: [
            { bu: ['Хүйтэн', 'үбэл'], ru: ['Холодная', 'зима'] },
            { bu: ['Халуун', 'зун'], ru: ['Жаркое', 'лето'] }
          ] },
        { id: 'u11l2', title: 'Что за окном', words: ['b_boroo', 'b_sahan', 'b_halhin', 'b_huiten', 'b_haluun'], review: ['b_ubel', 'b_zun'],
          phrases: [
            { bu: ['Саһан', 'орожо', 'байна'], ru: ['Идёт', 'снег'] },
            { bu: ['Бороо', 'орожо', 'байна'], ru: ['Идёт', 'дождь'] }
          ] }
      ]
    },
    {
      id: 'u12', title: 'Действия', subtitle: 'Ябаха, эдихэ, уншаха…',
      color: '#FFB020', shade: '#D99300', premium: false, icon: '🏃',
      lessons: [
        { id: 'u12l1', title: 'Каждый день', words: ['b_yabaha', 'b_edihe', 'b_uuha'], review: [],
          phrases: [
            { bu: ['Би', 'ябанаб'], ru: ['Я', 'иду'] },
            { bu: ['Би', 'сай', 'уунаб'], ru: ['Я', 'пью', 'чай'] }
          ] },
        { id: 'u12l2', title: 'Дома и на уроке', words: ['b_untaha', 'b_unshaha', 'b_beshehe'], review: ['b_yabaha', 'b_uuha'],
          phrases: [
            { bu: ['Бато', 'унтана'], ru: ['Бато', 'спит'] },
            { bu: ['Би', 'ном', 'уншанаб'], ru: ['Я', 'читаю', 'книгу'] }
          ] }
      ]
    },
    {
      id: 'u13', title: 'Школа', subtitle: 'Һургуули, багша, ном…',
      color: '#8D6BFF', shade: '#6E50DB', premium: false, icon: '📚',
      lessons: [
        { id: 'u13l1', title: 'В классе', words: ['b_hurguuli', 'b_bagsha', 'b_huragsha'], review: ['b_unshaha'],
          phrases: [
            { bu: ['Минии', 'багша'], ru: ['Мой', 'учитель'] },
            { bu: ['Би', 'һургуулида', 'ябанаб'], ru: ['Я', 'иду', 'в', 'школу'] }
          ] },
        { id: 'u13l2', title: 'Портфель', words: ['b_nom', 'b_debter'], review: ['b_hurguuli', 'b_bagsha', 'b_beshehe'],
          phrases: [
            { bu: ['Шэнэ', 'ном'], ru: ['Новая', 'книга'] },
            { bu: ['Минии', 'дэбтэр'], ru: ['Моя', 'тетрадь'] }
          ] }
      ]
    },
    {
      id: 'u8', title: 'Праздники и традиции', subtitle: 'Сагаалган, Сурхарбаан, ёохор…',
      color: '#7B3FD1', shade: '#5F2DAA', premium: true, superOnly: true, hard: true, icon: '🎊',
      lessons: [
        { id: 'u8l1', title: 'Белый месяц', words: ['sagaalgan', 'hadag', 'yokhor'], review: ['amar', 'bayarlaa'],
          phrases: [
            { bu: ['Сагаан', 'һараар!'], ru: ['С', 'Белым', 'месяцем!'] },
            { bu: ['Һайн', 'дуун!'], ru: ['Хорошая', 'песня!'] }
          ] },
        { id: 'u8l2', title: 'Сурхарбаан', words: ['surharban', 'naadan', 'duun'], review: ['sagaalgan', 'hadag', 'yokhor'],
          phrases: [
            { bu: ['Һайн', 'наадан!'], ru: ['Хорошая', 'игра!'] },
            { bu: ['Сагаан', 'һараар!'], ru: ['С', 'Белым', 'месяцем!'] }
          ] }
      ]
    },
    {
      id: 'u9', title: 'Числа и время', subtitle: 'Нэгэн, хоёр, гурбан… үдэр, жэл',
      color: '#0E8A7E', shade: '#0A6B62', premium: true, superOnly: true, hard: true, icon: '🔢',
      lessons: [
        { id: 'u9l1', title: 'Считаем до пяти', words: ['negen', 'hoyor', 'gurban', 'durben', 'taban'], review: [],
          phrases: [
            { bu: ['Нэгэн,', 'хоёр,', 'гурбан'], ru: ['Один,', 'два,', 'три'] },
            { bu: ['Табан', 'бууза'], ru: ['Пять', 'бууз'] }
          ] },
        { id: 'u9l2', title: 'День, месяц, год', words: ['udur', 'hara_m', 'jel'], review: ['negen', 'hoyor', 'gurban', 'taban'],
          phrases: [
            { bu: ['Нэгэн', 'үдэр'], ru: ['Один', 'день'] },
            { bu: ['Гурбан', 'жэл'], ru: ['Три', 'года'] }
          ] }
      ]
    },
    {
      id: 'u14', title: 'Байкал и вода', subtitle: 'Нуур, гол, арал…',
      color: '#0B7285', shade: '#085A69', premium: true, superOnly: true, hard: true, icon: '🌊',
      lessons: [
        { id: 'u14l1', title: 'Священное море', words: ['b_nuur', 'b_gol', 'b_aral'], review: ['dalai'],
          phrases: [
            { bu: ['Байгал', 'нуур'], ru: ['Озеро', 'Байкал'] },
            { bu: ['Ольхон', 'арал'], ru: ['Остров', 'Ольхон'] }
          ] },
        { id: 'u14l2', title: 'На берегу', words: ['b_zagahan', 'b_dolgin', 'b_erie'], review: ['b_nuur', 'b_gol'],
          phrases: [
            { bu: ['Томо', 'загаһан'], ru: ['Большая', 'рыба'] },
            { bu: ['Нуурай', 'эрье'], ru: ['Берег', 'озера'] }
          ] }
      ]
    },
    {
      id: 'u15', title: 'Чувства и характер', subtitle: 'Баясхалан, ухаатай…',
      color: '#C2255C', shade: '#9A1C49', premium: true, superOnly: true, hard: true, icon: '💖',
      lessons: [
        { id: 'u15l1', title: 'Настроение', words: ['b_bayaskhalan', 'b_gunig', 'b_duratai'], review: ['bayarlaa'],
          phrases: [
            { bu: ['Би', 'сайд', 'дуратай'], ru: ['Я', 'люблю', 'чай'] },
            { bu: ['Эхэ', 'баясхалан'], ru: ['Большая', 'радость'] }
          ] },
        { id: 'u15l2', title: 'Характер', words: ['b_uhaatai', 'b_zorigtoi', 'b_erhim'], review: ['b_duratai', 'b_gunig'],
          phrases: [
            { bu: ['Ухаатай', 'хүбүүн'], ru: ['Умный', 'мальчик'] },
            { bu: ['Зоригтой', 'Бато'], ru: ['Смелый', 'Бато'] }
          ] }
      ]
    },
    {
      id: 'u16', title: 'Путешествие', subtitle: 'Зам, хото, тосхон…',
      color: '#5F3DC4', shade: '#4A2FA0', premium: true, superOnly: true, hard: true, icon: '🧭',
      lessons: [
        { id: 'u16l1', title: 'Город и село', words: ['b_zam', 'b_hoto', 'b_toskhon'], review: ['b_yabaha'],
          phrases: [
            { bu: ['Хото', 'руу', 'ябанаб'], ru: ['Еду', 'в', 'город'] },
            { bu: ['Урта', 'зам'], ru: ['Длинная', 'дорога'] }
          ] },
        { id: 'u16l2', title: 'В дороге', words: ['b_buudal', 'b_tergen', 'b_guur'], review: ['b_zam', 'b_hoto'],
          phrases: [
            { bu: ['Шэнэ', 'гүүр'], ru: ['Новый', 'мост'] },
            { bu: ['Тэргэнай', 'буудал'], ru: ['Остановка', 'транспорта'] }
          ] }
      ]
    }
  ];

  /* Магазин. slot: hat | outfit | feet | hand | acc | bonus; cat — вкладка магазина (по умолчанию = slot) */
  const items = [
    { id: 'cap',          slot: 'hat',    name: 'Кепка',              price: 60,  color: '#1CB0F6' },
    { id: 'ushanka',      slot: 'hat',    name: 'Ушанка',             price: 150, color: '#6B4F3A' },
    { id: 'malgai_blue',  slot: 'hat',    name: 'Малгай синий',       price: 300, color: '#1D5FBF', desc: 'Традиционная бурятская шапка с красной кисточкой-залаа' },
    { id: 'malgai_gold',  slot: 'hat',    name: 'Праздничный малгай', price: 600, color: '#E8A900', desc: 'Для Сагаалгана и больших праздников' },

    { id: 'tshirt_green', slot: 'outfit', name: 'Самса и үмдэн', price: 0, color: '#E3A12F', dark: '#C4851A', pants: '#1F5C3A', socks: '#F2C14E', style: 'samsa', desc: 'Стартовый комплект: самса (рубашка), үмдэн (брюки) и оймһон (носки)' },
    { id: 'tshirt_blue',  slot: 'outfit', name: 'Синяя футболка',     price: 40,  color: '#1CB0F6', style: 'tshirt' },
    { id: 'hoodie',       slot: 'outfit', name: 'Худи',               price: 120, color: '#FF4B4B', style: 'hoodie' },
    { id: 'degel_blue',   slot: 'outfit', name: 'Дэгэл синий',        price: 400, color: '#1F5DB8', trim: '#FFD43B', belt: '#E8590C', style: 'degel', desc: 'Национальный бурятский халат' },
    { id: 'degel_red',    slot: 'outfit', name: 'Дэгэл бордовый',     price: 450, color: '#A61E4D', trim: '#FFD43B', belt: '#1F5DB8', style: 'degel', desc: 'Национальный бурятский халат' },
    { id: 'degel_gold',   slot: 'outfit', name: 'Праздничный дэгэл',  price: 800, color: '#F2B705', trim: '#1F5DB8', belt: '#C92A2A', style: 'degel', premiumOnly: true, desc: 'Эксклюзив BuryatGo Super' },

    { id: 'ball',         slot: 'hand',   name: 'Мяч',                price: 30 },
    { id: 'hadak',        slot: 'hand',   name: 'Хадаг',              price: 150, desc: 'Голубой шарф — символ уважения и чистоты' },
    { id: 'bow',          slot: 'hand',   name: 'Лук',                price: 220, desc: 'Стрельба из лука — часть праздника Сурхарбаан' },
    { id: 'khur',         slot: 'hand',   name: 'Хур',                price: 350, desc: 'Морин хуур — смычковый инструмент с головой коня' },

    { id: 'glasses',      slot: 'acc',    name: 'Очки',               price: 70 },
    { id: 'sunglasses',   slot: 'acc',    name: 'Тёмные очки',        price: 90 },
    { id: 'medal',        slot: 'acc',    name: 'Медаль',             price: 200 },

    { id: 'beanie',       slot: 'hat',    name: 'Вязаная шапка',     price: 80,  color: '#E8590C' },
    { id: 'fox_hat',      slot: 'hat',    name: 'Лисья шапка',       price: 380, color: '#D9480F', desc: 'Зимняя шапка с мехом — тёплая и нарядная' },
    { id: 'headband',     slot: 'hat',    name: 'Повязка с орнаментом', price: 70,  color: '#1F5DB8', desc: 'Лёгкая повязка с золотым узором' },
    { id: 'straw',        slot: 'hat',    name: 'Соломенная шляпа',  price: 120, color: '#E9C46A', desc: 'Для летнего сенокоса в степи' },
    { id: 'newyear',      slot: 'hat',    name: 'Новогодняя шапка',  price: 200, color: '#E03131', desc: 'С пушистым помпоном и звёздочкой' },
    { id: 'toortsog',     slot: 'hat',    name: 'Тоорцог',             price: 350, color: '#C92A2A', desc: 'Круглая степная шапка с лентами' },
    { id: 'hasarta',      slot: 'hat',    name: 'Хасарта малгай',     price: 450, color: '#1D5FBF', desc: 'Зимний малгай с меховыми наушниками' },
    { id: 'duulga',       slot: 'hat',    name: 'Шлем батора',        price: 750, color: '#ADB5BD', desc: 'Стальной дуулга с красным плюмажем' },
    { id: 'crown',        slot: 'hat',    name: 'Корона батора',      price: 900, color: '#F2B705', premiumOnly: true, desc: 'Эксклюзив BuryatGo Super' },
    { id: 'flag_rb',      slot: 'hand',   name: 'Флажок Бурятии',    price: 120, desc: 'Синий, белый, жёлтый и знак Соёмбо' },
    { id: 'tea',          slot: 'hand',   name: 'Пиала чая',          price: 50,  desc: 'Бурятский чай с молоком — сагаан сай' },
    { id: 'buuza_plate',  slot: 'hand',   name: 'Тарелка бууз',      price: 100, desc: 'Горячие буузы с пылу с жару' },
    { id: 'drum',         slot: 'hand',   name: 'Бубен хэнгэрэг',  price: 280, desc: 'Традиционный ударный инструмент' },
    { id: 'scarf',        slot: 'acc',    name: 'Шарф',               price: 60 },
    { id: 'headphones',   slot: 'acc',    name: 'Наушники',           price: 150, desc: 'Чтобы слушать бурятские песни' },
    { id: 'erikhe',       slot: 'acc',    name: 'Чётки эрихэ',       price: 180 },
    { id: 'soyombo_pin',  slot: 'acc',    name: 'Значок Соёмбо',     price: 250, desc: 'Золотой знак: огонь, солнце и луна' },
    { id: 'hantaaz_blue', slot: 'outfit', name: 'Хантааз синий', price: 260, color: '#1F5DB8', trim: '#F2B705', shirt: '#FBF4E6', pants: '#2B3A5C', socks: '#F2C14E', style: 'vest', desc: 'Традиционная безрукавка поверх рубашки' },
    { id: 'hantaaz_red',  slot: 'outfit', name: 'Хантааз бордовый', price: 290, color: '#9C1D45', trim: '#FFD43B', shirt: '#FBF4E6', pants: '#2B2F45', socks: '#F2C14E', style: 'vest', desc: 'Безрукавка с золотой каймой' },
    { id: 'hantaaz_fur',  slot: 'outfit', name: 'Меховой хантааз', price: 420, color: '#7A4A2B', trim: '#F3E6D2', shirt: '#E9F1FB', pants: '#34405E', socks: '#F2C14E', style: 'vest', fur: true, desc: 'Тёплая безрукавка с меховой отделкой' },
    { id: 'degel_olzy',   slot: 'outfit', name: 'Дэгэл «Өлзы»', price: 520, color: '#2F8F5B', trim: '#FFD43B', belt: '#C92A2A', style: 'degel', orn: 'olzy', desc: 'Зелёный дэгэл с узором счастья «өлзы»' },
    { id: 'degel_white',  slot: 'outfit', name: 'Сагаан дэгэл', price: 560, color: '#F4F1EA', trim: '#1F5DB8', belt: '#1F5DB8', style: 'degel', orn: 'meander', desc: 'Белый праздничный дэгэл с меандром «хас» — к Сагаалгану' },
    { id: 'degel_sky',    slot: 'outfit', name: 'Дэгэл «Хээ»', price: 540, color: '#3AA0E0', trim: '#FFFFFF', belt: '#F2B705', style: 'degel', orn: 'dots', desc: 'Небесный дэгэл с жемчужным орнаментом' },
    { id: 'buhe_red',     slot: 'belt', cat: 'outfit', name: 'Кушак красный', price: 120, color: '#C92A2A', desc: 'Шёлковый пояс-бүһэ' },
    { id: 'buhe_blue',    slot: 'belt', cat: 'outfit', name: 'Кушак синий', price: 120, color: '#1F5DB8', desc: 'Шёлковый пояс-бүһэ' },
    { id: 'buhe_silver',  slot: 'belt', cat: 'outfit', name: 'Пояс с бляхами', price: 380, color: '#2B2B33', studs: true, desc: 'Кожаный пояс с серебряными бляхами' },
    { id: 'sneakers',     slot: 'feet',   cat: 'outfit', name: 'Кроссовки',  price: 90,  color: '#FFFFFF' },
    { id: 'unty',         slot: 'feet',   cat: 'outfit', name: 'Унты',        price: 350, color: '#7A4A21', desc: 'Традиционные меховые сапоги с орнаментом' },
    { id: 'unty_fest',    slot: 'feet',   cat: 'outfit', name: 'Праздничные унты', price: 600, color: '#A61E4D', desc: 'Нарядные унты с золотым узором' },
    { id: 'freeze',       slot: 'bonus',  name: 'Заморозка серии',    price: 200, consumable: true, desc: 'Сохранит ударный режим, если пропустите один день' }
  ];

  const slots = [
    { id: 'hat', name: 'Шапки', icon: '🎩' },
    { id: 'outfit', name: 'Одежда', icon: '👘' },
    { id: 'hand', name: 'В руку', icon: '🏹' },
    { id: 'acc', name: 'Аксессуары', icon: '🕶️' },
    { id: 'bonus', name: 'Заморозки', icon: '🧊' }
  ];

  const leagues = [
    { name: 'Бронзовая',  color: '#CD7F32', light: '#F6E0C8' },
    { name: 'Серебряная', color: '#A8B2BD', light: '#EEF1F4' },
    { name: 'Золотая',    color: '#FFC800', light: '#FFF4C2' },
    { name: 'Сапфировая', color: '#1CB0F6', light: '#D7F1FD' },
    { name: 'Алмазная',   color: '#CE82FF', light: '#F3E3FF' }
  ];

  const botNames = ['Баир', 'Сэсэг', 'Аюна', 'Тумэн', 'Дарима', 'Жаргал', 'Солбон', 'Туяна', 'Оюна', 'Цырен',
    'Алдар', 'Эржена', 'Булат', 'Саяна', 'Арюна', 'Бэлигтэ', 'Норжима', 'Чингис', 'Аня', 'Максим', 'Даша', 'Олег'];

  const mascotPhrases = [
    { bu: 'Амар мэндэ!', ru: 'Здравствуйте!' },
    { bu: 'Сайн байна!', ru: 'Привет!' },
    { bu: 'Баярлаа!', ru: 'Спасибо!' },
    { bu: 'Һайн!', ru: 'Хорошо!' },
    { bu: 'Минии нэрэ Бато.', ru: 'Меня зовут Бато.' },
    { bu: 'Баяртай!', ru: 'До свидания!' }
  ];

  const achievements = [
    { id: 'first',   icon: '🌱', title: 'Первые шаги',  desc: 'Пройдите первый урок',     goal: 1,   metric: s => s.stats.lessons },
    { id: 'streak3', icon: '🔥', title: 'Огонёк',        desc: 'Серия 3 дня подряд',       goal: 3,   metric: s => s.bestStreak },
    { id: 'streak7', icon: '☄️', title: 'Неделя огня',   desc: 'Серия 7 дней подряд',      goal: 7,   metric: s => s.bestStreak },
    { id: 'words10', icon: '🧠', title: 'Знаток',        desc: 'Выучите 10 слов',          goal: 10,  metric: s => Object.keys(s.words).length },
    { id: 'perfect', icon: '🎯', title: 'Перфекционист', desc: '3 урока без ошибок',       goal: 3,   metric: s => s.stats.perfect },
    { id: 'fashion', icon: '👘', title: 'Модник',        desc: 'Купите 3 предмета',        goal: 3,   metric: s => s.owned.filter(i => i !== 'tshirt_green').length },
    { id: 'rich',    icon: '🪙', title: 'Богач',         desc: 'Заработайте 500 Бууз',   goal: 500, metric: s => s.buzzyEarned }
  ];

  /* Кони для подписчиков Super (первый — в подарок, остальные за Буузы) */
  const horses = [
    { id: 'horse_heer', name: 'Хээр', ru: 'рыжий конь', coat: '#B4622D', dark: '#8A4519', mane: '#3E1E0C', blaze: true,
      desc: 'Горячий рыжий конь с белой проточиной. Неутомим в долгих переходах по степи.' },
    { id: 'horse_khara', name: 'Хара', ru: 'вороной конь', coat: '#2E2C33', dark: '#1C1B20', mane: '#0B0B0E', sock: true,
      desc: 'Чёрный как ночь конь с белыми носками. Сильный и верный друг.' },
    { id: 'horse_sagaan', name: 'Сагаан', ru: 'белый конь', coat: '#F3F0EA', dark: '#D3CCBF', mane: '#B5AD9F',
      desc: 'Белый конь — символ чистоты и удачи у бурят. Украшение любого надома.' }
  ];

  const itemsById = {};
  items.forEach(i => { itemsById[i.id] = i; });
  const lessonIndex = [];
  units.forEach(u => u.lessons.forEach((l, li) => lessonIndex.push({ unit: u, lesson: l, li })));

  return {
    words, units, items, itemsById, slots, horses, horsePrice: 1500, luckyHorsePrice: 1000, luckyHorseUnit: 5, horseSell: 750, sheepPrice: 250, sheepSell: 125, sheepMax: 13, leagues, botNames, mascotPhrases, achievements, lessonIndex,
    prices: { month: 499, year: 5600 },
    premiumBonus: 500,
    /* Фонетическая запись для синтеза речи: на экране остаётся литературное написание,
       а голосовой движок получает текст, который звучит ближе к живому произношению. */
    pron: {
      'сайн байна': 'сэйн бэйнэ',
      'сайн': 'сэйн',
      'байна': 'бэйнэ',
      'баяртай': 'баяртэ'
    }
  };
})();
