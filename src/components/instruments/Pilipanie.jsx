import React from "react";
import { useState, useEffect } from 'react';
import classes from "./Instruments.module.css"
import question from '../assets/question.svg';
import Group from '../assets/Group.svg';
import extreme from '../assets/extreme.svg';
import extremeSmall from '../assets/extreme_mobile.svg';
import ModalWindow from "./ModalWindow";


export default function Pilipanie() {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);

    const [isOpenWindow, setIsOpenWindow] = useState(false);

    function OpenWindow () {
        setIsOpenWindow(!isOpenWindow);
        // console.log("Открытие модального окна pilipanie", isOpenWindow);
    }

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
        <ModalWindow openModalWindow={isOpenWindow}  onClose={() => setIsOpenWindow(false)} />
        { isDesktop ? (
            <>
            <div className={classes.InstrumentsPage}>
                <div className={classes.InstrumentsPage__Content}>
                    <p className={classes.title}> Инструменты </p>

                    <div className={classes.Instrument}>
                        <span> <img className={classes.questionLogo} src={question} alt="вопрос" /> Пилипание </span>
                        <button onClick={OpenWindow}> Купить </button>
                        <p> Ясность нашей позиции очевидна: синтетическое тестирование влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Картельные сговоры не допускают ситуации, при которой сделанные на базе интернет-аналитики выводы являются только методом политического участия и описаны максимально подробно. Имеется спорная точка зрения, гласящая примерно следующее: реплицированные с зарубежных источников, современные исследования являются только методом политического участия и смешаны с не уникальными данными до степени совершенной неузнаваемости, из-за чего возрастает их статус бесполезности.</p>
                        <div className={classes.pilipanie_photo}>
                            <img src={Group} alt="график свечей" />
                            <img src={extreme} alt="экстремум" />
                        </div>
                    </div>
                </div>
            </div>
            </>
        ) : (
            <>
                <div className={classes.InstrumentsPage}>
                <div className={classes.InstrumentsPage__Content}>
                    <p className={classes.title}> Инструменты </p>

                    <div className={classes.Instrument}>
                        <span> <img className={classes.questionLogo} src={question} alt="вопрос" /> Пилипание </span>

                        <p> Ясность нашей позиции очевидна: синтетическое тестирование влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Картельные сговоры не допускают ситуации, при которой сделанные на базе интернет-аналитики выводы являются только методом политического участия и описаны максимально подробно. Имеется спорная точка зрения, гласящая примерно следующее: реплицированные с зарубежных источников, современные исследования являются только методом политического участия и смешаны с не уникальными данными до степени совершенной неузнаваемости, из-за чего возрастает их статус бесполезности.</p>
                        <div className={classes.pilipanie_photo} >
                            <img src={Group} alt="график свечей" />
                            <img src={extremeSmall} alt="экстремум" />
                        </div>

                        <button onClick={OpenWindow}> Купить </button>

                    </div>

                </div>
            </div>
            </>
        )}
        </>
    )
}