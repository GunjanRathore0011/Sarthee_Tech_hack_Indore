import React, { useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const HelpBanner = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);
 const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/complaints'); // adjust route name if different
  };
  return (
    <section className="bg-gradient-to-r from-[#f0f7ff] to-white py-6 px-4" data-aos="fade-up">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white rounded-xl p-8 flex flex-col items-center text-center gap-4 shadow-md">
          <h2 className="text-2xl font-semibold">Need Immediate Help?</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center text-sm">
            <div className="flex items-center gap-2">
              <FaPhoneAlt /> <span>Helpline: 1930</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope /> <span>contact@cybersentinel.in</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt /> <span>Indore, Madhya Pradesh, India</span>
            </div>
          </div>
          <button onClick={handleNavigate} className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-md hover:bg-blue-100 transition">
            Report Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpBanner;
