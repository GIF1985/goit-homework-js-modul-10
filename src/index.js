// Импорт стилей для страницы
import './css/styles.css';

// Импорт библиотеки Notiflix для вывода уведомлений
import Notiflix from 'notiflix';

// Импорт компонента Notify из библиотеки Notiflix для вывода уведомлений
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Импорт функции fetchCountries из отдельного модуля
import { fetchCountries } from './js/fetchCountries.js';

// Импорт функции debounce из библиотеки Lodash для уменьшения частоты отправки запросов на сервер
import debounce from 'lodash.debounce';

// Задержка перед отправкой запроса на сервер
const delayedHttpRequest = 300;

// Поиск элементов страницы по их идентификатору или классу
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Функция-обертка для функции fetchCountries с использованием debounce
const debouncedFetchCountries = debounce(name => {
  if (name.length > 0) {
    fetchCountries(name)
      .then(countries => {
        renderCountryList(countries);
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    clearCountryList();
  }
}, delayedHttpRequest);

// Функция для очистки списка стран и информации о стране
function clearCountryList() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  clearCountryList(); // очищает список стран

  if (countries.length > 10) {
    // если количество стран больше 10
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.' // выводится уведомление с просьбой указать более конкретное название
    );
  } else if (countries.length === 1) {
    // если количество стран равно 1
    const country = countries[0]; // сохраняется первый элемент массива в переменную country
    const html = `
      <li><h2>${country.name.official}</h2></li>
      <li>Population: ${country.population}</li>
      <li>Capital: ${country.capital}</li>
      <li>Languages: ${Object.values(country.languages).join(', ')}</li>
      <li><img src="${country.flags.svg}" alt="${
      country.name.official
    } flag"></li>  
    `; // создается html-разметка с информацией о стране
    countryList.innerHTML = html; // в список стран добавляется html-разметка
  } else if (countries.length > 1) {
    // если количество стран больше 1
    const html = countries
      .map(
        country =>
          `<div class="country-item">
              <img src="${country.flags.svg}" alt="${country.name.official} flag">
              <h3>${country.name.common}</h3>
          </div>`
      )
      .join(''); // создается html-разметка со списком стран и их флагами
    countryInfo.innerHTML = html; // в блок с информацией о странах добавляется html-разметка
  } else {
    // если количество стран равно 0
    Notiflix.Notify.failure('Oops, there is no country with that name'); // выводится уведомление о том, что страны с таким названием не найдено
  }
}

searchBox.addEventListener('input', e => {
  // при вводе в поле поиска запускается функция debouncedFetchCountries с передачей ей значения поля без пробелов с обеих сторон
  debouncedFetchCountries(e.target.value.trim());
});

// Добавляем обработчик события click на элемент countryList
countryList.addEventListener('click', e => {
  // Находим ближайший родительский элемент с классом 'btn-more-info'
  const btn = e.target.closest('.btn-more-info');
  // Если такой элемент найден
  if (btn) {
    // Получаем значение атрибута data-code у кнопки
    const countryCode = btn.dataset.code;
    // Вызываем функцию fetchCountries с countryCode в качестве аргумента
    fetchCountries(countryCode)
      .then(countries => {
        // Получаем первый объект страны из возвращенного массива
        const country = countries[0];
        // Создаем HTML-строку с информацией о стране
        const html = `
         <li><h2>${country.name.common}</h2></li>
          <li>Population: ${country.population}</li>
          <li>Capital: ${country.capital}</li>
          <li>Languages: ${Object.values(country.languages).join(', ')}</li>
          <li><img src="${country.flags.svg}" alt="${
          country.name.common
        } flag"></li>  
        `;
        // Устанавливаем внутреннее содержимое элемента countryInfo равным HTML-строке
        countryInfo.innerHTML = html;
      })
      // Если произошла ошибка, показываем уведомление об ошибке
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
});
