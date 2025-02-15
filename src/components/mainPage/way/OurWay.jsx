import roadmap from "./assets/Roadmap.svg"
import roadmap1 from "./assets/roadmap1.svg"
import roadmap2 from "./assets/roadmap2.svg"
import roadmap3 from "./assets/roadmap3.svg"
import classes from "./OurWay.module.css"
import React from "react";
import { useState , useEffect} from "react";

export default function OurWay() {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className={classes.OurWay}>
                <p> НАШ ПУТЬ </p>
                <img src={isDesktop ? roadmap : roadmap1} alt="Наш путь фото 1" />
                <img src={isDesktop ? "d" : roadmap2} alt={isDesktop ? "" : "Наш путь фото 2"} />
                <img src={isDesktop ? "d" : roadmap3} alt={isDesktop ? "" : "Наш путь фото 3"} />
            </div>
        </>
    )
}