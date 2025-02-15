import './SwiperList.css';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import './SwiperList.css'
import { useState } from 'react';

export default function SwiperList() {

    const [isDesktop, setIsMobile] = useState(window.innerWidth > 540);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth > 540);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  useEffect(() => {
    const swiper = new Swiper('.swiper', {

      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
          el: '.swiper-scrollbar',
        },
    });

    return () => {
      if (swiper) {
        swiper.destroy();
      }
    };
  }, []); // Пустой массив зависимостей гарантирует, что это выполнится только один раз при монтировании


  return (
    <>
    { isDesktop ? (
      <>
        <p className="reviewsTitle">нас выбирают</p>
        <div className="swiper">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="reviews">
                <span>ElonMusk356</span>
                <p>Обратился по разработке кастомного бота, всё сделали качественно и в срок! Спасибо!</p>
              </div>
              <div className="reviews">
                <span>JeffBezos895</span>
                <p>Обратился за данными и тестированием стратегии, это помогло мне сохранить деньги до её запуска в реал тайм, т.к. стратегию пришлось подстраивать и доделывать.</p>
              </div>
            </div>
            <div className="swiper-slide">Слайд 2</div>
            <div className="swiper-slide">Слайд 3</div>
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </>
    ) : (
      <>
        <p className="reviewsTitle">нас выбирают</p>
        <div className="swiper">
          <div className="swiper-wrapper">

            <div className="swiper-slide">
              <div className="reviews">
                <span>ElonMusk356</span>
                <p>Обратился по разработке кастомного бота, всё сделали качественно и в срок! Спасибо!</p>
              </div>
            </div>

            <div className="swiper-slide">
            <div className="reviews">
                <span>JeffBezos895</span>
                <p>Обратился за данными и тестированием стратегии, это помогло мне сохранить деньги до её запуска в реал тайм, т.к. стратегию пришлось подстраивать и доделывать.</p>
              </div>
            </div>

            <div className="swiper-slide">Слайд 3</div>
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>



      </>
    )}
    </>
  );
}
