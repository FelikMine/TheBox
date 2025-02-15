
import React from "react";
import Banner from "./Banner";
import OurAdvantages from "./advantages/OurAdvantages"
import OurWay from "./way/OurWay"
import SwiperList from "./swiper/SwiperList"
import Footer from "../footer/Footer";
import classes from "./Banner.module.css"

export default function MainPage() {

    return (
        <>
            <div className={classes.backgrondPhoto}></div>
            <Banner> </Banner>
            <OurAdvantages> </OurAdvantages>
            <OurWay></OurWay>
            <SwiperList> </SwiperList>
            <Footer></Footer>
        </>
    )
}