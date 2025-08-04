import React, { useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const HelpBanner = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-white py-10 px-4" data-aos="fade-up">
      <div className="max-w-5xl mx-auto">
        <div className="bg-blue-600 text-white rounded-xl p-8 flex flex-col items-center text-center gap-4 shadow-md">
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
          <button className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-md hover:bg-blue-100 transition">
            Report Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HelpBanner;
