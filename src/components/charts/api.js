import axios from 'axios';

export const getTransfers = async (id, pairs) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error('Токен отсутствует. Пожалуйста, войдите в систему.');
        return;
    }

    const data = {
        account_id: id,
        from_datetime: "2025-01-22",
        to_datetime: "2025-01-23",
        coins: pairs,
        transfer_types: "in, out",
    };
    console.log(data);

    try {
        const response = await axios.get('http://localhost:7001/user/account/transfers/', {
            params: data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const transfersInfo = response.data;
            console.log('Данные по переводам: ', transfersInfo);
            return transfersInfo;
        } else if (response.status === 422) {
            console.error('Ошибка валидации:', response.data);
            throw new Error('Ошибка валидации');
        }
    } catch (error) {
        console.error('Ошибка обращения:', error);
        throw error;
    }
};

export const getBalance = async (id, pairs) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error('Токен отсутствует. Пожалуйста, войдите в систему.');
        return;
    }

    const data = {
        account_id: id,
        coins: pairs,
    };

    try {
        const response = await axios.get('http://localhost:7001/user/account/balance/', {
            params: data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const balanceInfo = response.data;
            console.log('Данные баланса: ', balanceInfo);

            return Object.values(balanceInfo);
        } else if (response.status === 401) {
            console.error('Пользователь не аутентифицирован:', response.data);
            throw new Error('Пользователь не аутентифицирован.');
        } else if (response.status === 422) {
            console.error('Ошибка валидации:', response.data);
            throw new Error('Ошибка валидации');
        }
    } catch (error) {
        console.error('Ошибка обращения:', error);
        throw error;
    }
};

export const getOrders = async (id, pairs) => {
    const token = localStorage.getItem("accessToken");

    const data = {
        account_id: id,
        pairs: pairs,
    };

    console.log('Дата для ордеров ', data);

    try {
        const response = await axios.get('http://localhost:7001/user/account/orders/', {
            params: data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const ordersInfo = response.data;
            console.log('Данные ордеров: ', ordersInfo);
            return ordersInfo;
        } else if (response.status === 401) {
            console.error('Пользователь не аутентифицирован:', response.data);
            throw new Error('Пользователь не аутентифицирован.');
        } else if (response.status === 422) {
            console.error('Ошибка валидации:', response.data);
            throw new Error('Ошибка валидации');
        }
    } catch (error) {
        console.error('Ошибка обращения:', error);
        throw error;
    }
};

export const getDeals = async (id, pairs) => {
    const token = localStorage.getItem("accessToken");

    const data = {
        account_id: id,
        pairs: pairs,
    };

    console.log('Дата для сделок ', data);

    try {
        const response = await axios.get('http://localhost:7001/user/account/deals/', {
            params: data,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const dealsInfo = response.data;
            console.log('Данные сделок: ', dealsInfo);
            return dealsInfo;
        } else if (response.status === 401) {
            console.error('Пользователь не аутентифицирован:', response.data);
            throw new Error('Пользователь не аутентифицирован.');
        } else if (response.status === 422) {
            console.error('Ошибка валидации:', response.data);
            throw new Error('Ошибка валидации');
        }
    } catch (error) {
        console.error('Ошибка обращения:', error);
        throw error;
    }
};

export const getPairs = async (token) => {
    try {
        const response = await axios.get('http://localhost:7001/user/pairs/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const pairsInfo = response.data;
            console.log('Данные пар: ', pairsInfo);
            return pairsInfo;
        }
    } catch (error) {
        console.error('Ошибка обращения:', error);
        throw error;
    }
};

export const getExchanges = async (token) => {
    try {
        const response = await axios.get('http://localhost:7001/exchanges/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const exchangesInfo = response.data;
            return exchangesInfo;
        } else if (response.status === 401) {
            console.error('Пользователь не аутентифицирован:', response.data);
            throw new Error('Пользователь не аутентифицирован.');
        } else {
            const errorMessage = response.statusText || 'Произошла неизвестная ошибка';
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Ошибка обращения к биржам:', error);
        throw error;
    }
};

export const getAccounts = async (token, setBlocks, setExistingAccounts) => {
    try {
        const response = await axios.get('http://localhost:7001/user/settings/accounts/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const accountsInfo = response.data;
            const accountsSet = new Set();

            accountsInfo.forEach(account => {
                if (!accountsSet.has(account.id)) {
                    setBlocks(prevBlocks => [
                        ...prevBlocks,
                        {
                            id: account.id,
                            name: account.exchange_login,
                        },
                    ]);
                }
            });

            setExistingAccounts(accountsSet); // Сохраняем существующие аккаунты
            console.log("Блоки текущие:", accountsInfo);
        }
    } catch (error) {
        console.error('Ошибка обращения get:', error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};