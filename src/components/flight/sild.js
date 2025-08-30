import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../flight/slid.css'; // You can style here

// Import your images
import kf from '../images/11kf.webp';
import ai from '../images/12ai.webp';

import uae from '../images/13uae.webp';
import sp from '../images/15sp.webp';
import china from '../images/16chaina.webp';
import eu from '../images/17eu.webp';
import ind from '../images/18ind.webp';
import az from '../images/19az.webp';

const CardSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,  // Show 3 at a time on big screens
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const cards = [
    { title: 'King Fisher airlines', text: 'Premium German brand', img: kf },
    { title: 'Air India Airlines ', text: 'Bold and classy drive', img: ai },
  
    { title: 'UAE Airlines', text: 'Smart connected car', img: uae },
    { title: 'SIngapur airlines ', text: 'Luxury in every detail', img: sp },
    { title: 'china AIrlines ', text: 'Ultimate elite experience', img: china },
    { title: 'Euprope Airlines ', text: 'Stylish and affordable', img: eu },
    { title: 'Indigo Airlines', text: 'Reliable and efficient', img: ind },
    { title: 'Azul Airlines ', text: 'Global leader in quality', img: az }
  ];

  return (
    <div className="container mt-5">
      <h4 className="mb-3 fw-bold">Our Site Partners </h4>
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} className="p-2">
            <div className="card border-0 shadow-sm h-100">
              <img
                src={card.img}
                alt={card.title}
                className="card-img-top"
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <h6 className="card-title fw-semibold">{card.title}</h6>
                <p className="card-text text-muted small">{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;
