import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './component/Navbar';
import AdminNavbar from './component/AdminComponent/AdminNavbar';
import ContactUs from './pages/ContactUs';
import Awareness from './pages/Awareness';
import TrackStatus from './pages/TrackStatus';
import ComplaintForm from './pages/ComplaintForm';
import Login from './component/Login';
import SignUp from './component/SignUp';
import CyberCrimeForm from './pages/form/CyberCrimeForm';
import MultiStepForm from './pages/form/MultiStepForm';
import AdminHome from './pages/AdminDashboard/AdminHome';
import ComplaintManagement from './pages/AdminDashboard/ComplaintManagement';
import OfficerManagement from './pages/AdminDashboard/OfficerManagement';
import Analytics from './pages/AdminDashboard/Analytics';
import CrimeMap from './pages/AdminDashboard/CrimeMap';
import OfficerNavbar from '../src/component/OfficerComponent/OfficerNavbar'
import OfficerCaseSection from './pages/OfficerDashboard/OfficerCaseSection';
import AfterComplaint from './pages/AfterComplaint';
import AdminNotifications from './component/AdminComponent/AdminNotifications';
import OfficerNotifications from './component/OfficerComponent/OfficerNotifications';
import ScamDetector from './component/ScamDetector';

const App = () => {
  const location = useLocation();

  // All routes that need Admin Navbar
  const adminRoutes = [
    '/admin-dashboard',
    '/complaint-management',
    '/officer-management',
    '/admin-analytics',
    '/crime-map'
  ];
  const officerRoutes = [
    '/officer-complaint-management'
  ];
  const isOfficerRoute = officerRoutes.includes(location.pathname);
  const isAdminRoute = adminRoutes.includes(location.pathname);

  return (
    <>
      {isAdminRoute ? (
        <AdminNavbar />
      ) : isOfficerRoute ? (
        <OfficerNavbar />
      ) : (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/complaints" element={<ComplaintForm />} />
        <Route path="/track-status" element={<TrackStatus />} />
        <Route path="/awareness" element={<Awareness />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/financial-fraud" element={<CyberCrimeForm />} />
        <Route path="/step-form" element={<MultiStepForm />} />
        <Route path="/submitedcomplaint" element={<AfterComplaint/>} />
        <Route path="/scan" element={<ScamDetector />} />


        {/* Admin Dashboard */}
        <Route path="/admin-dashboard" element={<ComplaintManagement />} />
        <Route path="/complaint-management" element={<ComplaintManagement />} />
        <Route path="/officer-management" element={<OfficerManagement />} />
        <Route path="/admin-analytics" element={<Analytics />} />
        <Route path="/crime-map" element={<CrimeMap />} />
        <Route path='/admin-notifications' element={<AdminNotifications/>}/>

        {/* Officer Dashboard */}
        <Route path="/officer-complaint-management" element={<OfficerCaseSection />} />
        <Route path='/officer-notifications' element={<OfficerNotifications/>} />

      </Routes>
    </>
  );
};

export default App;
