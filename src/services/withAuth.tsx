import React, { useState, useEffect } from 'react';
import { getToken, setToken, removeToken, isExpired } from './tokenProvider';

type Props = {
  children: React.ReactNode;
};

const WithAuth = (props: Props) => {
  const { children } = props;
  const [isTokenFetchingActive, setTokenFetchingStatus] =
    useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        removeToken();

        // const access_token = await api.get.token();

        // setToken(access_token);
        setIsAuthenticated(true);
        setTokenFetchingStatus(false);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Unknown Error: api.get.token';

        // реализуем утилитарное предупреждение для пользователя
        // eslint-disable-next-line no-alert
        alert(
          `Неудалось загрузить токен доступа. Сейчас вы будете перенаправлены на страницу авторизации. Details: ${msg}`
        );

        window.location.assign(
          `/test/?from=${window.location.pathname}`
        );
      }
    };

    if (isTokenFetchingActive) {
      const token = getToken();

      if (token && !isExpired(token.timeStamp)) {
        setIsAuthenticated(true);
        setTokenFetchingStatus(false);
      } else {
        fetchToken();
      }
    }
  }, [isTokenFetchingActive]);

  const renderContent = () => {
    return isAuthenticated ? children : null;
  };

  return <div>{isTokenFetchingActive ? <p> Пожалуйста, подождите, идет загрузка</p> : renderContent()}</div>;
};

export default WithAuth;
// Применение WithAuth
// <WithAuth>
//   <SomePage />
// </WithAuth>