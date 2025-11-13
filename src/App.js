import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importing components
import Navbar from './components/navbar'; // capital N
import CardSlider from './components/flight/slid'; 
import PopularRoutes from './components/flight/PopularRoutes';
import NotionalRoutes  from "./components/flight/National";
import CabBooking from "./components/caps/CapBooking";
import BusBooking from "./components/bus/BusBooking";
import TrainBooking from "./components/trains/TrainBooking";
import FlightBooking from './components/flight/FlightBooking';
import FAQ  from "./components/Faqs";
import Footer from "./components/footer";

function App({travelType}) {
  return (
    <div className="App container mt-4">
      <h1 className="text-center mb-4">ENJOY YOUR JOURNEY WITH OUR TRAVEL PARTNERS  </h1>
      <CardSlider travelType={travelType}/>

      {travelType === 'flights' && <FlightBooking />}
      {travelType === 'cabs' && <CabBooking />}
      {travelType === 'buses' && <BusBooking />}
      {travelType === 'trains' && <TrainBooking />}

      <PopularRoutes />
      <NotionalRoutes />
      <FAQ/>
      <Footer/>
    </div>
  );
}

export default App;
