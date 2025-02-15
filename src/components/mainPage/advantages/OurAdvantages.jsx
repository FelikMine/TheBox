import classes from "./OurAdvantages.module.css"
import React from "react";
import { useState } from "react";
import vector from "./assets/Vector.svg";
import vector2 from "./assets/Vector2.svg";
import ModalWindow from "../../instruments/ModalWindow";

export default function OurAdvantages() {

    const [modalIsOpen, setIsOpenWindow] = useState(false);

    return (
        <>
        <ModalWindow
            openModalWindow={modalIsOpen}
            onClose={() => setIsOpenWindow(false)}
        />
             <div className={classes.Advantages}>
                <span> Наши преимущества </span>
                <div className={classes.Advantages__list}>
                    <div>Быстрое прототипирование</div>
                    <div>Тестирование на исторических данных</div>
                    <div>Готовые решения для каждого </div>
                </div>
            </div>

            <div className={classes.Services}>
                    <span> Услуги </span>
                <div className={classes.Services__list}>
                    <div>
                        <img src={vector} alt="иконка" />
                        <span> Разработка ПО для автоматизации торговли </span>
                        <p> Разработка ПО для торговли под ваши запросы с применением ваших стратегий или типовых стратегий с гибкими настройками</p>
                    </div>
                    <div>
                    <img src={vector2} alt="иконка" />
                        <span> Тестирование стратегий
                        на датасетах </span>
                        <p> Мы поможем не потреять время и деньги на тестировании реал тайм рынке. Тестирование на графике покажет примерную прибыльность. </p>
                    </div>
                </div>
            </div>

            <div className={classes.RequestButtons}>
                <button onClick={() => setIsOpenWindow(true)}> Узнать больше </button>
                <button onClick={() => setIsOpenWindow(true)}> Оставить заявку </button>
            </div>

        </>
    );

}