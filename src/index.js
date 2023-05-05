// импортируем файл стилей для страницы.
import './css/styles.css';

// импортируем библиотеку notiflix для отображения уведомлений.
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// импортируем функцию debounce из пакета lodash.debounce.
import debounce from 'lodash.debounce';

// константа для задержки вызова колбэка debounce.
const DEBOUNCE_DELAY = 300;

// функция для получения списка стран по имени.
export function fetchCountries(name) {
  // формируем URL для запроса на сервер.
  const BASE_URL = `https://restcountries.com/v3.1/name/${name}`;

  // отправляем GET-запрос на сервер и обрабатываем ответ.
  return fetch(BASE_URL)
    .then(response => {
      // если ответ не успешный, выбрасываем ошибку.
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // если ответ успешный, преобразуем данные в формат JSON и возвращаем их.
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      // если произошла ошибка при выполнении запроса, выводим сообщение об ошибке.
      console.error('There was a problem with the fetch operation:', error);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

// получаем элементы страницы.
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let timeoutId;

// функция для задержки вызова колбэка.
function debounce(callback, delay) {
  // возвращаем новую функцию, которая будет задерживать вызов переданной функции callback на время delay.
  return function () {
    // очищаем таймер, чтобы избежать вызова функции callback, если пользователь продолжает вводить текст.
    clearTimeout(timeoutId);
    // задаем новый таймер, который вызовет функцию callback через delay миллисекунд.
    timeoutId = setTimeout(() => {
      // вызываем функцию callback с переданными аргументами и сохраняем контекст выполнения.
      callback.apply(this, arguments);
    }, delay);
  };
}

// функция для рендеринга списка стран.
function renderCountryList(countries) {
  // очищаем список стран на странице.
  countryList.innerHTML = '';

  // если найдено более 10 стран, выводим сообщение о том, что нужно уточнить запрос.
  if (countries.length > 10) {
    // выводим сообщение при помощи Notiflix.
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  // если найдена одна страна, выводим информацию о ней на странице.
  else if (countries.length === 1) {
    const country = countries[0];
    const html = `
  <li><h2>${country.name.official}</h2></li>
  <li>Population: ${country.population}</li>
  <li>Capital: ${country.capital}</li>
  <li>Languages: ${Object.values(country.languages).join(', ')}</li>
  <li><img src="${country.flags.svg}" alt="${
      country.name.official
    } flag"></li>  
`;
    countryList.innerHTML = html;
  }

  // если найдено несколько стран, выводим список их названий на странице.
  else if (countries.length > 1) {
    const html = countries
      .map(country => `<li>${country.name.official}</li>`)
      .join('');
    countryList.innerHTML = html;
  }
}

// добавляем обработчик события input на поле ввода.
searchBox.addEventListener(
  'input',
  debounce(event => {
    // получаем значение поля ввода и убираем лишние пробелы в начале и конце строки.
    const name = event.target.value.trim();

    // если поле ввода не пустое, отправляем запрос на сервер и рендерим список стран на странице.
    if (name.length > 0) {
      fetchCountries(name)
        .then(countries => {
          renderCountryList(countries);
        })
        .catch(error => {
          console.error(error);
        });
    }
    // если поле ввода пустое, очищаем список стран и информацию о стране на странице.
    else {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    }
  }, DEBOUNCE_DELAY)
);
