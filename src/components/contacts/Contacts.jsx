

import Header from '../header/Header';
import AutorizeHeader from '../header/AutorizeHeader';
import React from 'react';
import classes from "./Contacts.module.css"
import Footer  from '../footer/Footer';
import tg from '../assets/Tg.svg'
import wp from '../assets/WhatsApp.svg'
import tp from '../assets/Telephone.svg'
import ml from '../assets/Mail.svg'
import { isAutorize } from "../../components/header/Header";

export default function Contacts() {

    return (
        <div className={classes.wrapper}>
            <Header></Header>
            <div className={classes.backgrondPhoto}></div>

            <div className={classes.ContactsPage}>
                <div className={classes.ContactsPage__Content}>

                    <span> КОНТАКТЫ </span>

                    <div className={classes.ContactsPage__Content__Contacts}>

                        <div className={classes.contacts}>
                            <p><img src={tg} alt="telegram" /> @tradesysdev</p>
                            <p><img src={wp} alt="whatsapp" />+7 (999) 999-99-99</p>
                            <p><img src={tp} alt="telephone" />+7 (999) 999-99-99</p>
                            <p><img src={ml} alt="mail" />tradesysdev@gmail.com</p>
                        </div>

                        <div className={classes.requisites}>
                            <p> ООО ТрейдСисДев </p>
                            <p> ИНН 11111111111 </p>
                        </div>

                    </div>
                </div>

            </div>

            <Footer></Footer>
        </div>
    )
}
