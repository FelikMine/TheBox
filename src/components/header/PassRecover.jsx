import React from "react";
import { useState, useEffect } from "react";
import Modal from 'react-modal';
import close from '../assets/Close.svg';
import classes from "./PassRecover.module.css";

export default function PassRecover({openModalWindow, onClose, openReg, openLog}) {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const baseLog = 'Пожалуйста, введите ваше имя пользователя или email. Вы получите письмо со ссылкой для создания нового пароля.';
    const [aboutUser, setAboutUser] = useState(baseLog);

    useEffect ( () => {
        setModalIsOpen(openModalWindow);
        setAboutUser(baseLog);
    }, [openModalWindow])

    const openModal = () => { setModalIsOpen(true); };
    const closeModal = () => { setModalIsOpen(false); onClose(); };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Отправка...");
        setAboutUser('Пользователь с таким именем не найден.');

        var timer = setTimeout(() => {
            closeModal();
        }, 10000);

        return () => clearTimeout(timer);
    }

    return (
            <>
            {isDesktop ? (
                 <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    appElement={document.getElementById('root')}
                    className={classes.applicationDesktopContent}
                    overlayClassName={classes.modalOverlay}
                    portalClassName={classes.modalWindow}>

                    <button className={classes.applicationContent__close } onClick={closeModal}> <img src={close} alt="close" />
                    </button>
                    <div className={classes.DesktopApplication}>
                    <span> Забыли пароль? </span>
                    <div>
                        {aboutUser}
                    </div>
                        <form onSubmit={handleSubmit} action="/submit" method="post" className={`${classes.applicationForm} ${classes.desktopForm}`}>
                            <label htmlFor="login"> Имя пользователя или email:</label>
                            <input type="login" id="login" placeholder="Логин"/>
                            <input type="submit" value="Получить новый пароль" className={classes.submitForm}></input>
                        </form>

                    <div>
                        <button type="button" onClick={() => { openReg() }}> Зарегистрироваться </button>
                        <button type="button" onClick={() => { openLog() }}> Войти </button>
                    </div>

                    </div>

                </Modal>
            ) : (
               <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    appElement={document.getElementById('root')}
                    className={classes.applicationMobileContent}
                    overlayClassName={classes.modalOverlay}
                    portalClassName={classes.modalWindow}>
                    <div className={classes.MobileApplication}>
                        <span> Заявка </span>
                        <button className={classes.applicationContent__close} onClick={closeModal}> <img src={close} alt="close" />
                        </button>
                        <form onSubmit={handleSubmit} action="/submit" method="post" className={classes.applicationForm}>
                            <label htmlFor="login"> Имя пользователя или email</label>
                            <input type="login" id="login" placeholder="Логин"/>
                            <input type="submit" value="Получить новый пароль" className={classes.submitForm}></input>
                        </form>

                        <div>
                            <button type="button" onClick={() => { openReg() }}> Зарегистрироваться </button>
                            <button type="button" onClick={() => { openLog() }}> Войти </button>
                        </div>

                    </div>
                </Modal>
                )}
                </>
            )
}