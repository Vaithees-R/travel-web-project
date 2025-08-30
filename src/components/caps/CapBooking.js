// src/components/CabBooking.js
import React, { useState } from 'react';
import './CabBooking.css'; // You can style it here

function CabBooking() {
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const serviceTypes = ["Outstation One-way", "Outstation Round trip", "Airport transfer", "Hourly Rental"];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Searching cabs from " + pickup + " to " + drop);
    // Clear fields
    setPickup('');
    setDrop('');
    setPickupDate('');
    setPickupTime('');
  };

  return (
    <div className="cab-booking-container container mt-5">
      <h3 className="mb-3">🚗 Cab Booking</h3>
      <div className="service-options d-flex gap-2 mb-3">
        {serviceTypes.map((service, index) => (
          <button className="btn btn-outline-primary" key={index}>{service}</button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input type="text" placeholder="Enter Pickup location" value={pickup} onChange={(e) => setPickup(e.target.value)} />
        <input type="text" placeholder="Enter Drop location" value={drop} onChange={(e) => setDrop(e.target.value)} />
        <button type="button" className="btn btn-secondary">+ Add Stops New</button>
        <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
        <input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
        <button type="submit" className="btn btn-primary">SEARCH CABS</button>
      </form>
    </div>
  );
}

export default CabBooking;
