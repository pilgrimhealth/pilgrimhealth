/* eslint-disable @next/next/no-img-element */
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
function TransitionSliderLogo() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 1000,
    cssEase: 'linear',
  };
  const images = [
    '/s-logo1.webp',
    '/s-logo2.webp',
    '/s-logo3.webp',
    '/s-logo4.webp',
    '/s-logo6.webp',
  ];
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((item, i) => (
          <img
            src={item}
            alt=""
            key={i}
            className="mt-3 w-auto h-auto lg:h-[260px] object-contain"
          />
        ))}
      </Slider>
    </div>
  );
}

export default TransitionSliderLogo;
