// --- Элементы страницы ---
const soupsEl = document.getElementById('soups');     // Получаем ссылки на элементы DOM
const mealEl = document.getElementById('meals');
const drinksEl = document.getElementById('drinks');
const orderEl = document.getElementById('order');
const totalEl = document.getElementById('total');
const priceEl = document.getElementById('price');
const submitBtn = document.getElementById('submit');
const soupKey = document.getElementById('soup-keyword');
const mealKey = document.getElementById('meal-keyword');
const drinkKey = document.getElementById('drink-keyword');

let selected = { soup: null, meal:null, drink: null };  // Переменная для выбранных блюд

dishes.sort((a, b) => a.name.localeCompare(b.name));    // Сортировка блюд по алфавиту

// Функция создание карточки блюда
function createCard(dish) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.dish = dish.keyword;

// Использование шаблонных строк
  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}"> 
    <h3>${dish.name}</h3>
    <p>${dish.count}</p>
    <p>${dish.price} ₽</p>
    <button>Добавить</button>
  `;

  // Клик по кнопке - выбор блюда
  card.querySelector('button').addEventListener('click', () => selectDish(dish));
  return card;
}

// Функция отображение всех карточек
function renderMenu() {
  dishes.forEach(dish => {          // Проходит по всем блюдам
    const card = createCard(dish);  // Добавляет блюда в категории
    if (dish.category === 'soup') soupsEl.append(card);
    if (dish.category === 'meal') mealEl.append(card);
    if (dish.category === 'drink') drinksEl.append(card);
  });
}

// Обработка выбора блюда
function selectDish(dish) {
  document.querySelectorAll(`[data-dish]`).forEach(el => el.classList.remove('selected'));
  selected[dish.category] = dish;
  document.querySelector(`[data-dish="${dish.keyword}"]`).classList.add('selected');
  updateOrder();
}

// Обновление раздела "Ваш заказ"
function updateOrder() {
  const soup = selected.soup ? `${selected.soup.name} — ${selected.soup.price} ₽` : null;
  const meal =selected.meal ? `${selected.meal.name} — ${selected.meal.price} ₽` : null;
  const drink = selected.drink ? `${selected.drink.name} — ${selected.drink.price} ₽` : null;

// Обработка "невыбранных блюд"
  if (!soup && !meal && !drink) {
    orderEl.textContent = 'Ничего не выбрано';
    totalEl.style.display = 'none';
    submitBtn.disabled = true;
    soupKey.value = mealKey.value = drinkKey.value = '';
    return;
  }

  // "Сборка" элементов заказа
  orderEl.innerHTML = `
    <div>Суп: ${soup || 'Блюдо не выбрано'}</div>
    <div>Основное блюдо: ${meal || 'Блюдо не выбрано'}</div>
    <div>Напиток: ${drink || 'Напиток не выбран'}</div>
  `;

  const total = (selected.soup?.price || 0) + (selected.meal?.price || 0) + (selected.drink?.price || 0);
  priceEl.textContent = total;
  totalEl.style.display = 'block';
  submitBtn.disabled = false;

  soupKey.value = selected.soup ? selected.soup.keyword : '';
  mealKey.value = selected.meal ? selected.meal.keyword : '';
  drinkKey.value = selected.drink ? selected.drink.keyword : '';
}

// --- Заполнение формы ---
document.getElementById('order-form').addEventListener('submit', e => {
  e.preventDefault();   // Предотвращает стандартную отправку формы

  // Собираем заказ через ключ-значение
  const orderData = {
    name: e.target.username.value,
    
    phone: e.target.phone.value,
    soup: selected.soup?.keyword,      // Вроде как это Nullish Coalescing
    meal: selected.meal?.keyword,      // т.е. вместо undefined или ошибки
    drink: selected.drink?.keyword,   // будет подставлена null
    total: (selected.soup?.price || 0) + (selected.meal?.price || 0) + (selected.drink?.price || 0),
  };

  console.log("Отправлен заказ:", orderData);   // Заказ будет отправлен в логи
  alert('Заказ успешно оформлен!');
});

renderMenu();