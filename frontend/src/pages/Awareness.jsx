import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCheckCircle } from "react-icons/fa";
import FeedbackForm from "./form/New";
import CyberCrimeCards from "@/component/CyberCrimeCards";
import TrendingCases from "./TrendingCases";

const Awareness = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-white text-gray-800">

      {/* <FeedbackForm /> */}
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#dbeafe] to-[#f9fafb] py-20 px-4 text-center" data-aos="fade-right">
  <h1 className="text-4xl md:text-5xl font-bold text-blue-700 drop-shadow-sm">
    Cyber Safety Awareness
  </h1>
  <p className="mt-3 text-lg md:text-xl text-blue-600">
    Stay Informed, Stay Secure
  </p>
</section>

{/* What is Cybercrime */}
<section className="max-w-5xl mx-auto py-22 px-6 text-center" data-aos="fade-down">
  <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-800">
    What is <span className="text-blue-600">Cybercrime?</span>
  </h2>
  <p className="text-lg text-gray-600 leading-relaxed">
    Cybercrime refers to any criminal activity that involves a computer, 
    network, or networked device. <br />It’s crucial to understand these 
    threats to protect yourself and your digital presence.
  </p>

  {/* Highlighted Note */}
  <div className="mt-8 w-2xl bg-blue-50 border-l-4 mx-auto border-blue-600 p-4 rounded-lg shadow-sm">
    <p className="text-blue-700 font-medium">
      💡 Tip: Awareness is your first line of defense against online threats.
    </p>
  </div>
</section>

      {/* Common Types of Cybercrime */}
      <CyberCrimeCards />

      {/* Trending Cybercrime Cases */}
      <TrendingCases />

      {/* How Scammers Trick You
      <section className="bg-gray-50 py-16 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-semibold text-center mb-10">How Scammers Trick You</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-bold mb-2">Fake SMS / Emails (Phishing)</h3>
            <p>Convincing messages tricking you to click malicious links or reveal personal data.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-bold mb-2">Malware Pop-ups</h3>
            <p>Fake virus warnings prompting you to install harmful software or call scam numbers.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <h3 className="text-xl font-bold mb-2">Fraud Links / Impersonation</h3>
            <p>Fake websites or identities tricking you into sharing credentials or financial data.</p>
          </div>
        </div>
      </section> */}

      {/* Cyber Safety Tips */}
      <section className=" mx-auto py-16 px-4 bg-gradient-to-r from-[#dbeafe] to-[#f9fafb] mt-2.5" data-aos="fade-up">
        <div className="max-w-6xl mx-auto ">
          <h2 className="text-3xl font-semibold text-center  mb-10">Cyber Safety Tips</h2>
        <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-700">
          {[
            "Use strong, unique passwords for all your accounts and consider using a password manager.",
            "Enable two-factor authentication (2FA) for extra security wherever possible.",
            "Regularly check data breach sites to see if your data has been compromised.",
            "Be cautious of unsolicited links or attachments from unknown senders.",
            "Avoid logging into sensitive accounts (e.g., banking) on public Wi-Fi."
          ].map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <FaCheckCircle className="text-green-500 mt-1" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Report Cybercrime */}
      <section className=" py-20 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-semibold text-center mb-6">How to Report a Cybercrime</h2>
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-blue-700 mb-2">📞 1930</p>
          <p className="text-gray-700">24x7 helpline for immediate cybercrime reporting</p>
        </div>

        {/* <div className="text-center mb-6">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            Submit Complaint Online (cybercrime.gov.in)
          </a>
        </div> */}

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-gray-800">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Step 1: Keep Proof Ready</h3>
            <p>Gather screenshots, transaction records, and communication logs.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Step 2: Submit Complaint</h3>
            <p>Provide detailed info on the official portal for faster processing.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Step 3: Track Status</h3>
            <p>Use the Complaint ID to monitor the progress and updates.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Awareness;
