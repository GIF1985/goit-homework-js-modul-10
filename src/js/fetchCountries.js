export function fetchCountries(name) {
  const BASE_URL = `https://restcountries.com/v3.1/name/${name}`;
  return fetch(BASE_URL).then(response => {
    if (!response.ok) {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    }
    return response.json();
  });
}
