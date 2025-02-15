// import axios from 'axios';

// const apiUrl = 'YOUR_API_ENDPOINT'; // Замените на ваш API endpoint

// const authFetch = async (url: string, method: string = 'GET', data?: any, token?: string) => {
//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }), // Добавляем токен в заголовок, если он есть
//     };

//     const response = await axios({
//       url: `${apiUrl}${url}`,
//       method,
//       data,
//       headers,
//     });
//     return response.data;
//   } catch (error: any) {
//     if (error.response && error.response.status === 401) {
//       // Обработка ошибки 401 (Unauthorized) - токен устарел или недействителен
//       // Здесь нужно выполнить логику обновления токена или перенаправления на страницу входа
//       localStorage.removeItem('token'); // Удаляем недействительный токен
//       window.location.href = '/login'; // Перенаправляем на страницу входа
//       return null;
//     }
//     throw error; // Перебрасываем другие ошибки
//   }
// };

// export default authFetch;

import { getToken } from "./tokenProvider";

const authFetch = async (
    input: RequestInfo,
    init: RequestInit | undefined = {},
    token?: string
  ): Promise<Response> => {
    const access_token = token || getToken()?.value || 'no_token';

    if (access_token === 'no_token') {
      // eslint-disable-next-line no-console
      console.warn('Making secure API call without an auth token');
    }

    const options = { ...init };

    options.headers = {
      ...init.headers,
      Authorization: `Bearer ${access_token}`,
    };

    return fetch(input, options);
  };

  export default authFetch;