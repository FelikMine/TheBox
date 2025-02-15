import React from "react";
import { useState, useEffect, useRef } from "react";
import Modal from 'react-modal';
import close from '../assets/Close.svg';
import classes from "../mainPage/Banner.module.css";
import PolicyModalWindow from "../footer/PolicyModalWindow";

export default function ModalWindow({openModalWindow, onClose}) {

    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileSelected(true);
        } else {
            setFileName('');
            setFileSelected(false);
        }
    };

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect ( () => {
        // console.log("Открытие модального окна", openModalWindow);
        setModalIsOpen(openModalWindow);
    }, [openModalWindow])

    const [error, setError] = useState(false)
    const [emailError, setEmailError] = useState('');
    const [phone, setPhone] = useState('');

    const [isOpenPolicyWindow, setIsOpenPolicyWindow] = useState(false);

    function OpenPolicyWindow () {
        setIsOpenPolicyWindow(!isOpenPolicyWindow);
        closeModal();
    }

    const handlePhoneInput = (event) => {
        const input = event.target.value;
        const regex = /^[0-9+\-]*$/;

        if (regex.test(input)) {
            setPhone(input);
            setError(false);
        } else {
            setError(true);
            event.target.value = phone;
        }
    };

    const openModal = () => { setModalIsOpen(true); };
    const closeModal = () => { setModalIsOpen(false); onClose(); };

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email) ? '' : '*Введите корректный адрес электронной почты.';
    };

    const handleEmailChange = (event) => {
        const email = event.target.value;
        const error = validateEmail(email);
        setEmailError(error);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const error = validateEmail(email);

        if (error) {
            setEmailError(error);
            console.log('Форма не отправлена');
        } else {
            console.log('Форма отправлена');
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
            <>
            <PolicyModalWindow openModalWindow={isOpenPolicyWindow} onClose={() => {
                setIsOpenPolicyWindow(false)
                openModal();
            }
            }/>
            {isDesktop ? (
                 <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    appElement={document.getElementById('root')}
                    className={classes.applicationDesktopContent}
                    overlayClassName={classes.modalOverlay}
                    portalClassName={classes.modalWindow}>
                    <div className='DesktopApplication'>
                    <span> Заявка </span>
                            <button className={classes.applicationMobileContent__close} onClick={closeModal}> <img src={close} alt="close" />
                            </button>
                            <form onSubmit={handleSubmit} action="/submit" method="post" className={`${classes.applicationForm} ${classes.desktopForm}`}>

                                <input type="name" id="name" name="name" placeholder="Имя"/>

                                <input type="phone" id="phone" name="phone" placeholder="Телефон"
                                onInput={handlePhoneInput}
                                style={{ borderColor: error ? '#F958B5' : 'black' ,  borderWidth:  error ? '2px' : '1px'  }} />
                                {error && <span className={classes.errorMessage}>*Пожалуйста, используйте при вводе только цифры, тире и плюс.</span>}

                                <input type="email" id="email" name="email" placeholder="Почта"
                                onChange={handleEmailChange}
                                style={{ borderColor: emailError ? '#F958B5' : 'black', borderWidth: emailError ? '2px' : '1px' }} />
                                {emailError && <span className={classes.errorMessage}>{emailError}</span>}

                                <textarea id="text" name="text" placeholder="Текст"></textarea>

                                <div className={classes.inputFile}>
                                    <input type="file" id="file" name="file" onChange={handleFileChange} style={{ display: 'none' }} />
                                    <label htmlFor="file">
                                        {fileName ? fileName : 'Файл не выбран'}
                                    </label>
                                </div>

                                <input type="submit" value="Оставить заявку" className={classes.submitForm}></input>
                                <p onClick={OpenPolicyWindow}> *Нажимая на кнопку Вы соглашаетесь на обработку персональных данных</p>
                            </form>
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
                    <div className='MobileApplication'>
                        <span> Заявка </span>
                        <button className={classes.applicationMobileContent__close} onClick={closeModal}> <img src={close} alt="close" />
                        </button>
                        <form onSubmit={handleSubmit} action="/submit" method="post" className={classes.applicationForm}>

                            <input type="name" id="name" name="name" placeholder="Имя"/>

                            <input type="phone" id="phone" name="phone" placeholder="Телефон"
                            onInput={handlePhoneInput}
                            style={{ borderColor: error ? '#F958B5' : 'black' ,  borderWidth:  error ? '2px' : '1px'  }} />
                            {error && <span className={classes.errorMessage} style={{marginTop: !emailError ? '95px' : '90px'}}>*Пожалуйста, используйте при вводе только цифры, тире и плюс.</span>}

                            <input type="email" id="email" name="email" placeholder="Почта"
                            onChange={handleEmailChange}
                            style={{ marginTop: error ? "15px" : "0px", borderColor: emailError ? '#F958B5' : 'black', borderWidth: emailError ? '2px' : '1px' }} />
                            {emailError && <span style={{marginTop: !error ? '150px' : '155px'}} className={classes.errorEmailMobileMessage}>{emailError}</span>}

                            <textarea style={{ marginTop: emailError ? "15px" : "0px"}} id="text" name="text" placeholder="Текст"></textarea>

                            <div className={classes.inputFile}>
                                <input type="file" id="file" name="file" onChange={handleFileChange} style={{ display: 'none' }} />
                                <label htmlFor="file">
                                    {fileName ? fileName : 'Файл не выбран'}
                                </label>
                            </div>

                            <input type="submit" value="Оставить заявку" className={classes.submitForm}></input>
                            <p  onClick={OpenPolicyWindow}> *Нажимая на кнопку Вы соглашаетесь на обработку персональных данных</p>
                        </form>
                    </div>
                </Modal>
                )}
                </>
            )
}