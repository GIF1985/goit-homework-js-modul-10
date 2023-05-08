export function fetchCountries(name) {
  // формируем URL для запроса на сервер.
  const BASE_URL = `https://restcountries.com/v3.1/name/${name}`;

  // отправляем GET-запрос на сервер и обрабатываем ответ.
  return fetch(BASE_URL)
    .then(response => {
      // если ответ не успешный, выбрасываем ошибку.
      if (!response.ok) {
        throw new Error('');
      }
      // если ответ успешный, преобразуем данные в формат JSON и возвращаем их.
      return response.json();
    })
    .then(data => {
      // если данных нет, возвращаем пустой массив.
      return data || [];
    })
    .catch(error => {
      // если произошла ошибка при выполнении запроса и ошибка имеет код 404,
      // выводим сообщение об отсутствии страны с таким именем.
      if (error instanceof TypeError) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      // возвращаем пустой массив, чтобы избежать ошибки в следующей функции.
      return [];
    });
}
