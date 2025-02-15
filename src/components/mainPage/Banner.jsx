import classes from "./Banner.module.css"
import React from "react";
import { useState, useEffect, useRef } from "react";
import PolicyModalWindow from "../footer/PolicyModalWindow";
import ModalWindow from "../instruments/ModalWindow";


export default function Banner() {

    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState('');

    const [isOpenPolicyWindow, setIsOpenPolicyWindow] = useState(false);
    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const menuRef = useRef(null);

    const [error, setError] = useState(false)
    const [phone, setPhone] = useState('');
    const [emailError, setEmailError] = useState('');

    function OpenPolicyWindow () {
        setIsOpenPolicyWindow(!isOpenPolicyWindow);
        closeModal();
    }

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

    const handlePhoneInput = (event) => {
        const input = event.target.value;
        const regex = /^[0-9+\-]*$/; // Разрешаем только цифры, плюс и тире

        if (regex.test(input)) {
            setPhone(input);
            setError(false);
        } else {
            setError(true);
            event.target.value = phone; // Возвращаем предыдущее значение
        }
    };

    const openModal = () => { setModalIsOpen(true); };
    const closeModal = () => { setModalIsOpen(false); };

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

        <ModalWindow openModalWindow={modalIsOpen} onClose={() => setModalIsOpen(false)}/>
        <PolicyModalWindow openModalWindow={isOpenPolicyWindow} onClose={() => {
            setIsOpenPolicyWindow(false)
            openModal();
        }}/>

        {isDesktop ? (
            <>
            <div className={classes.MainPage}>
               <div className={classes.MainPage__banner}>
                   <span> Trading Systems Development </span>
                   <button onClick={openModal}> Оставить заявку </button>
                   <p> Создаем инновационное ПО для эффективной работы на крипто-биржах </p>
               </div>
            </div>
           </>
        ) : (
            <>
                <div className={classes.MainPageMobile}>
                    <div className={classes.MainPageMobile__banner}>
                        <span> Trading Systems Development </span>
                        <p> Создаем инновационное ПО для эффективной работы на крипто-биржах </p>
                        <button onClick={openModal}> Оставить заявку </button>
                    </div>
                </div>
            </>
        )}
        </>
    )
}