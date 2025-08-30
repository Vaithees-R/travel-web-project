// src/components/FlightBooking.js
import React, { useState } from 'react';
import './FlightBooking.css'; // Optional: your custom styles

function FlightBooking() {
  const [tripType, setTripType] = useState('One-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const tripTypes = ['One-way', 'Round-trip', 'Multi-city'];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Searching ${tripType} flights from ${from} to ${to}`);
    // Clear fields (optional)
    setFrom('');
    setTo('');
    setDepartureDate('');
    setReturnDate('');
  };

  return (
    <div className="flight-booking-container container mt-5">
      <h3 className="mb-3">✈️ Flight Booking</h3>

      <div className="trip-options d-flex gap-2 mb-3">
        {tripTypes.map((type, index) => (
          <button
            key={index}
            className={`btn ${tripType === type ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTripType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          type="text"
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />

        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />

        {tripType === 'Round-trip' && (
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        )}

        <button type="submit" className="btn btn-primary">
          SEARCH FLIGHTS
        </button>
      </form>
    </div>
  );
}

export default FlightBooking;
