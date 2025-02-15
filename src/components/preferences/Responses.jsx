import axios from 'axios';

export const postAccountsSettings = async (data, token) => {

    console.log("Сохраняемые настройки: ", data);

    try {
        const response = await axios.post('http://localhost:7001/user/settings/', new URLSearchParams(data), {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.status === 200) {

            console.log("POST-запрос выполнен успешно. Настройки аккаунта сохранены.");

        }
        else if(response.status == 422) {
            console.error('Ошибка валидации:', response.data);
        }
    } catch (error) {
        if (error.response) {
            // Запрос был сделан, и сервер ответил кодом состояния, который выходит за пределы диапазона 2xx
            console.error('Ошибка ответа:', error.response.data);
            console.error('Статус:', error.response.status);
        } else if (error.request) {
            // Запрос был сделан, но ответа не было
            console.error('Ошибка запроса:', error.request);
        } else {
            // Произошла ошибка при настройке запроса
            console.error('Ошибка:', error.message);
        }
    }
};


 export const getSettings = async (token) => {
    try {
        const response = await axios.get('http://localhost:7001/user/settings/', {
            headers: {
                Authorization:  `Bearer ${token}`
            }
        });

        if (response.status === 200) {

            const settingsInfo = response.data;
            console.log('Настройки при переключении в блоке ', settingsInfo);
            return settingsInfo;
        }
    }
    catch (error) {
        console.error('Ошибка обращения к настройкам:', error);
    }
}
export const getApprovingActions = async (token) => {
    try {
        const response = await axios.get('http://localhost:7001/user/approving_actions/', {
            headers: {
                Authorization:  `Bearer ${token}`
            }
        });

        if (response.status === 200) {

            const approvingActionsData = response.data;

            console.log(approvingActionsData);

            return approvingActionsData;
        }
    }
    catch (error) {
        console.error('Ошибка обращения к настройкам:', error);
    }
}

export const getProducts = async (token) => {
    try {
        const response = await axios.get('http://localhost:7001/user/settings/products/', {
            headers: {
                Authorization:  `Bearer ${token}`
            }
        });

        if (response.status === 200) {

            const productsInfo = response.data;

            const newProducts = Object.values(productsInfo).map((product) => ({
                id: product.id,
                product_name: product.product_name,
                expire_date: product.expire_date,
            }));

            // console.log(productsInfo, "Ответ от сервера");

            // setProducts((prevProducts) => [...prevProducts, ...newProducts]);

        }
    }
    catch (error) {
        console.error('Ошибка обращения к продуктам:', error);

    }
}