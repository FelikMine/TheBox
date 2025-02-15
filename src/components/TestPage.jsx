import React from 'react';
import Header from '../components/header/Header';
import MainPage from './mainPage/MainPage';
import AutorizeHeader from '../components/header/AutorizeHeader';
import { isAutorize } from "../components/header/Header";

export default function TestPage() {
    return (
        <div>
            <Header></Header>
            <MainPage> </MainPage>
        </div>
    );
};

