import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How can I identify if a call or message is a cyber scam?",
    answer:
      "Cyber scams often use urgency, impersonate authority figures, or offer unrealistic rewards. Always verify the sender, never share OTPs or click suspicious links.",
  },
  {
    question: "What should I do if I become a victim of online fraud?",
    answer:
      "Report the incident immediately on Cyber Sentinel. Preserve evidence like screenshots or emails and avoid further interaction with the attacker.",
  },
  {
    question: "How can I secure my social media accounts?",
    answer:
      "Use strong, unique passwords, enable two-factor authentication, review privacy settings regularly, and avoid clicking unknown links or suspicious friend requests.",
  },
  {
    question: "What are common signs of phishing emails?",
    answer:
      "Look out for typos, mismatched email addresses, threatening language, or requests for login/financial info. Legit organizations won’t ask for sensitive data over email.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 px-4" data-aos="fade-up">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl transition-all duration-300 shadow-sm border ${
                  isOpen ? "bg-blue-100 border-blue-200" : "bg-white"
                }`}
              >
                <button
                  onClick={() => toggle(index)}
                  className={`w-full px-6 py-5 flex justify-between items-center font-medium text-left rounded-xl ${
                    isOpen ? "text-blue-800" : "text-gray-800 hover:text-blue-600"
                  }`}
                >
                  {faq.question}
                  <FaArrowRight
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-90 text-blue-800" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions section */}
        <div className="mt-12 text-center">
          <p className="font-semibold text-gray-900 text-lg mb-1">Still have questions?</p>
          <p className="text-gray-600 text-sm mb-4">
            If you have any other queries or need further help, don’t hesitate to contact us. We are here to help you!
          </p>
          <Link
            to="/contact-us"
            className="inline-block bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md transition"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
