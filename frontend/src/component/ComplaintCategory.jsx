import React from 'react';
import { FaDollarSign } from "react-icons/fa";
import { FaComputer } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintCategory = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const handleClick = () => {
    
  navigate('/step-form'); // Navigate to the multi-step form
  }
  return (
    <section className="bg-white py-16 px-4 mt-10 mb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center"
            data-aos="fade-up"
          >
            <div className="text-4xl text-blue-600 mb-4">
              <FaDollarSign />
            </div>
            <h3 className="text-xl font-semibold mb-2">Financial Fraud</h3>
            <p className="text-gray-600 mb-6">
              Report online scams, banking fraud, investment fraud, and other financial cybercrimes swiftly.
            </p>
            <button 
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-sm font-medium">
              Register a Complaint
            </button>
          </div>

          {/* Card 2 */}
          <div
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="text-4xl text-blue-600 mb-4">
              <FaBan />
            </div>
            <h3 className="text-xl font-semibold mb-2">Harassment or Abuse</h3>
            <p className="text-gray-600 mb-6">
              Address cyberstalking, online abuse, revenge porn, and other digital harassment incidents.
            </p>
            <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-sm font-medium">
              Register a Complaint
            </button>
          </div>

          {/* Card 3 */}
          <div
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-4xl text-blue-600 mb-4">
              <FaComputer />
            </div>
            <h3 className="text-xl font-semibold mb-2">Other Cyber Crimes</h3>
            <p className="text-gray-600 mb-6">
              For phishing, hacking, data theft, intellectual property theft, and other digital offenses.
            </p>
            <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-sm font-medium">
              Register a Complaint
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ComplaintCategory;
