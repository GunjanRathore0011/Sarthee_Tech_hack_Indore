import ComplaintCategory from "@/component/complaintCategory";
import backgroundImage from "../assets/images/backg.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HomeAwareness from "@/component/HomeAwareness";
import TestimonialSlider from "@/component/TestimonialSlider";
import FaqSection from "@/component/FaqSection";
import HelpBanner from "@/component/HelpBanner";
import { useNavigate } from "react-router-dom";
import ScrollingSlider from "@/component/ScrollingSlider";
// import { useSelector } from "react-redux";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/complaints'); // adjust route name if different
  };

  // const currentUser = useSelector((state) => state.user);
  // console.log(currentUser.user.accountType);
  return (
    <>
      <div className=" w-full bg-gradient-to-r from-[#dbeafe] to-[#f9fafb]">
  <div className="h-[81vh]   max-w-7xl mx-auto px-6 py-16 pt-26 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    
    {/* LEFT SIDE → Text Content */}
    <div
      className="z-10 flex flex-col items-start justify-center text-left"
      data-aos="fade-up"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-snug text-gray-900">
        Empowering Digital Safety
      </h1>
      <p className="text-lg max-w-lg mb-8 text-gray-700">
        Cyber Sentinel is your trusted ally in reporting, understanding, and
        protecting against cybercrime. Report incidents, stay informed, and
        safeguard your digital world.
      </p>
      <button
        onClick={handleNavigate}
        className="bg-gradient-to-r from-[#0473fb] to-[#042c70] hover:opacity-90 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md"
      >
        Report Now
      </button>
    </div>

    {/* RIGHT SIDE → Illustration */}
    <div className="flex justify-center md:justify-end">
      <img
        src={backgroundImage}
        alt="Cybercrime illustration"
        className="w-[90%] md:w-[500px] h-auto drop-shadow-2xl"
      />
    </div>
  </div>
</div>
      <ScrollingSlider></ScrollingSlider>

      <ComplaintCategory />
      <HomeAwareness></HomeAwareness>
      <TestimonialSlider></TestimonialSlider>
      <FaqSection></FaqSection>
      <HelpBanner></HelpBanner>

    </>
  );
};

export default Home;

