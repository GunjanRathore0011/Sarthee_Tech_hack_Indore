import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
  {
    name: "Ravi Mehra",
    feedback: "Filing a cyber complaint has never been easier. I felt heard and safe.",
    location: "Bhopal, India",
  },
  {
    name: "Anita Sharma",
    feedback: "Very useful portal. The awareness resources helped me avoid a scam call.",
    location: "Indore, India",
  },
  {
    name: "Vikram Desai",
    feedback: "Clean interface, responsive support. I got updates on my case status too.",
    location: "Ujjain, India",
  },
  {
    name: "Preeti Nair",
    feedback: "Appreciate how easy it was to report a scam. Very efficient!",
    location: "Jabalpur, India",
  },
  {
    name: "Sanjay Rao",
    feedback: "Trusted source for cyber safety information. Highly recommended.",
    location: "Gwalior, India",
  },
];

const TestimonialSlider = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // tablets
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640, // mobile
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="bg-white py-16 px-4" data-aos="fade-up">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-10">
          What People Are Saying
        </h2>
        <Slider {...settings}>
          {testimonials.map((t, idx) => (
            <div key={idx} className="px-4">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
                <p className="text-gray-700 italic mb-4">“{t.feedback}”</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.location}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TestimonialSlider;
