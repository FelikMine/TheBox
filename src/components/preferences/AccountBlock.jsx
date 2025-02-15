import { useState, useEffect } from 'react';
import React from 'react';
import classes from "./Preferences.module.css";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import openEye from "../assets/openEye.svg";
import closeEye from "../assets/closeEye.svg";
import { postAccountsSettings , getSettings, getApprovingActions, getProducts} from "./Responses.jsx";

export default function Duplicator() {

    const [error, setError] = useState('');
    const [existingAccounts, setExistingAccounts] = useState(new Set());
    const [exchanges, setExchanges] = useState([{}]);
    const [blocks, setBlocks] = useState([{ }]);
    const [index, setIndex] = useState(0);

    const getExchanges = async (token) => {
        try {
            const response = await axios.get('http://localhost:7001/exchanges/', {
                headers: {
                    Authorization:  `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const exchangesInfo = response.data;

                const newExchanges = Object.values(exchangesInfo).map((exc) => ({
                    key: exc.id,
                    value: exc.name,
                }));

                // Обновляем состояние
                setExchanges((prevExchanges) => [...prevExchanges, ...newExchanges]);

                return newExchanges;

            } else if (response.status === 401) {
                console.error('Пользователь не аутентифицирован:', response.data);
                setError('Пользователь не аутентифицирован.');
            } else {
                const errorMessage = response.statusText || 'Произошла неизвестная ошибка';
                setError(errorMessage);
                console.error('Ошибка:', response.data);
            }
        }
        catch (error) {
            console.error('Ошибка обращения к биржам:', error);
            setError('Ошибка обращения к биржам.');
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {

                const exchangesList = await getExchanges(token);
                console.log('Биржи перед вызовом getAccounts:', exchangesList);
                await getAccounts(token, exchangesList);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        console.log('Текущие exchanges:', exchanges); // Логируем exchanges при его изменении
    }, [exchanges]);

    useEffect(() => {
        console.log("Обновленные блоки:", blocks);
    }, [blocks]);

    const getAccounts = async (token, exchangesList) => {
        try {
            const response = await axios.get('http://localhost:7001/user/settings/accounts/', {
                headers: {
                    Authorization:  `Bearer ${token}`
                }
            });

            if (response.status === 200) {

                const accountsInfo = response.data;
                const accountsSet = new Set();

                accountsInfo.forEach((account,index) => {
                    // setIndex((a) => a + 1)
                    setIndex(index+1)
                    console.log(index);

                    if(!accountsSet.has(account.id)) {
                        setBlocks(prevBlocks => [
                            ...prevBlocks,
                            {
                                id: account.id,
                                title: account.name,
                                name: account.exchange_login,
                                password: account.exchange_password,
                                apiKey: account.exchange_key,
                                exchange_id: exchangesList.find(function (item) {
                                    return item.key ===  account.exchange_id
                                })?.value || 'not found property for key',
                                exchange_list: exchangesList.map((item) => item.value),
                                index: index
                            }
                        ]);
                    }

                });
                setExistingAccounts(accountsSet); // Сохраняем существующие аккаунты
                console.log("Блоки текущие:", blocks);

            }
        } catch (error) {
            console.error('Ошибка обращения get:', error);
        }
    };

    const postAccounts = async (name, exchange_id, apiKey, password) => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            console.error('Токен отсутствует. Пожалуйста, войдите в систему.');
            return;
        }

        const id = uuidv4();

        const data = {
            id: id,
            name: name,
            exchange_id: "d35aa62b-8978-4c1d-a343-5a4fe9196100",
            exchange_login: name,
            exchange_key: apiKey,
            exchange_password: password,
        };

        console.log(data);


        try {
            const response = await axios.post('http://localhost:7001/user/settings/account/', new URLSearchParams(data), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.status === 200) {

                console.log("POST-запрос выполнен успешно. Аккаунт сохранен.");

            }
            else if(response.status == 401) {
                console.error('Пользователь не аутентифицирован:', response.data);
                setError('Пользователь не аутентифицирован.');
            } else if(response.status == 422) {
                console.error('Ошибка валидации:', response.data);
                setError('Ошибка валидации');
            }
        } catch (error) {
            // console.error('Ошибка обращения post:', error);
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


    const duplicateAccount = (newAccount) => {
        if (!existingAccounts.has(newAccount.id)) {
            setBlocks(prevBlocks => [
                ...prevBlocks,
                newAccount
            ]);
            setExistingAccounts(prev => new Set(prev).add(newAccount.id)); // Добавляем новый аккаунт в существующие
            return true;
        } else {
            console.log('Аккаунт с таким ID уже существует:', newAccount.id);
            return false;
        }
    };

    const [divCount, setDivCount] = useState(1);

    const duplicateDiv = () => {
        setDivCount(prevCount => prevCount + 1);
        setBlocks(prevBlocks => [
            ...prevBlocks,
            { id: prevBlocks.length + 1, title: '', name: '', password: '', apiKey: '', exchange_id: '', exchange_list: [], index: 0},
        ]);
    };

    const handleBlockChange = (id, field, value) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, [field]: value } : block
            )
        );
    };
    //exchange_list под вопросом
    const handleSave = (id, title, name, password, apiKey, exchange_id, exchange_list) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === id ? { ...block, title, name, password, apiKey, exchange_id, exchange_list, index } : block
        ));
        console.log(`Сохранено: ${id}`);
        //Предположительно такие входные данные
        postAccounts(name, exchange_id, apiKey, password)
    };

  return (
    <>
        {blocks.filter(block => block && Object.keys(block).length > 0).map((block) => {

        const exchangeListNotEmpty = (block.exchange_list && block.exchange_list.length > 0)
        ? block.exchange_list
        : (blocks[2]?.exchange_list || []);
        console.log(exchangeListNotEmpty);

        return (
            <CreateBlock2
            key={block.id}
            id={block.id}
            title={block.title}
            name={block.name}
            password={block.password}
            apiKey={block.apiKey}
            excName={block.exchange_id}
            excList={exchangeListNotEmpty}
            isExpanded={block.index == 0}
            onInputChange={handleBlockChange}
            onSave={handleSave}
            />
        )
        })}
        <div className={classes.addMarket}>
            <button onClick={duplicateDiv} />
        </div>
    </>
  )
}

function CreateBlock2({ id, title, name, password, apiKey, excName, excList, onInputChange, onSave, isExpanded}) {

    const [selectedValue, setSelectedValue] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(!isExpanded);

    const [localTitle, setLocalTitle] = useState(title);
    const [localName, setLocalName] = useState(name);
    const [localPassword, setLocalPassword] = useState(password);
    const [localApiKey, setLocalApiKey] = useState(apiKey);
    const [localExchange, setLocalExchange] = useState(excName);

    const [exchanges, setExchanges] = useState(excList);

    const [isEditing, setIsEditing] = useState(false); // Флаг для отслеживания редактирования
    const [showPassword, setShowPassword] = useState(false); // Для контроля видимости пароля
    const [showApiKey, setShowApiKey] = useState(false);

    const handleToggleShowPassword = () => {
        setShowPassword(!showPassword); // Переключаем состояние
    };
    const handleToggleShowApiKey = () => {
        setShowApiKey(!showPassword);
    };


    const closeBlock = () => {
        setIsCollapsed(true);
    }
        const handleSave = () => {
            onSave(id, localTitle, localName, localPassword, localApiKey); // Сохраняем изменения
            setIsEditing(false);
        };
    return (
        <>
        {isCollapsed ? (
            <div className={classes.collapsedBlock}>
                    <button onClick={() => setIsCollapsed(false)}></button>
                    <span>{title}</span>
                </div>
        ) : (
            <>
            <div className={classes.PreferencesPage__Content__Block2}>
                <div>
                    <span>Биржа:</span>

                    <div className={classes.select}>
                        <select value={selectedValue} onChange={(e) => setLocalExchange(e.target.value)}>
                            { exchanges && exchanges.length > 0 ? (
                                (localExchange == exchanges[0]) ? (
                                    <>
                                        <option value={localExchange || ''}>{localExchange || ''}</option>
                                        <option value={exchanges[1] || ''}> {exchanges[1] || ''}</option>
                                        <option value={exchanges[2] || ''}> {exchanges[2] || ''}</option>
                                        <option value={exchanges[3] || ''}> {exchanges[3] || ''}</option>
                                    </>
                                ) : localExchange == exchanges[1] ? (
                                    <>
                                        <option value={localExchange || ''}>{localExchange || ''}</option>
                                        <option value={exchanges[0] || ''}> {exchanges[0] || ''} </option>
                                        <option value={exchanges[2] || ''}> {exchanges[2] || ''}</option>
                                        <option value={exchanges[3] || ''}> {exchanges[3] || ''}</option>
                                    </>
                                ) : localExchange == exchanges[2] ? (
                                    <>
                                        <option value={localExchange || ''}>{localExchange || ''}</option>
                                        <option value={exchanges[0] || ''}> {exchanges[0] || ''} </option>
                                        <option value={exchanges[1] || ''}> {exchanges[1] || ''}</option>
                                        <option value={exchanges[3] || ''}> {exchanges[3] || ''}</option>
                                    </>
                                ) : localExchange == exchanges[3] ? (
                                    <>
                                        <option value={localExchange || ''}>{localExchange || ''}</option>
                                        <option value={exchanges[0] || ''}> {exchanges[0] || ''} </option>
                                        <option value={exchanges[1] || ''}> {exchanges[1] || ''}</option>
                                        <option value={exchanges[3] || ''}> {exchanges[3] || ''}</option>
                                    </>
                                ) : (
                                    <>
                                        <option value={exchanges[0] || ''}> {exchanges[0] || ''} </option>
                                        <option value={exchanges[1] || ''}> {exchanges[1] || ''}</option>
                                        <option value={exchanges[2] || ''}> {exchanges[2] || ''} </option>
                                        <option value={exchanges[3] || ''}> {exchanges[3] || ''}</option>
                                    </>
                                )
                            ) : (
                                <option value="none2">none2</option> // Если exchanges не определен или пуст
                            )
                            }
                        </select>
                    </div>
                </div>

                <div>
                    <span>Название:</span>
                    <input
                        type="text"
                        value={localTitle || ''}
                        placeholder="Название"
                        onChange={(e) => setLocalTitle(e.target.value)}
                        />
                </div>

                <div>
                    <span>Логин:</span>
                    <input
                        type="text"
                        value={localName || ''}
                        placeholder="Имя"
                        onChange={(e) => setLocalName(e.target.value)}
                        />
                </div>

                <div>
                    <span>Пароль:</span>
                    <div id={classes.HidePassword}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={localPassword || ''}
                            placeholder="Пароль"
                            onChange={(e) => setLocalPassword(e.target.value)}
                        />
                        <button onClick={handleToggleShowPassword}>
                            <img
                                src={showPassword ? openEye : closeEye}
                                alt={showPassword ? 'Hide Password' : 'Show Password'}
                            />
                        </button>
                    </div>
                </div>

                <div>
                    <span>API key:</span>
                    <div id={classes.HidePassword}>

                        <input
                            id = {classes.apiKey}
                            type={showApiKey ? 'text' : 'password'}
                            value={localApiKey || ''}
                            placeholder="API key"
                            onChange={(e) => setLocalApiKey(e.target.value)}
                        />
                        <button onClick={handleToggleShowApiKey}>
                            <img
                                src={showApiKey ? openEye : closeEye}
                                alt={showApiKey ? 'Hide ApiKey' : 'Show ApiKey'}
                            />
                        </button>
                    </div>
                </div>

                </div>

                <div id={classes.SaveClose}>
                    <button onClick={handleSave}></button>
                    <button onClick={() => setIsCollapsed(true)}></button>
                </div>

        </>
    )}
    </>
    )
}
