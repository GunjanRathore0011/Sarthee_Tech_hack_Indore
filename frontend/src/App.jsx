import React from 'react'
import { Button } from "@/components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './component/Navbar';
import ContactUs from './pages/ContactUs';
import Awareness from './pages/Awareness';
import TrackStatus from './pages/TrackStatus';
import ComplaintForm from './pages/ComplaintForm';
import Login from './component/Login';
import SignUp from './component/SignUp';
import CyberCrimeForm from './pages/form/CyberCrimeForm';

const App = () => {
  return (
    <>
      <Navbar></Navbar>

    <Routes>
        <Route path="/" element={<Home/>} />
        {/* Add these when pages are ready */}
        <Route path="/complaints" element={<ComplaintForm></ComplaintForm>} />
        
        <Route path="/track-status" element={<TrackStatus></TrackStatus>} />

        <Route path="/awareness" element={<Awareness></Awareness>} />
        
        <Route path="/contact-us" element={<ContactUs></ContactUs>}/>
        
        <Route path="/login" element={<Login></Login>} />
        <Route path="/signup" element={<SignUp></SignUp>} />

        <Route path="/financial-fraud" element={<CyberCrimeForm />} />

      </Routes>
    </>
  )
}

export default App