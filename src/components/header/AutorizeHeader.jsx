import React from "react";
import logo from '../assets/Vector.svg'
import reg from '../assets/Register.svg'
import burger from '../assets/Burger.svg'
import close from '../assets/Close.svg'
import preferences from '../assets/Preferences.svg'
import classes from "./Header.module.css"
import { useState, useEffect, useRef} from "react";
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

export default function Header() {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [exitIsOpen, setExitIsOpen] = useState(false);

    const openExit = () => { setExitIsOpen(true); };
    const closeExit = () => { setExitIsOpen(false); };

    const openModal = () => { setModalIsOpen(true); };
    const closeModal = () => { setModalIsOpen(false); };

    function clearData() {
        localStorage.setItem("authenticated", false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('tokenType');
        window.location.reload();
    }

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth > 540);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Обновляем состояние при первом рендере

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        console.log("isDesktop:", isDesktop);
    }, [isDesktop]);

    // is authenticated
    const [authenticated, setAuthenticated] = useState('');
    useEffect(() => {
        const loggedInUser = localStorage.getItem("authenticated");
        if (loggedInUser) {
            setAuthenticated("true");
        } else {
            setAuthenticated("false");
        }
    }, []);

    return (
        <>
        {isDesktop ? (
            <header className={classes.siteHeader}>

                <Modal
                    isOpen={exitIsOpen}
                    onRequestClose={closeExit}
                    appElement={document.getElementById('root')}
                    className={classes.exitContent}
                    overlayClassName={classes.exitOverlay}
                    portalClassName={classes.exitWindow}>

                    <div className='headerDesktop__menu'>
                        <ul>
                            <li>
                                <p> Хотите выйти? </p>
                            </li>
                            <li>
                                <button onClick={closeExit} className={classes.exitFormStay}> Остаться </button>
                            </li>
                            <li>
                                <button onClick={ () => {
                                    closeExit();
                                    clearData();
                                }} className={classes.exitForm}> Выйти </button>
                            </li>

                        </ul>

                        <button className={classes.headerMobile__close} onClick={closeExit}> <img src={close} alt="close" />
                        </button>

                        <button className={classes.headerMobile__close} onClick={closeExit}> <img src={close} alt="close" />
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
                <Link to="/preferences" className={classes.preferences}><img src={preferences} alt="preferences" /></Link>
                <button onClick={openExit} className={classes.home}><img src={reg} alt="home" /></button>
            </div>
        </header>
        ) : (
            <header className={classes.headerMobile}>

                <Modal
                    isOpen={exitIsOpen}
                    onRequestClose={closeExit}
                    appElement={document.getElementById('root')}
                    className={classes.exitContent}
                    overlayClassName={classes.exitOverlay}
                    portalClassName={classes.exitWindow}>

                    <div className='headerDesktop__menu'>
                        <ul>
                            <li>
                                <p> Хотите выйти? </p>
                            </li>
                            <li>
                                <button onClick={closeExit} className={classes.exitFormStay}> Остаться </button>
                            </li>
                            <li>
                            <button onClick={ () => {
                                    closeExit();
                                    clearData();
                                }} className={classes.exitForm}> Выйти </button>
                            </li>

                        </ul>

                        <button className={classes.headerMobile__close} onClick={closeExit}> <img src={close} alt="close" />
                        </button>

                        <button className={classes.headerMobile__close} onClick={closeExit}> <img src={close} alt="close" />
                        </button>
                        </div>
                </Modal>

                <button className={classes.headerMobile__burger} onClick={openModal} > <img src={burger} alt="burger" />
                </button>

                <div>
                    <Link to="/main" className={classes.brand}><img src={logo} alt="brand" />  </Link>
                    <span><Link to="/main">TradeSysDev</Link></span>
                </div>
                <div>

                    <Link to="/preferences" className={classes.preferences}><img src={preferences} alt="preferences" /></Link>
                    <button onClick={openExit} className={classes.home}><img src={reg} alt="home" /></button>
                </div>

                 <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    appElement={document.getElementById('root')}  // Или любой другой селектор
                    className={classes.modalContent}
                    overlayClassName={classes.modalOverlay}
                    portalClassName={classes.modalWindow}>
                    <div className='headerMobile__menu'>
                    <ul>
                            <li>
                                <Link to="/main" className={classes.main}> Главная </Link>
                            </li>
                            <li>
                                <Link to="/instruments" className={classes.instruments}> Инструменты </Link>
                            </li>
                            <li>
                                <Link to="/contacts" className={classes.contacts}> Контакты </Link>
                            </li>
                        </ul>
                    <button className={classes.headerMobile__close} onClick={closeModal}> <img src={close} alt="close" />
                    </button>
                 </div>
                 </Modal>
            </header>
        )}
        </>
    );
}