import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

// Import train images
import train1 from '../images/bharath.webp';
import train2 from '../images/british.webp';
import train3 from '../images/bullet.webp';
import train4 from '../images/elect.webp';
import train5 from '../images/uae.webp';
import train6 from '../images/usa.webp';

function TrainCardSection() {
  const trains = [
    { name: 'Rajdhani Express', price: '₹1200', time: '06:30 AM', img: train1 },
    { name: 'Shatabdi Express', price: '₹950', time: '07:00 AM', img: train2 },
    { name: 'Duronto Express', price: '₹1350', time: '08:15 AM', img: train3 },
    { name: 'Garib Rath', price: '₹600', time: '09:45 AM', img: train4 },
    { name: 'Intercity Express', price: '₹700', time: '11:00 AM', img: train5 },
    { name: 'Tejas Express', price: '₹1600', time: '12:20 PM', img: train6 },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🚆 Train Booking</h2>
      <div className="row">
        {trains.map((train, index) => (
          <div key={index} className="col-lg-4 col-md-6 col-12 mb-4">
            <div className="card h-100 text-center">
              <img
                src={train.img}
                className="card-img-top mx-auto"
                alt={train.name}
                style={{ height: '150px', width: '100%', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{train.name}</h5>
                <p className="card-text">Price: {train.price}</p>
                <p className="card-text">Departure: {train.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainCardSection;
