import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../flight/slid.css'; // You can style here
import cards from "./slidData";

const CardSlider = ({travelType}) => {
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


  return (
    <div className="container mt-5">
      <h4 className="mb-3 fw-bold">Our Site Partners </h4>
      <Slider {...settings}>
        {cards[travelType].map((card, index) => (
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
