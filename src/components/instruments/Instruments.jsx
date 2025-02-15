import Header from "../header/Header";
import React from "react";
import AutorizeHeader from '../header/AutorizeHeader';
import { useState, useEffect, useRef } from 'react';
import classes from "./Instruments.module.css"
import Footer  from '../footer/Footer';
import question from '../assets/question.svg';
import Group from '../assets/Group.svg';
import extreme from '../assets/extreme.svg';
import extremeSmall from '../assets/extreme_mobile.svg'
import { isAutorize } from "../../components/header/Header";
import Pilipanie from "./Pilipanie";
import Arbitration from "./Arbitration";
import ShortFooter from "./ShortFooter";

export default function Instruments() {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <Header></Header>
            <div className={classes.backgrondPhoto}></div>

            <Pilipanie></Pilipanie>
            <Arbitration> </Arbitration>
            <ShortFooter></ShortFooter>
        </>
    )
}