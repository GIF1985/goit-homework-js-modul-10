import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js';
import debounce from 'lodash.debounce';

const debouncedRequest = 300;
const searchBoxEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

const debouncedFetchCountries = debounce(name => {
  if (name.length > 0) {
    fetchCountries(name)
      .then(countries => {
        renderCountryListEl(countries);
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    clearCountryListEl();
  }
}, debouncedRequest);

function clearCountryListEl() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function renderCountryListEl(countries) {
  clearCountryListEl();

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
    countryListEl.innerHTML = html;
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
    countryInfoEl.innerHTML = html;
  } else {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

searchBoxEl.addEventListener('input', e => {
  debouncedFetchCountries(e.target.value.trim());
});
