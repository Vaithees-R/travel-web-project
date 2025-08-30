// flights
import kf from '../images/flights/11kf.webp';
import ai from '../images/flights/12ai.webp';
import uae from '../images/flights/13uae.webp';
import sp from '../images/flights/15sp.webp';
import china from '../images/flights/16chaina.webp';
import eu from '../images/flights/17eu.webp';
import ind from '../images/flights/18ind.webp';
import az from '../images/flights/19az.webp';

// trains
import train1 from '../images/trains/train1.jpeg';
import train2 from '../images/trains/train2.jpeg';
import train3 from '../images/trains/train3.jpeg';
import train4 from '../images/trains/train4.jpeg';
import train5 from '../images/trains/train5.jpeg';
import train6 from '../images/trains/train6.jpeg';

// buses
import bus1 from '../images/buses/bus1.jpeg';
import bus2 from '../images/buses/bus2.jpeg';
import bus3 from '../images/buses/bus3.jpeg';
import bus4 from '../images/buses/bus4.webp';
import bus5 from '../images/buses/bus5.jpg';
import bus6 from '../images/buses/bus6.webp';
import bus7 from '../images/buses/bus7.webp';
import bus8 from '../images/buses/bus8.jpeg';


//cabs
import cab1 from '../images/cabs/cab1.jpeg';
import cab2 from '../images/cabs/cab2.jpeg';
import cab3 from '../images/cabs/cab3.jpeg';
import cab4 from '../images/cabs/cab4.jpeg';
import cab5 from '../images/cabs/cab5.jpeg';
import cab6 from '../images/cabs/cab6.jpeg';
import cab7 from '../images/cabs/cab7.jpeg';
import cab8 from '../images/cabs/cab8.jpeg';


const cards = {
    flights:[
    { title: 'King Fisher airlines', text: 'Premium German brand', img: kf },
    { title: 'Air India Airlines ', text: 'Bold and classy drive', img: ai },
    { title: 'UAE Airlines', text: 'Smart connected car', img: uae },
    { title: 'SIngapur airlines ', text: 'Luxury in every detail', img: sp },
    { title: 'china AIrlines ', text: 'Ultimate elite experience', img: china },
    { title: 'Euprope Airlines ', text: 'Stylish and affordable', img: eu },
    { title: 'Indigo Airlines', text: 'Reliable and efficient', img: ind },
    { title: 'Azul Airlines ', text: 'Global leader in quality', img: az }
  ], 
  cabs : [
    { title: 'Economy Car', text: 'Affordable city rides', img: cab1 },
    { title: 'SUV', text: 'Comfort for the whole family', img: cab2 },
    { title: 'Luxury Sedan', text: 'Travel in style and comfort', img: cab3 },
    { title: 'Convertible', text: 'Perfect for scenic drives', img: cab4 },
    { title: 'Minivan', text: 'Ideal for group trips', img: cab5 },
    { title: 'Electric Car', text: 'Eco-friendly travel option', img: cab6 },
    { title: 'Pickup Truck', text: 'Adventure-ready rental', img: cab7 },
    { title: 'Compact Car', text: 'Easy parking, budget friendly', img: cab8 }
  ], 
  buses : [
    { title: 'City Express', text: 'Fast urban connections', img: bus1 },
    { title: 'Intercity Coach', text: 'Comfortable long-distance travel', img: bus2 },
    { title: 'Tourist Bus', text: 'Explore tourist destinations', img: bus3 },
    { title: 'Luxury Sleeper', text: 'Overnight luxury journeys', img: bus4 },
    { title: 'Airport Shuttle', text: 'Hassle-free airport transfers', img: bus5 },
    { title: 'Mini Bus', text: 'Perfect for small groups', img: bus6 },
    { title: 'Charter Bus', text: 'Private bus for large groups', img: bus7 },
    { title: 'Double Decker', text: 'Sightseeing with a view', img: bus8 }
  ], 
  trains : [
    { title: 'Vande bharat Express', text: 'Quick cross-country travel', img: train1 },
    { title: 'Luxury Sleeper Train', text: 'Sleep and arrive refreshed', img: train2 },
    { title: 'Regional Train', text: 'Connects nearby cities', img: train3 },
    { title: 'Mountain Railway', text: 'Scenic hill journeys', img: train4 },
    { title: 'Heritage Train', text: 'Vintage experience on rails', img: train5 },
    { title: 'Metro Train', text: 'Fast city commute', img: train6 }
  ]
};

export default cards;