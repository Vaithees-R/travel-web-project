import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Navbar from './components/navbar';
import Login from './components/Login/Login';
import ContactUs from './components/ContactUs/ContactUs';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Navbar />
   
    <Routes>
      <Route path='/' element={<App travelType="flights" />} />
      <Route path='/flights' element={<App travelType="flights" />} />
      <Route path='/trains' element={<App travelType="trains"/>} />
      <Route path='/buses' element={<App travelType="buses"/>} />
      <Route path='/cabs' element={<App travelType="cabs"/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/contact' element={<ContactUs />} />
      {/* ContactUs */}
    </Routes>
  </BrowserRouter>
);
