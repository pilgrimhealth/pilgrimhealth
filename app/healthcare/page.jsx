/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import Loader from '../../components/Shared/Loader';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import './styles.css';

// import required modules
import { isValidArray } from '@/lib/func';
import { useSelector } from 'react-redux';
import { EffectCards } from 'swiper/modules';
import { dataCards } from '../data/dataCards';

export default function HealthCare() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSwiper, setCurrentSwiper] = useState(0);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  if (!dataCards?.length) return null;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="px-2 gap-4 flex flex-col w-full items-center justify-center relative">
      {isLoading && (
        <div className="w-full h-screen flex items-center justify-center relative">
          <div className="absolute top-[20%] flex items-center justify-center">
            <Loader />
          </div>
        </div>
      )}
      {!isLoading &&
        isValidArray(dataCards) &&
        dataCards.map((item, index) => (
          <div
            key={item.topic}
            className="flex flex-col w-full items-center justify-center shadow-xl rounded-md pb-4"
          >
            <Swiper
              effect={'cards'}
              grabCursor={true}
              modules={[EffectCards]}
              onClick={() => {
                setCurrentSwiper(index);
              }}
              className="mySwiper relative rounded-[18px] w-full"
            >
              {isValidArray(item?.sources) && (
                <SwiperSlide
                  key={0}
                  className="flex justify-center items-center w-full ring-[3px] ring-neutral-200 min-h-[440px]"
                >
                  <button
                    onClick={() => {
                      location.replace(
                        `/healthcare/${item.sources[0]?.title[
                          currentLanguage
                        ]?.replace(
                          /\s+/g,
                          '-'
                        )}?select=${currentSwiper}&lang=${currentLanguage}`
                      );
                    }}
                    className="w-full rounded-[18px] relative h-full"
                  >
                    <img
                      src={item.sources[0].src[currentLanguage]}
                      alt={item.sources[0]?.title[currentLanguage]}
                      className="min-h-[440px] w-full rounded-[18px]"
                    />
                    <span className="text-[#02B1BF] bg-white rounded-b-lg absolute top-0 right-0 px-4 text-[18px] py-1">
                      1 of{' '}
                      {isValidArray(item?.sources) ? item.sources.length : 0}
                    </span>
                    <p className="text-center w-full py-4 text-[18px] absolute bottom-0 text-[#085f63] font-bold bg-white z-20">
                      {item.sources[0]?.title[currentLanguage]}
                    </p>
                  </button>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        ))}
    </div>
  );
}
