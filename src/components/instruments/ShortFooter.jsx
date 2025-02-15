import classes from './ShortFooter.module.css'
import logo from '../assets/Vector.svg'
import tg from '../assets/Tg.svg'
import wp from '../assets/WhatsApp.svg'
import tp from '../assets/Telephone.svg'
import ml from '../assets/Mail.svg'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PolicyModalWindow from "../footer/PolicyModalWindow";
import ContractModalWindow from "../footer/ContractModalWindow";

export default function ShortFooter() {

    const [isOpenPolicyWindow, setIsOpenPolicyWindow] = useState(false);
    const [isOpenContractWindow, setIsOpenContractWindow] = useState(false);

    function OpenPolicyWindow () {
        setIsOpenPolicyWindow(!isOpenPolicyWindow);
    }

    function OpenContractWindow () {
        setIsOpenContractWindow(!isOpenContractWindow);
    }

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);

    return (
        <>
         <PolicyModalWindow openModalWindow={isOpenPolicyWindow} onClose={() => setIsOpenPolicyWindow(false)} />
        <ContractModalWindow openModalWindow={isOpenContractWindow} onClose={() => setIsOpenContractWindow(false)} />
        { isDesktop ? (
            <>
            <div className={classes.footer}>

                <div className={classes.footer__contacts}>

                <a href="https://t.me/test" target="_blank" rel="noopener noreferrer">
                        <img src={tg} alt="telegram" />
                </a>
                <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer">
                    <img src={wp} alt="whatsapp" />
                </a>
                <a href="tel:+79999999999">
                    <img src={tp} alt="telephone" />
                </a>
                <a href="mailto:test@gmail.com">
                    <img src={ml} alt="mail" />
                </a>

                    <span>© 2024 Все права защищены</span>
                </div>


                <div className={classes.footer__links}>
                    <div>
                        <Link to="/main" className={classes.logo}><img src={logo} alt="logo" />  </Link>
                        <Link to="/main">TradeSysDev</Link>
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

                    <a href="https://t.me/test" target="_blank" rel="noopener noreferrer">
                        <img src={tg} alt="telegram" />
                    </a>
                    <a href="https://wa.me/79999999999" target="_blank" rel="noopener noreferrer">
                        <img src={wp} alt="whatsapp" />
                    </a>
                    <a href="tel:+79999999999">
                        <img src={tp} alt="telephone" />
                    </a>
                    <a href="mailto:test@gmail.com">
                        <img src={ml} alt="mail" />
                    </a>

                        <span>© 2024 Все права защищены</span>
                    </div>

                    <div className={classes.footer__links}>
                        <div className={classes.hug}>
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