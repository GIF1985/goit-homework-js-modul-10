import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';

const DEBOUNCE_DEL = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

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
}, DEBOUNCE_DEL);

function clearCountryList() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function renderCountryList(countries) {
  clearCountryList();

  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length === 1) {
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
  } else if (countries.length > 1) {
    const html = countries
      .map(
        country =>
          `<div class="country-item">
              <img src="${country.flags.svg}" alt="${country.name.official} flag">
              <h3>${country.name.common}</h3>
          </div>`
      )
      .join('');
    countryInfo.innerHTML = html;
  } else {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

searchBox.addEventListener('input', e => {
  debouncedFetchCountries(e.target.value.trim());
});

countryList.addEventListener('click', e => {
  const btn = e.target.closest('.btn-more-info');
  if (btn) {
    const countryCode = btn.dataset.code;
    fetchCountries(countryCode)
      .then(countries => {
        const country = countries[0];
        const html = `
          <li><h2>${country.name.common}</h2></li>
          <li>Population: ${country.population}</li>
          <li>Capital: ${country.capital}</li>
          <li>Languages: ${Object.values(country.languages).join(', ')}</li>
          <li><img src="${country.flags.svg}" alt="${
          country.name.common
        } flag"></li>  
        `;
        countryInfo.innerHTML = html;
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
});
