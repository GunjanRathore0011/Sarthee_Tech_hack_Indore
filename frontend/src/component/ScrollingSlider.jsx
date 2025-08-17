
export default function ScrollingSlider() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#0473fb] to-[#042c70] py-5 text-md">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        <span className="text-white text-lg font-semibold mx-6">
          Report Cybercrime Instantly
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          Track Complaint Status
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          AI-Powered Threat Detection
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          Stay Updated with Cyber Awareness
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          Empowering Digital Safety Together
        </span>
        
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          24/7 Support for Victims
        </span>
        <span className="text-white mx-6">✦</span>
      </div>

      {/* Duplicate content for seamless loop */}
      <div className="animate-marquee2 whitespace-nowrap flex items-center absolute top-3">
        <span className="text-white text-lg font-semibold mx-6">
          Report Cybercrime Instantly
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          Track Complaint Status
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          AI-Powered Threat Detection
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          Stay Updated with Cyber Awareness
        </span>
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          Empowering Digital Safety Together
        </span>
        
        <span className="text-white mx-6">✦</span>
        <span className="text-white text-lg font-semibold mx-6">
          24/7 Support for Victims
        </span>
        <span className="text-white mx-6">✦</span>
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          display: inline-flex;
          animation: marquee2 25s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
}
