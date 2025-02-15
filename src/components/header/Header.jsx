import React from "react";
import logo from '../assets/Vector.svg'
import reg from '../assets/Register.svg'
import burger from '../assets/Burger.svg'
import close from '../assets/Close.svg'
import classes from "./Header.module.css"
import { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Modal from 'react-modal';
import AutorizeHeader from "./AutorizeHeader";
import { Link } from 'react-router-dom';
import PassRecover from "./PassRecover";
import PolicyModalWindow from "../footer/PolicyModalWindow";
export let isAutorize = false;


export default function Header() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');

    const [error, setError] = useState('');
    const [mailError, setMailError] = useState('');

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [registerIsOpen, setRegisterIsOpen] = useState(false);
    const [loginIsOpen, setLoginIsOpen] = useState(false);
    const [isOpenPolicyWindow, setIsOpenPolicyWindow] = useState(false);
    const [isOpenPassRecover, setIsOpenPassRecover] = useState(false);

    const openModal = () => { setModalIsOpen(true); };
    const closeModal = () => { setModalIsOpen(false); };

    const openRegister = () => { setRegisterIsOpen(true); };
    const closeRegister = () => { setRegisterIsOpen(false); };

    const openLogin = () => { setLoginIsOpen(true); };
    const closeLogin = () => { setLoginIsOpen(false); };

    const [authenticated, setauthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated")|| false));
    const [userId, setUserId] = useState(localStorage.getItem(localStorage.getItem("userId") || null));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const hasReloaded = useRef(false);

    function OpenPassRecover() {
        setIsOpenPassRecover(!isOpenPassRecover);
        closeLogin();
    }

    function OpenPolicyWindow () {
        setIsOpenPolicyWindow(!isOpenPolicyWindow);
        closeRegister();
        console.log("Откр");
    }

    useEffect(() => {
        const checkAuthentication = () => {
            const storedAuth = localStorage.getItem("authenticated");
            if (storedAuth !== null) {
                setIsAuthenticated(storedAuth === "true");
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuthentication(); // Вызываем функцию сразу для проверки

        const handleStorageChange = () => {
            checkAuthentication();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            validateToken(token); // Проверка токена при монтировании компонента
        }
    }, []);

    const handleInvalidToken = () => {
        setIsAuthenticated(false);
        setError('Токен не валиден.');
        localStorage.setItem("authenticated", false); // Устанавливаем false
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
    };

    //проверка при изменении размера окна
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            const loginForm = new FormData();
            loginForm.append("username", username);
            loginForm.append("password", password);

            const response = await axios.post('http://localhost:7001/token', loginForm,  {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.status === 200) {
                const tokenData = response.data;
                const tokenType = tokenData.token_type;
                const accessToken = tokenData.access_token;

                localStorage.setItem('tokenType', tokenType);
                localStorage.setItem('accessToken', accessToken);

                if (!hasReloaded.current) {
                    window.location.reload();
                    hasReloaded.current = true;
                }

                await validateToken(accessToken);

            } else if (response.status === 422) {
                // Обработка ошибок валидации
                const errorMessages = response.data.detail.map(error => error.msg).join(', ');
                setError(errorMessages);
            } else {
                // Обработка других ошибок
                const errorMessage = response.statusText || 'Произошла неизвестная ошибка';
                setError(errorMessage);
                console.error('Ошибка авторизации:', response.data);
            }
        } catch (error) {
            // Обработка сетевых ошибок
            console.error('Ошибка:', error);
            setError('Произошла сетевая ошибка. Проверьте подключение к интернету.');
        }
    };

    // get-запрос на валидацию токена
    const validateToken = async (token) => {
        try {
            const response = await axios.get('http://localhost:7001/validate_token', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {

                setauthenticated(true)
                localStorage.setItem("authenticated", true);
                setIsAuthenticated(true);

            } else {
                localStorage.setItem("authenticated", false);
                setIsAuthenticated(false);
                handleInvalidToken(); // При недействительном токене
            }
        } catch (error) {
            console.error('Ошибка валидации токена:', error);
            localStorage.setItem("authenticated", false);
            setIsAuthenticated(false);
            handleInvalidToken();
        }
    };

    const validatePassword = (password) => {

        let error = '';

        if (password.length <= 6) {
            error = '*Пароль должен содержать более 6 символов.';
        }
        else if (/(\w)\1{1,}/.test(password)) {
            error = '*Пароль не должен содержать повторяющихся знаков подряд.';
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            error = '*Пароль должен содержать хотя бы один специальный символ.';
        }
        else if (/\s/.test(password)) {
            error = '*Пароль не должен содержать пробелов.';
        }

        return error;
    };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Паттерн для проверки почты
        return emailPattern.test(email) ? '' : '*Введите корректный адрес электронной почты.';
    };

    return (
        <>
          {isAuthenticated ? (
             <AutorizeHeader> </AutorizeHeader>
          ) : (
            <>
                <PassRecover openModalWindow={isOpenPassRecover} onClose={() => { setIsOpenPassRecover(false) }}
                openReg={() => {
                    setRegisterIsOpen(true);
                    setIsOpenPassRecover(false);
                }}
                openLog={() => {
                    setLoginIsOpen(true);
                    setIsOpenPassRecover(false);
                }}/>

                <PolicyModalWindow openModalWindow={isOpenPolicyWindow} onClose={() => {
                    setIsOpenPolicyWindow(false)
                    openRegister();
                }}/>

                {isDesktop ? (
                    <header className={classes.siteHeader}>
                        <Modal
                            isOpen={loginIsOpen}
                            onRequestClose={closeLogin}
                            appElement={document.getElementById('root')}
                            className={classes.loginContent}
                            overlayClassName={classes.loginOverlay}
                            portalClassName={classes.loginWindow}>

                            <div className='headerDesktop__menu'>
                            <form id="loginForm" onSubmit={handleSubmit}>
                                    <ul>
                                        <li>
                                            <p> Вход в аккаунт </p>
                                        </li>
                                        <li>
                                        <input
                                            type="login"
                                            id="username"
                                            name="username"
                                            placeholder="Логин"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            placeholder="Пароль"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                            <input type="submit" value="Войти" className={classes.submitForm}></input>
                                        </li>
                                        <li>
                                            <Link onClick={OpenPassRecover}> Забыли пароль? </Link>
                                        </li>
                                        <li>
                                            <span>Нет аккаунта?</span> <button type="button" onClick={() => {
                                                closeLogin();
                                                openRegister();
                                            }}> Зарегистрироваться </button>
                                        </li>
                                    </ul>
                                    <button className={classes.headerMobile__close} onClick={closeLogin}> <img src={close} alt="close" />
                                    </button>
                                </form>
                                <button className={classes.headerMobile__close} onClick={closeLogin}> <img src={close} alt="close" />
                                </button>
                             </div>
                        </Modal>

                        <Modal
                            isOpen={registerIsOpen}
                            onRequestClose={closeRegister}
                            appElement={document.getElementById('root')}
                            className={classes.registerContent}
                            overlayClassName={classes.registerOverlay}
                            portalClassName={classes.registerWindow}>

                            <div className='headerDesktop__menu'>
                            <form id="loginForm" onSubmit={handleSubmit}>
                                    <ul>
                                        <li>
                                            <p> Зарегистрироваться </p>
                                        </li>
                                        <li>
                                        <input
                                            type="login"
                                            id="username"
                                            name="username"
                                            placeholder="Имя"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                        <input
                                            type="phone"
                                            id="userphone"
                                            name="userphone"
                                            placeholder="Телефон"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                        <input
                                            type="mail"
                                            id="usermail"
                                            name="usermail"
                                            placeholder="Почта"
                                            value={mail}
                                            onChange={(e) => setMail(e.target.value)}
                                            required
                                        />
                                        {mailError && <p id={classes.error}>{mailError}</p>}
                                        </li>
                                        <li>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            placeholder="Пароль"
                                            onChange={(e) => {
                                                const newPassword = e.target.value;
                                                setPassword(newPassword);
                                                validatePassword(newPassword);
                                            }}
                                            required
                                        />
                                        {error && <p id={classes.error}>{error}</p>}
                                        </li>
                                        <li>
                                            <input type="submit" value="Создать аккаунт"
                                            onClick={(e) => {

                                                e.preventDefault();
                                                const validationError = validatePassword(password);
                                                const emailError = validateEmail(mail);

                                                if (validationError) {
                                                    setError(validationError);
                                                }
                                                else {
                                                    setError('');
                                                }
                                                if (emailError) {
                                                    setMailError(emailError);
                                                } else {
                                                    setMailError('');
                                                }
                                            }}
                                            className={classes.createForm}></input>
                                            <p onClick={OpenPolicyWindow} className={classes.Policy}> *Нажимая на кнопку Вы соглашаетесь на обработку персональных данных </p>
                                        </li>
                                        <li>
                                            <span>Уже есть аккаунт?</span> <button type="button" onClick={() => {
                                                closeRegister();
                                                openLogin();
                                            }}> Войти </button>
                                        </li>
                                    </ul>
                                    <button className={classes.headerMobile__close} onClick={closeRegister}> <img src={close} alt="close" />
                                    </button>
                                </form>
                                <button className={classes.headerMobile__close} onClick={closeRegister}> <img src={close} alt="close" />
                                </button>
                             </div>
                        </Modal>

                    <div>
                        <Link to="/main" className={classes.brand}><img src={logo} alt="brand" />  </Link>
                        <span><Link to="/main">TradeSysDev</Link></span>
                    </div>
                    <div className={classes.hug}>
                        <Link to="/" className={classes.main}> Главная </Link>
                        <Link to="/instruments" className={classes.main}> Инструменты </Link>
                        <Link to="/contacts" className={classes.main}> Контакты </Link>
                    </div>
                    <div>
                        <button onClick={openLogin} className={classes.home}><img src={reg} alt="home" /></button>
                    </div>
                </header>
                ) : (
                    <header className={classes.headerMobile}>

                        <button className={classes.headerMobile__burger} onClick={openModal} > <img src={burger} alt="burger" />
                        </button>

                        <div>
                            <Link to="/main" className={classes.brand}><img src={logo} alt="brand" />  </Link>
                            <span><Link to="/main">TradeSysDev</Link></span>
                        </div>
                        <div>
                        <button onClick={openLogin} className={classes.home}><img src={reg} alt="home" /></button>
                        </div>

                        <Modal
                            isOpen={loginIsOpen}
                            onRequestClose={closeLogin}
                            appElement={document.getElementById('root')}
                            className={classes.loginContent}
                            overlayClassName={classes.loginOverlay}
                            portalClassName={classes.loginWindow}>

                            <div className='headerDesktop__menu'>
                            <form id="loginForm" onSubmit={handleSubmit}>
                                    <ul>
                                        <li>
                                            <p> Вход в аккаунт </p>
                                        </li>
                                        <li>
                                        <input
                                            type="login"
                                            id="username"
                                            name="username"
                                            placeholder="Логин"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            placeholder="Пароль"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                            <input type="submit" value="Войти" className={classes.submitForm}></input>
                                        </li>
                                        <li>
                                            <Link onClick={OpenPassRecover}> Забыли пароль? </Link>
                                        </li>
                                        <li>
                                            <span>Нет аккаунта?</span> <button type="button" onClick={() => {
                                                closeLogin();
                                                openRegister();
                                            }}> Зарегистрироваться </button>
                                        </li>
                                    </ul>
                                    <button className={classes.headerMobile__close} onClick={closeLogin}> <img src={close} alt="close" />
                                    </button>
                                </form>
                                <button className={classes.headerMobile__close} onClick={closeLogin}> <img src={close} alt="close" />
                                </button>
                             </div>
                        </Modal>

                        <Modal
                            isOpen={registerIsOpen}
                            onRequestClose={closeRegister}
                            appElement={document.getElementById('root')}
                            className={classes.registerContent}
                            overlayClassName={classes.registerOverlay}
                            portalClassName={classes.registerWindow}>

                            <div className='headerDesktop__menu'>
                            <form id="loginForm" onSubmit={handleSubmit}>
                                    <ul>
                                        <li>
                                            <p> Зарегистрироваться </p>
                                        </li>
                                        <li>
                                        <input
                                            type="login"
                                            id="username"
                                            name="username"
                                            placeholder="Имя"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                        <input
                                            type="phone"
                                            id="userphone"
                                            name="userphone"
                                            placeholder="Телефон"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                        </li>
                                        <li>
                                        <input
                                            type="mail"
                                            id="usermail"
                                            name="usermail"
                                            placeholder="Почта"
                                            value={mail}
                                            onChange={(e) => setMail(e.target.value)}
                                            required
                                        />
                                        {mailError && <p id={classes.error}>{mailError}</p>}
                                        </li>
                                        <li>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            placeholder="Пароль"
                                            onChange={(e) => {
                                                const newPassword = e.target.value;
                                                setPassword(newPassword);
                                                validatePassword(newPassword);
                                            }}
                                            required
                                        />
                                        {error && <p id={classes.error}>{error}</p>}
                                        </li>
                                        <li>
                                        <input type="submit" value="Создать аккаунт"
                                            onClick={(e) => {

                                                e.preventDefault();
                                                const validationError = validatePassword(password);
                                                const emailError = validateEmail(mail);

                                                if (validationError) {
                                                    setError(validationError);
                                                }
                                                else {
                                                    setError('');
                                                }
                                                if (emailError) {
                                                    setMailError(emailError);
                                                } else {
                                                    setMailError('');
                                                }
                                            }}
                                            className={classes.createForm}></input>
                                            <p onClick={OpenPolicyWindow} className={classes.Policy}> *Нажимая на кнопку Вы соглашаетесь на обработку персональных данных </p>
                                        </li>
                                        <li>
                                            <span>Уже есть аккаунт?</span> <button type="button" onClick={() => {
                                                closeRegister();
                                                openLogin();
                                            }}> Войти </button>
                                        </li>
                                    </ul>
                                    <button className={classes.headerMobile__close} onClick={closeRegister}> <img src={close} alt="close" />
                                    </button>
                                </form>
                                <button className={classes.headerMobile__close} onClick={closeRegister}> <img src={close} alt="close" />
                                </button>
                             </div>
                        </Modal>
                    </header>
                )}
            </>
          )
        }
        </>
    )
}
