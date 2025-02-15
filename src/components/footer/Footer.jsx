import classes from './Footer.module.css'
import logo from '../assets/Vector.svg'
import tg from '../assets/Tg.svg'
import wp from '../assets/WhatsApp.svg'
import tp from '../assets/Telephone.svg'
import ml from '../assets/Mail.svg'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PolicyModalWindow from "./PolicyModalWindow";
import ContractModalWindow from "./ContractModalWindow";

let exportedFooterHeight = 0;

export const getFooterHeight = () => exportedFooterHeight;

export default function Footer() {

    const [footerHeight, setFooterHeight] = useState(0);

    const [isOpenPolicyWindow, setIsOpenPolicyWindow] = useState(false);
    const [isOpenContractWindow, setIsOpenContractWindow] = useState(false);

    function OpenPolicyWindow () {
        setIsOpenPolicyWindow(!isOpenPolicyWindow);
    }

    function OpenContractWindow () {
        setIsOpenContractWindow(!isOpenContractWindow);
    }

    const adjustBackgroundHeight = () => {
        let height = isDesktop ? 232 : 173;
        setFooterHeight(height);
        exportedFooterHeight = footerHeight;
    };

    useEffect(() => {
        adjustBackgroundHeight();

        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [adjustBackgroundHeight]);

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);

    return (
        <>
        <PolicyModalWindow openModalWindow={isOpenPolicyWindow} onClose={() => setIsOpenPolicyWindow(false)} />
        <ContractModalWindow openModalWindow={isOpenContractWindow} onClose={() => setIsOpenContractWindow(false)} />
        { isDesktop ? (
            <>
            <div className={classes.footer}>

                <div className={classes.footer__contacts}>

                <span>
                    <img src={tg} alt="telegram" />
                    <Link to="https://t.me/test" target="_blank" rel="noopener noreferrer">@tradesysdev</Link>
                </span>
                <span>
                    <img src={wp} alt="whatsapp" />
                    <Link to="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer">+7 (999) 999-99-99</Link>
                </span>
                <span>
                    <img src={tp} alt="telephone" />
                    <Link to="tel:+79999999999">+7 (999) 999-99-99</Link>
                </span>
                <span>
                    <img src={ml} alt="mail" />
                    <Link to="mailto:test@gmail.com">tradesysdev@gmail.com</Link>
                </span>

                    <span>© 2024 Все права защищены</span>
                </div>

                <div className={classes.footer__links}>
                    <div>
                        <Link to="/main" className={classes.logo}><img src={logo} alt="logo" />  </Link>
                        <Link to="/main">TradeSysDev</Link>
                    </div>
                    <div className={classes.hug}>
                        <Link to="/" className={classes.main}> Главная </Link>
                        <Link to="/instruments" className={classes.main}> Инструменты </Link>
                        <Link to="/contacts" className={classes.main}> Контакты </Link>
                    </div>
                </div>

                <div className={classes.footer__documents}>
                    <button onClick={OpenContractWindow}> Договор оферты </button>
                    <button onClick={OpenPolicyWindow}> Политика конфиденциальности </button>
                </div>

            </div>
            </>
        ) : (
            <>


                <div className={classes.footer}>

                <div className={classes.footer__title}>
                    <div>
                        <Link to="/main" ><img src={logo} alt="logo" />  </Link>
                        <Link to="/main">TradeSysDev</Link>
                    </div>
                </div>

                    <div className={classes.footer__contacts}>

                    <span>
                        <img src={tg} alt="telegram" />
                        <Link to="https://t.me/test" target="_blank" rel="noopener noreferrer">@tradesysdev</Link>
                    </span>
                    <span>
                        <img src={wp} alt="whatsapp" />
                        <Link to="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer">+7 (999) 999-99-99</Link>
                    </span>
                    <span>
                        <img src={tp} alt="telephone" />
                        <Link to="tel:+79999999999">+7 (999) 999-99-99</Link>
                    </span>
                    <span>
                        <img src={ml} alt="mail" />
                        <Link to="mailto:test@gmail.com">tradesysdev@gmail.com</Link>
                    </span>

                        <span>© 2024 Все права защищены</span>
                    </div>

                    <div className={classes.footer__links}>
                        <div className={classes.hug}>
                            <Link to="/main" className={classes.main}> Главная </Link>
                            <Link to="/instruments" className={classes.main}> Инструменты </Link>
                            <Link to="/contacts" className={classes.main}> Контакты </Link>
                            <hr />
                            <button onClick={OpenContractWindow}> Договор оферты </button>
                            <button onClick={OpenPolicyWindow}> Политика конфиденциальности </button>
                        </div>
                    </div>

                    <div className={classes.footer__documents}>

                    </div>

                    </div>
            </>
        ) }
        </>
    )
}