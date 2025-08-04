import React, { useEffect } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { FaBookOpen, FaNewspaper } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const HomeAwareness = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const cards = [
    {
      icon: <FaShieldAlt />,
      title: "Cyber Safety Tips",
      description: "Essential guidelines to protect yourself and your family from common cyber threats.",
    },
    {
      icon: <FaBookOpen />,
      title: "Cyber Awareness Handbook",
      description: "A comprehensive guide to understanding the landscape of cybercrime and prevention.",
    },
    {
      icon: <FaNewspaper />,
      title: "Daily Digest",
      description: "Stay updated with the latest cybercrime news, trends, and security alerts.",
    },
  ];

  return (
    <section className="bg-gray-100 mt-15 mb-15 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-12">
          Awareness & Learning Corner
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md text-center"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.description}</p>
              <button className="border cursor-pointer border-gray-400 hover:border-blue-500 hover: text-blue-600 text-sm py-1 px-4 rounded-md transition">
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAwareness;
