import { postAccountsSettings , getSettings, getApprovingActions, getProducts} from "./Responses.jsx";
import { useState, useEffect, useRef } from 'react';
import Header from '../header/Header.jsx';
import React from 'react';
import classes from "./Preferences.module.css"
import Footer  from '../footer/Footer';
import { Navigate } from "react-router-dom";
import Modal from 'react-modal';
import close from '../assets/Close.svg'
import Duplicator from './AccountBlock.jsx';
import MainBlock from './MainBlock.jsx';
import ProductBlock from "./ProductBlock.jsx";

export default function Preferences() {

    const [activeBlock, setActiveBlock] = useState('block1');
    //Разыгрываем поведение поля если почта пользователя не подтверждена
    const [isModalOpen, setModalOpen] = useState(false);
    const [products, setProducts] = useState([{}]);

    const [error, setError] = useState(false);
    const [authenticated, setAuthenticated] = useState('');
    const [ isEditing, setIsEditing] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);

    const [ postData, setPostData] = useState({});

    const [userSettings, setUserSettings] = useState({});
    const [approvingActions, setApprovingActions] = useState([]);

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

    const toggleBlock = async (blockName) => {

        if (blockName != "block1" && activeBlock == "block1") {
            if(isEditing == true) {
                setModalOpen(true);
            }
            setIsEditing(false);
        }
        setActiveBlock(activeBlock === blockName ? activeBlock : blockName);

        const token = localStorage.getItem("accessToken");

        setIsEditingName(false);
        setIsEditingPhone(false);
        setIsEditingEmail(false);
        setError(false);

        if ((blockName == "block1") && token) {

            const response = await getSettings(token);
            setUserSettings(response);

            const response2 = await getApprovingActions(token);
            setApprovingActions(response2);

            console.log("Настройки получаемые : ", response, response2)
            console.log("Настройки при переключении: ", userSettings);

        } else if ((blockName == "block3") && token) {
            getProducts(token);
            console.log("Продукты при переключении:", products);
        }
    };

     const handleConfirm = () => {

        const token = localStorage.getItem("accessToken");

        postAccountsSettings(postData, token);
        console.log('Сохранено');
        setModalOpen(false);
    };

    const handleCancel = () => {
        console.log('Не сохранено');
        setModalOpen(false);
    };

    if (authenticated == "false") {
        // Redirect
        return <Navigate replace to="/main" />;

    } else if (authenticated === '') {
        return <div>Загрузка...</div>; // Временный экран загрузки
    }
    else if (authenticated=="true") {

        return (
            <>
            <div className={classes.wrapper}>

             <Header></Header>

                <Modal
                    appElement={document.getElementById('root')}
                    className={classes.exitContent}
                    overlayClassName={classes.exitOverlay}
                    portalClassName={classes.exitWindow}
                    isOpen={isModalOpen}
                    onRequestClose={() => {
                        console.log('Отказ сохранить настройки.');
                        setModalOpen(false)
                        }
                    }>

                    <div className='headerDesktop__menu'>
                        <ul>
                            <li>
                                <p> Сохранить настройки? </p>
                            </li>
                            <li>
                                <button onClick={handleConfirm} className={classes.exitFormStay}> Сохранить </button>
                            </li>
                            <li>
                                <button onClick={ handleCancel } className={classes.exitForm}> Не сохранять </button>
                            </li>

                        </ul>

                        <button className={classes.headerMobile__close} onClick={handleCancel}> <img src={close} alt="close" />
                        </button>

                        <button className={classes.headerMobile__close} onClick={handleCancel}> <img src={close} alt="close" />
                        </button>
                    </div>

                </Modal>

                <div className={classes.backgrondPhoto}></div>

                <div className={classes.PreferencesPage}>
                    <div className={classes.PreferencesPage__Content}>
                        <span> Настройки </span>
                        <div>

                            <div className={classes.PreferencesPage__Content__Buttons}>
                                <button className={`${classes.button} ${activeBlock === 'block1' ? classes.active : ''}`} onClick={() => toggleBlock('block1')}>Основные</button>
                                <button className={`${classes.button} ${activeBlock === 'block2' ? classes.active : ''}`} onClick={() => toggleBlock('block2')}>Аккаунты</button>
                                <button className={`${classes.button} ${activeBlock === 'block3' ? classes.active : ''}`} onClick={() => toggleBlock('block3')}>Продукты</button>
                            </div>

                        {activeBlock === 'block1' && (
                            <MainBlock data={postData} setData={setPostData} isBlockEditing={isEditing} setIsBlockEditing={setIsEditing}/>
                        )}

                        {activeBlock === 'block2' && (
                            <Duplicator />
                        )}

                        {activeBlock === 'block3' && (
                            <ProductBlock />
                        )}

                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
            </>
        );
    }
};