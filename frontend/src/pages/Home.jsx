import ComplaintCategory from "@/component/complaintCategory";
import backgroundImage from "../assets/images/banner.jpg";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HomeAwareness from "@/component/HomeAwareness";
import TestimonialSlider from "@/component/TestimonialSlider";
import FaqSection from "@/component/FaqSection";
import HelpBanner from "@/component/HelpBanner";

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <>
      <div className="relative h-[500px] w-full text-white">
        {/* Background Image with reduced brightness */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover filter brightness-65"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        ></div>

        {/* Optional: Add a dark overlay for even more clarity */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Text Content with AOS */}
        <div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <h1 className="text-5xl font-extrabold mb-6">
            Empowering Digital Safety
          </h1>
          <p className="text-lg max-w-2xl mb-8">
            Cyber Sentinel is your trusted ally in reporting, understanding, and
            protecting against cybercrime. Report incidents, stay informed, and
            safeguard your digital world.
          </p>
          <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-semibold">
            Report Now
          </button>
        </div>
      </div>

      <ComplaintCategory />
      <HomeAwareness></HomeAwareness>
      <TestimonialSlider></TestimonialSlider>
      <FaqSection></FaqSection>
      <HelpBanner></HelpBanner>
    </>
  );
};

export default Home;
