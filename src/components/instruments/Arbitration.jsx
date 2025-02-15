import React from "react";
import { useState, useEffect } from 'react';
import classes from "./Instruments.module.css"
import question from '../assets/question.svg';
import arbitraz_photo from '../assets/arbitraz_foto.svg';
import ModalWindow from "./ModalWindow";
import { Link } from "react-router-dom";

export default function Arbitration() {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOpenWindow, setIsOpenWindow] = useState(false);

    function OpenWindow () {
        setIsOpenWindow(!isOpenWindow);
    }

    useEffect(() => {
        const checkAuthentication = () => {
            const storedAuth = localStorage.getItem("authenticated");
            if (storedAuth == "true") {
                setIsAuthenticated("true");
            } else {
                setIsAuthenticated("false");
            }
        };
        checkAuthentication();

        const handleStorageChange = () => { // Вызываем функцию при изменении storage
            checkAuthentication();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
        <ModalWindow openModalWindow={isOpenWindow} onClose={() => setIsOpenWindow(false)}/>
        { isDesktop ? (
            <>
            <div className={classes.InstrumentsPage}>
                <div className={classes.InstrumentsPage__Content}>
                    <div className={classes.Instrument}>
                        <span> <img className={classes.questionLogo} src={question} alt="вопрос" /> Арбитраж </span>
                        {isAuthenticated == "true" ? (
                            <Link to="/charts"><button > Открыть </button></Link>
                        ) : (
                            <Link to href="/charts"><button onClick={OpenWindow}> Купить </button></Link>
                        )}
                        <p> Криптовалютный арбитраж — это инвестиционная стратегия, основанная на одновременной покупке и продаже одной и той же криптовалюты на разных биржах для получения прибыли за счет разницы в  ценах. Вкратце, инвестор покупает криптовалюту на одной бирже, где её цена ниже, и продает на другой бирже, где цена выше.</p>
                        <div>
                            <img src={arbitraz_photo} alt="инструмент Арбитраж" />
                        </div>
                    </div>
                </div>
            </div>
            </>
        ) : (
            <>
                <div className={classes.InstrumentsPage}>
                <div className={classes.InstrumentsPage__Content}>

                    <div className={classes.Instrument}>
                        <span> <img className={classes.questionLogo} src={question} alt="вопрос" /> Арбитраж </span>

                        <p> Криптовалютный арбитраж — это инвестиционная стратегия, основанная на одновременной покупке и продаже одной и той же криптовалюты на разных биржах для получения прибыли за счет разницы в  ценах. Вкратце, инвестор покупает криптовалюту на одной бирже, где её цена ниже, и продает на другой бирже, где цена выше.</p>
                        <div>
                            <img src={arbitraz_photo} alt="инструмент Арбитраж" />
                        </div>
                        {isAuthenticated == "true" ? (
                            <Link to="/charts"><button > Открыть </button></Link>
                        ) : (
                            <Link to href="/charts"><button onClick={OpenWindow}> Купить </button></Link>
                        )}

                    </div>

                </div>
            </div>
            </>
        )}
        </>
    )
}