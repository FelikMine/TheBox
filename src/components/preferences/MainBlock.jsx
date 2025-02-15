import { useState, useEffect, useRef } from 'react';
import React from 'react';
import classes from "./Preferences.module.css";
import { postAccountsSettings , getSettings, getApprovingActions, getProducts} from "./Responses.jsx";
import { Link } from 'react-router-dom';

export default function MainBlock ( { data, setData,  isBlockEditing, setIsBlockEditing} ) {

        const [isMailConfirmed, setIsMailConfirmed] = useState(false);
        const[confirmationMessage, setConfirmationMessage] = useState('');
        const [isModalOpen, setModalOpen] = useState(false);
        const [ isEditing, setIsEditing] = useState(false);
        const [authenticated, setAuthenticated] = useState('');

        const [error, setError] = useState(false);
        const [phone, setPhone] = useState('');

        const [userSettings, setUserSettings] = useState({});
        const [approvingActions, setApprovingActions] = useState([]);

        const [number, setNumber] = useState('');
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [selectedValue, setSelectedValue] = useState(''); //Инициализация пустым значением

        const [isEditingName, setIsEditingName] = useState(false);
        const [isEditingPhone, setIsEditingPhone] = useState(false);
        const [isEditingEmail, setIsEditingEmail] = useState(false);

        const nameInputRef = useRef(null);
        const phoneInputRef = useRef(null);
        const emailInputRef = useRef(null);

        useEffect ( () => {
            setData({
                name: name,
                phone: number,
                email: email,
                approving_action: selectedValue,
            });
        }, [number, name, email, selectedValue, setData])

         useEffect(() => {
            // Обновляем состояние в родительском компоненте
            setIsBlockEditing(isEditing);
            console.log("is Editing !!!", isEditing);
        }, [isEditing]);

        const handleNameEdit = () => {
            setIsEditingName(true);
            if (nameInputRef.current) {
                nameInputRef.current.focus();
            }
        };

        const handlePhoneEdit = () => {
            setIsEditingPhone(true);
            if (phoneInputRef.current) {
                phoneInputRef.current.focus();
            }
        };

        const handleEmailEdit = () => {
            setIsEditingEmail(true);
            if (emailInputRef.current) {
                emailInputRef.current.focus();
            }
        };

        const handleEmailInput = (event) => {
            setEmail(event.target.value);
            setIsEditing(true);
        };
        const handleNameInput = (event) => {
            setName(event.target.value);
            setIsEditing(true);
        };

        //Вызов при открытии страницы
        useEffect(() => {

            const fetchData = async () => {
                const token = localStorage.getItem("accessToken");
                if (token) {

                    const response = await getSettings(token);
                    setUserSettings(response);

                    const response2 = await getApprovingActions(token);
                    setApprovingActions(response2);

                    console.log("Настройки при открытии страницы: ", response, response2);

                    if((response.email_validated == false) && (response.email !== '')) {
                        setIsMailConfirmed(false);
                        setConfirmationMessage('*Почта не подтверждена');
                    } else {
                        setIsMailConfirmed(true);
                        setConfirmationMessage('');
                    }
                }
            }
            fetchData();
        }, []);


        const handlePhoneInput = (event) => {
            const input = event.target.value;
            const regex = /^[0-9+\-]*$/;

            if (regex.test(input)) {
                setPhone(input);
                setNumber(input);
                setIsEditing(true);
                setError(false);
            } else {    
                setError(true);
                event.target.value = phone;
            }
        };
        useEffect(() => {

            checkLocalStorage();

            function checkLocalStorage() {
                const loggedInUser = localStorage.getItem("authenticated");
                if (loggedInUser == "true") {
                    setAuthenticated("true");
                } else {
                    setAuthenticated("false");
                }
            }

            window.addEventListener('storage', checkLocalStorage)

            return () => {
                window.removeEventListener('storage', checkLocalStorage)
            }

        }, []);

        useEffect(() => {
            if (userSettings && userSettings.name && userSettings.name != '') {
                setName(userSettings.name);
            }
            if ( userSettings && userSettings.phone && userSettings.phone != '' ) {
                setNumber(userSettings.phone)
            }
            if ( userSettings && userSettings.email && userSettings.email != '' ) {
                setEmail (userSettings.email)
            }
            if ( userSettings && userSettings.approving_action && userSettings.approving_action != '' ) {
                setSelectedValue(userSettings.approving_action)
                console.log("Да ", userSettings.approving_action, selectedValue );

            } else {
                setSelectedValue ("Выбрать");
                console.log("Нет ", userSettings.approving_action, selectedValue);
            }
        }, [userSettings]);



        useEffect(() => {

            // console.log("Настройки обновлены 2: ", userSettings);

            if((userSettings.email_validated == false) && (userSettings.email !== '')) {
                setIsMailConfirmed(false);
                setConfirmationMessage('*Почта не подтверждена');
            } else {
                setIsMailConfirmed(true);
                setConfirmationMessage('');
            }
        }, [userSettings]);

        return (
            <>
                <div className={classes.PreferencesPage__Content__Block1}>

                    <div className={classes.Block1__Column1}>

                        <div className={classes.userName}>
                            <label htmlFor="username">Ваше имя:</label>
                            <input type="text" id="name" name="name" value={name} readOnly={!isEditingName} onInput={handleNameInput} placeholder="Имя" />
                            <div className={classes.reName}>
                                <Link to href="/preferences" onClick={handleNameEdit} > Изменить </Link>
                            </div>

                        </div>

                        {/* <div className={classes.reNameMobile}>
                            <Link to href="/preferences" onClick={handleNameEdit} > Изменить </Link>
                        </div> */}

                        <div className={classes.userTel}>
                            <label htmlFor="telephone">Телефон:</label>
                            <input type="tel" id="phone" name="phone" value={number}
                            placeholder="Телефон" readOnly={!isEditingPhone} onInput={handlePhoneInput}
                            style={{ borderColor: error ? '#C63131' : 'initial' }} />

                            <div className={classes.reTel}>
                                <Link to href="/preferences" onClick={handlePhoneEdit} > Изменить </Link>
                            </div>
                        </div>

                            {error && <span className={classes.errorMessage}>*Введите корректные данные.</span>}

                        <div className={classes.userMail}>
                            <label htmlFor="mail">Почта:</label>
                            <input type="email" id="email" name="email" value={email} readOnly={!isEditingEmail} onInput={handleEmailInput} placeholder="Почта" />

                            <div className={classes.reMail}>
                            { (userSettings && userSettings.approving_action && userSettings.approving_action != '' && userSettings.email_validated != true )? (
                                <button> Подтвердить почту </button>
                            ) : (
                                <>

                                </>
                            )}
                                <Link to onClick={handleEmailEdit} href="/preferences" style={{ marginLeft: (userSettings && userSettings.email_validated && userSettings.email_validated != '' && userSettings.email_validated != true) ? '0px' : (userSettings.email_validated == true) ? '-178px' : '0px' }}> Изменить </Link>
                            </div>
                        </div>


                        <p className={classes.confirmation}>{confirmationMessage}</p>

                        {/* { userSettings.email_validated != true ? (
                            <div className={classes.reMailDesktop}>
                                <button> Подтвердить почту </button>
                            </div>
                        ) : (
                            <>

                            </>
                        )} */}

                        <div className={classes.doIt}>
                            <span> Подтверждение действия </span>
                            <select value={selectedValue} onChange={(e) => {
                                setSelectedValue(e.target.value);
                                setIsEditing(true);
                            }}>
                                    {approvingActions.map((action, index) => (
                                        <option key={action + index} value={action}>
                                            {action}
                                        </option>
                                    ))}
                            </select>
                            </div>

                    </div>

                    <div className={classes.Block1__Column2}>

                    </div>


                </div>

            </>
        )
    }
