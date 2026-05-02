/* ================================================================
   main.js — логика сайта СтавШнур
   Структура файла:
   1. Данные товаров (PRODUCTS)
   2. Корзина (добавление, удаление, отображение, localStorage)
   3. Поиск по каталогу
   4. Открытие/закрытие корзины
   5. Быстрый просмотр товара (модальное окно)
   6. Фильтры каталога
   7. Навигация (прокрутка, бургер-меню)
   8. Анимации при прокрутке (IntersectionObserver)
   9. Галерея (автопрокрутка)
   10. Форма обратной связи
   11. Инициализация (запуск всего)
================================================================ */


/* ----------------------------------------------------------------
   1. ДАННЫЕ ТОВАРОВ
   Все товары хранятся в одном массиве объектов.
   Каждый товар имеет: id, название, категорию, цену, фото и т.д.
---------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: 1,
    name: 'Шнур гамаковый Мокко, 5 мм',
    cat: 'cord',
    price: 5.5,
    unit: 'руб/м',
    img: 'image/6N4A8869.jpg',
    img2: 'image/6N4A8869.jpg',
    desc: 'Полиэфирный шнур со статическим сердечником. Диаметр 5 мм. Идеален для плетения гамаков и подвесных кресел.',
    badge: null,
    stock: true
  },
  {
    id: 2,
    name: 'Шнур гамаковый Шоколад, 5 мм',
    cat: 'cord',
    price: 5.5,
    unit: 'руб/м',
    img: 'image/photo_2025-08-17_19-37-20 (2).jpg',
    img2: 'image/photo_2025-08-17_19-37-20 (2).jpg',
    desc: 'Насыщенный шоколадный оттенок. Полиэфирный шнур со статическим сердечником 5 мм.',
    badge: null,
    stock: true
  },
  {
    id: 3,
    name: 'Шнур гамаковый Золотой, 5 мм',
    cat: 'cord',
    price: 5.5,
    unit: 'руб/м',
    img: 'image/photo_2025-08-11_20-30-05.jpg',
    img2: 'image/photo_2025-08-11_20-30-05.jpg',
    desc: 'Яркий золотистый оттенок. Полиэфирный шнур со статическим сердечником 5 мм.',
    badge: 'sale',
    stock: true
  },
  {
    id: 4,
    name: 'Шнур гамаковый Белый, 5 мм',
    cat: 'cord',
    price: 5.5,
    unit: 'руб/м',
    img: 'image/photo_2025-08-17_19-37-06 (2).jpg',
    img2: 'image/photo_2025-08-17_19-37-06 (2).jpg',
    desc: 'Классический белый. Подходит для светлых интерьеров и скандинавского стиля.',
    badge: 'new',
    stock: true
  },
  {
    id: 5,
    name: 'Шнур гамаковый Терракота, 5 мм',
    cat: 'cord',
    price: 5.5,
    unit: 'руб/м',
    img: 'image/photo_2025-08-17_19-36-43.jpg',
    img2: 'image/photo_2025-08-17_19-36-43.jpg',
    desc: 'Насыщенный терракотовый цвет. Создаёт тёплую атмосферу в любом интерьере.',
    badge: 'new',
    stock: true
  },
  {
    id: 6,
    name: 'Шнур полиэфирный без сердечника Серый, 5 мм',
    cat: 'cord',
    price: 4.0,
    unit: 'руб/м',
    img: 'image/photo_2025-08-05_16-35-44.jpg',
    img2: 'image/photo_2025-08-05_16-35-44.jpg',
    desc: 'Мягкий серый шнур без сердечника. Подходит для декоративных изделий и макраме.',
    badge: null,
    stock: true
  },
  {
    id: 7,
    name: 'Шнур полиэфирный без сердечника Небесно-голубой, 5 мм',
    cat: 'cord',
    price: 4.0,
    unit: 'руб/м',
    img: 'image/photo_2025-08-11_20-30-09.jpg',
    img2: 'image/photo_2025-08-11_20-30-18.jpg',
    desc: 'Нежный небесно-голубой шнур без сердечника. Отлично подходит для ярких изделий макраме.',
    badge: null,
    stock: true
  },
  {
    id: 8,
    name: 'Шнур полиэфирный без сердечника Бордовый, 5 мм',
    cat: 'cord',
    price: 4.0,
    unit: 'руб/м',
    img: 'image/photo_2025-08-17_19-36-49.jpg',
    img2: 'image/photo_2025-08-17_19-36-49.jpg',
    desc: 'Глубокий бордовый шнур без сердечника. Для стильных изделий.',
    badge: null,
    stock: true
  },
  {
    id: 9,
    name: 'Ножницы профессиональные 19 см',
    cat: 'tools',
    price: 500,
    unit: 'руб',
    img: 'image/6N4A8948.jpg',
    img2: 'image/6N4A8949.jpg',
    desc: 'Суперострые ножницы для резки шнуров, кожи и плотных тканей. Длина лезвия 19 см.',
    badge: 'sale',
    stock: true,
    priceOld: 750
  },
];


/* ----------------------------------------------------------------
   2. КОРЗИНА
   Данные хранятся в localStorage — не пропадают при перезагрузке.
   cart — массив объектов { id, qty, name, price, img, unit }
---------------------------------------------------------------- */

// Загружаем корзину из localStorage или начинаем с пустого массива
let cart = JSON.parse(localStorage.getItem('mkm_cart') || '[]');

// Добавить товар в корзину
function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product || !product.stock) return;  // нет такого товара или нет в наличии

  const existing = cart.find(item => item.id === id);
  if (existing) {
    // Товар уже в корзине — увеличиваем количество
    existing.qty++;
  } else {
    // Добавляем новый товар
    cart.push({
      id: id,
      qty: 1,
      name: product.name,
      price: product.price,
      img: product.img,
      unit: product.unit
    });
  }

  saveCart();
  renderCart();
  showToast('«' + product.name + '» добавлен в корзину');
}

// Удалить товар из корзины
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

// Изменить количество товара (d = +1 или -1)
function changeQty(id, d) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + d);  // минимум 1 штука
  saveCart();
  renderCart();
}

// Сохранить корзину в localStorage
function saveCart() {
  localStorage.setItem('mkm_cart', JSON.stringify(cart));
}

// Отрисовать корзину (обновить HTML и счётчик)
function renderCart() {
  // Считаем итого и общее количество
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  // Обновляем итоговую сумму
  document.getElementById('cartTotal').textContent = formatPrice(total) + ' ₽';

  // Обновляем счётчик на иконке корзины
  const dot = document.getElementById('cartDot');
  dot.textContent = count;
  dot.classList.toggle('show', count > 0);

  // Обновляем список товаров в корзине
  const body = document.getElementById('cartBody');

  if (cart.length === 0) {
    // Корзина пуста
    body.innerHTML =
      '<div class="cart-empty-msg">' +
        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.2">' +
          '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<path d="M16 10a4 4 0 01-8 0"/>' +
        '</svg>' +
        '<p>Ваша корзина пуста</p>' +
      '</div>';
  } else {
    // Выводим каждый товар
    body.innerHTML = cart.map(function(item) {
      return (
        '<div class="c-item">' +
          '<img class="c-item-img" src="' + item.img + '" alt="' + item.name + '">' +
          '<div class="c-item-info">' +
            '<div class="c-item-name">' + item.name + '</div>' +
            '<div class="c-item-price">' + formatPrice(item.price) + ' ₽ / ' + item.unit + '</div>' +
            '<div class="c-item-qty">' +
              '<button class="q-btn" onclick="changeQty(' + item.id + ', -1)">−</button>' +
              '<span class="q-val">' + item.qty + '</span>' +
              '<button class="q-btn" onclick="changeQty(' + item.id + ', 1)">+</button>' +
            '</div>' +
          '</div>' +
          '<button class="c-item-del" onclick="removeFromCart(' + item.id + ')" title="Удалить">✕</button>' +
        '</div>'
      );
    }).join('');
  }
}

// Оформление заказа
function handleOrder() {
  if (cart.length === 0) {
    showToast('Корзина пуста!');
    return;
  }
  showToast('Заказ оформлен! Мы свяжемся с вами.');
  cart = [];
  saveCart();
  renderCart();
  closeCart();
}

// Форматирование цены: 5.5 → "5,50"
function formatPrice(n) {
  return n.toFixed(2).replace('.', ',');
}


/* ----------------------------------------------------------------
   3. ПОИСК ПО КАТАЛОГУ
   Ищем в названии и описании товара при каждом нажатии клавиши.
---------------------------------------------------------------- */
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase().trim();
  const resultsEl = document.getElementById('srch-results');

  // Поле пустое — очищаем результаты
  if (!query) {
    resultsEl.innerHTML = '';
    return;
  }

  // Ищем совпадения
  const found = PRODUCTS.filter(function(p) {
    return p.name.toLowerCase().includes(query) ||
           p.desc.toLowerCase().includes(query);
  });

  if (found.length === 0) {
    resultsEl.innerHTML = '<div class="srch-empty">Ничего не найдено по запросу «' + query + '»</div>';
    return;
  }

  // Выводим найденные товары карточками
  resultsEl.innerHTML = found.map(function(p) {
    return (
      '<div class="srch-card" onclick="goToProduct(' + p.id + ')">' +
        '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
        '<div class="srch-card-body">' +
          '<div class="srch-card-name">' + p.name + '</div>' +
          '<div class="srch-card-price">' + formatPrice(p.price) + ' ₽ / ' + p.unit + '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
});

// При клике на результат — закрываем поиск и прокручиваем к карточке
function goToProduct(id) {
  closeSearch();
  setTimeout(function() {
    const card = document.querySelector('[data-id="' + id + '"]');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 350);
}

function openSearch() {
  document.getElementById('search-ov').classList.add('open');
  setTimeout(function() { searchInput.focus(); }, 80);
}

function closeSearch() {
  document.getElementById('search-ov').classList.remove('open');
  searchInput.value = '';
  document.getElementById('srch-results').innerHTML = '';
}

// Кнопка поиска в навигации
document.getElementById('searchBtn').addEventListener('click', openSearch);
// Кнопка закрытия поиска
document.getElementById('searchClose').addEventListener('click', closeSearch);
// Клик вне окна поиска — закрывает его
document.getElementById('search-ov').addEventListener('click', function(e) {
  if (e.target === this) closeSearch();
});
// Клавиша Escape закрывает всё открытое
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeSearch();
    closeCart();
    closeQV();
  }
});


/* ----------------------------------------------------------------
   4. ОТКРЫТИЕ / ЗАКРЫТИЕ КОРЗИНЫ
---------------------------------------------------------------- */
function openCart() {
  document.getElementById('cart').classList.add('open');
  document.getElementById('cart-veil').classList.add('open');
}

function closeCart() {
  document.getElementById('cart').classList.remove('open');
  document.getElementById('cart-veil').classList.remove('open');
}

document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cart-veil').addEventListener('click', closeCart);


/* ----------------------------------------------------------------
   5. БЫСТРЫЙ ПРОСМОТР ТОВАРА (модальное окно)
   Открывается при нажатии на иконку глаза на карточке.
---------------------------------------------------------------- */
function openQV(id) {
  const p = PRODUCTS.find(function(x) { return x.id === id; });
  if (!p) return;

  const badgeHtml = p.badge === 'new'
    ? '<span class="p-badge badge-new" style="position:static;display:inline-block;margin-bottom:14px">НОВИНКА</span>'
    : p.badge === 'sale'
    ? '<span class="p-badge badge-sale" style="position:static;display:inline-block;margin-bottom:14px">СКИДКА</span>'
    : '';

  const oldPriceHtml = p.priceOld
    ? '<span style="font-size:1.1rem;color:var(--c-muted);text-decoration:line-through;margin-left:8px">' + p.priceOld + ' ₽</span>'
    : '';

  document.getElementById('qvBox').innerHTML =
    '<img class="qv-img" src="' + p.img + '" alt="' + p.name + '">' +
    '<div class="qv-info">' +
      badgeHtml +
      '<div class="qv-name">' + p.name + '</div>' +
      '<div class="qv-desc">' + p.desc + '</div>' +
      '<div class="qv-price">' +
        formatPrice(p.price) + ' ₽' +
        '<span style="font-size:1rem;color:var(--c-muted);font-family:var(--f-body);font-weight:300"> / ' + p.unit + '</span>' +
        oldPriceHtml +
      '</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
        '<button class="btn-gold" onclick="addToCart(' + p.id + ');closeQV()"' +
          (!p.stock ? ' disabled style="opacity:.5"' : '') + '>' +
          (p.stock ? '🛒 В корзину' : 'Нет в наличии') +
        '</button>' +
      '</div>' +
      '<div class="qv-specs">' +
        '✅ Материал: 100% полиэфир<br>' +
        '✅ Диаметр: 5 мм<br>' +
        '✅ Устойчив к влаге и UV-излучению<br>' +
        '✅ Гипоаллергенен' +
      '</div>' +
    '</div>' +
    '<button class="qv-close" onclick="closeQV()" aria-label="Закрыть">✕</button>';

  document.getElementById('qv').classList.add('open');
  document.body.style.overflow = 'hidden';  // блокируем прокрутку под модальным окном
}

function closeQV() {
  document.getElementById('qv').classList.remove('open');
  document.body.style.overflow = '';  // возвращаем прокрутку
}

// Клик на фон за модальным окном — закрывает его
document.getElementById('qvBg').addEventListener('click', closeQV);


/* ----------------------------------------------------------------
   6. ФИЛЬТРЫ КАТАЛОГА
   При клике на кнопку фильтра — перерисовываем товары.
---------------------------------------------------------------- */
document.querySelectorAll('.f-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.f-btn').forEach(function(b) {
      b.classList.remove('active');
    });
    // Добавляем активный класс нажатой кнопке
    this.classList.add('active');
    // Перерисовываем товары с новым фильтром
    renderProducts(this.dataset.filter);
  });
});

// Отрисовка сетки товаров
function renderProducts(filter) {
  // Фильтруем массив или берём все товары
  const list = (filter === 'all') ? PRODUCTS : PRODUCTS.filter(function(p) {
    return p.cat === filter;
  });

  const grid = document.getElementById('prodGrid');

  grid.innerHTML = list.map(function(p) {
    // Определяем текст и цвет бейджа
    let badgeHtml = '';
    if (!p.stock) {
      badgeHtml = '<span class="p-badge badge-out">Нет в наличии</span>';
    } else if (p.badge === 'new') {
      badgeHtml = '<span class="p-badge badge-new">NEW</span>';
    } else if (p.badge === 'sale') {
      badgeHtml = '<span class="p-badge badge-sale">СКИДКА</span>';
    }

    const oldPrice = p.priceOld
      ? '<span class="p-price-old">' + p.priceOld + ' ₽</span>'
      : '';

    const noHoverClass = (p.img === p.img2) ? 'no-hover' : '';
    return (
      '<div class="p-card anim" data-id="' + p.id + '">' +
        '<div class="p-img-wrap ' + noHoverClass + '">' +
          badgeHtml +
          '<img class="p-img-main"  src="' + p.img  + '" alt="' + p.name + '" loading="lazy">' +
          '<img class="p-img-hover" src="' + p.img2 + '" alt="' + p.name + '" loading="lazy">' +
          '<div class="p-actions">' +
            '<button class="btn-cart" onclick="addToCart(' + p.id + ')"' + (!p.stock ? ' disabled' : '') + '>' +
              (p.stock ? '🛒 В корзину' : 'Нет в наличии') +
            '</button>' +
            '<button class="btn-eye" onclick="openQV(' + p.id + ')" title="Быстрый просмотр">👁</button>' +
          '</div>' +
        '</div>' +
        '<div class="p-body">' +
          '<div class="p-name">' + p.name + '</div>' +
          '<div class="p-desc">' + p.desc + '</div>' +
          '<div class="p-price-row">' +
            '<span class="p-price">' + formatPrice(p.price) + ' ₽</span>' +
            oldPrice +
            '<span class="p-unit">/ ' + p.unit + '</span>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  // Запускаем анимации для новых карточек
  observeAnim();
}


/* ----------------------------------------------------------------
   7. НАВИГАЦИЯ
---------------------------------------------------------------- */

// При прокрутке — добавляем фон к шапке
window.addEventListener('scroll', function() {
  document.getElementById('nav').classList.toggle('solid', window.scrollY > 50);
}, { passive: true });

// Бургер-меню (кнопка три полоски на мобильных)
document.getElementById('burgerBtn').addEventListener('click', function() {
  this.classList.toggle('open');
  document.getElementById('mob-menu').classList.toggle('open');
});

// При клике на ссылку в мобильном меню — закрываем меню
document.querySelectorAll('.mob-link').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('mob-menu').classList.remove('open');
    document.getElementById('burgerBtn').classList.remove('open');
  });
});


/* ----------------------------------------------------------------
   8. АНИМАЦИИ ПРИ ПРОКРУТКЕ
   IntersectionObserver следит: когда элемент появился в зоне
   видимости — добавляет класс .on, который включает CSS-анимацию.
---------------------------------------------------------------- */
function observeAnim() {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
      }
    });
  }, { threshold: 0.12 });

  // Подписываем все элементы с классом .anim, которые ещё не анимированы
  document.querySelectorAll('.anim:not(.on)').forEach(function(el) {
    observer.observe(el);
  });
}


/* ----------------------------------------------------------------
   9. ГАЛЕРЕЯ (автопрокрутка)
   Дублируем изображения — тогда при окончании прокрутки она
   бесшовно продолжается с начала (CSS animation marquee).
---------------------------------------------------------------- */
function buildGallery() {
  var images = [
    'image/6N4A8869.jpg',
    'image/6N4A8948.jpg',
    'image/6N4A8949.jpg',
    'image/6N4A8952.jpg',
    'image/6N4A9030.jpg',
    'image/6N4A9032.jpg',
    'image/6N4A9038.jpg',
    'image/6N4A9039.jpg',
    'image/6N4A9041.jpg',
    'image/6N4A9043.jpg',
    'image/6N4A9061.jpg',
    'image/photo_2025-08-05_16-35-44.jpg',
    'image/photo_2025-08-05_16-35-51.jpg',
    'image/photo_2025-08-11_20-29-57.jpg',
    'image/photo_2025-08-17_19-36-43.jpg',
    'image/photo_2025-08-17_19-37-26.jpg',
  ];

  // Дублируем для бесшовной прокрутки
  var allImages = images.concat(images);

  document.getElementById('galleryStrip').innerHTML = allImages.map(function(src) {
    return '<div class="g-item"><img src="' + src + '" alt="Галерея" loading="lazy"></div>';
  }).join('');
}


/* ----------------------------------------------------------------
   10. ФОРМА ОБРАТНОЙ СВЯЗИ
   Проверяем, что все поля заполнены. Имитируем отправку.
---------------------------------------------------------------- */
function submitForm(btn) {
  var form = btn.closest('.cform');
  var inputs = form.querySelectorAll('input, textarea');
  var allFilled = true;

  // Проверяем каждое поле
  inputs.forEach(function(input) {
    if (!input.value.trim()) {
      input.style.borderColor = '#e53e3e';  // красная рамка у пустого поля
      allFilled = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!allFilled) {
    showToast('Пожалуйста, заполните все поля');
    return;
  }

  // Имитируем отправку
  btn.textContent = 'Отправляем…';
  btn.disabled = true;

  setTimeout(function() {
    inputs.forEach(function(inp) { inp.value = ''; });
    btn.textContent = 'Отправить сообщение';
    btn.disabled = false;
    showToast('✅ Сообщение отправлено! Свяжемся с вами скоро.');
  }, 1200);
}


/* ----------------------------------------------------------------
   11. ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ (TOAST)
   Появляется снизу на 3 секунды.
---------------------------------------------------------------- */
var toastTimer;

function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}


/* ----------------------------------------------------------------
   12. ИНИЦИАЛИЗАЦИЯ
   Запускается при загрузке страницы.
---------------------------------------------------------------- */

// Анимация главного фото при загрузке
window.addEventListener('load', function() {
  document.getElementById('hero').classList.add('go');
});

// Запускаем все функции
renderProducts('all');   // показываем каталог
buildGallery();          // строим галерею
renderCart();            // отображаем корзину (из localStorage)
observeAnim();           // запускаем наблюдение за анимациями
