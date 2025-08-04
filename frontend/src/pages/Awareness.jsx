import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaCheckCircle } from "react-icons/fa";

const Awareness = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-200 py-20 px-4 text-center" data-aos="fade-down">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700">Cyber Safety Awareness</h1>
        <p className="mt-2 text-lg text-blue-600">Stay Informed, Stay Secure</p>
      </section>

      {/* What is Cybercrime */}
      <section className="max-w-5xl mx-auto py-16 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-semibold text-center mb-10">What is Cybercrime?</h2>
        <ul className="space-y-4 text-lg text-gray-700 list-disc pl-5">
          <li><strong>Phishing:</strong> Deceptive attempts to acquire sensitive info by masquerading as a trustworthy entity.</li>
          <li><strong>Online Fraud:</strong> Tricking individuals into parting with money or personal data using false practices.</li>
          <li><strong>Cyberstalking:</strong> Harassment through electronic means, often repeated and unwanted.</li>
          <li><strong>Identity Theft:</strong> Fraudulent use of another person's personal data for gain.</li>
        </ul>
      </section>

      {/* How Scammers Trick You */}
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
      </section>

      {/* Cyber Safety Tips */}
      <section className="max-w-6xl mx-auto py-16 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-semibold text-center mb-10">Cyber Safety Tips</h2>
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
      </section>

      {/* Report Cybercrime */}
      <section className="bg-blue-50 py-20 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-semibold text-center mb-6">How to Report a Cybercrime</h2>
        <div className="text-center mb-4">
          <p className="text-4xl font-bold text-blue-700 mb-2">📞 1930</p>
          <p className="text-gray-700">24x7 helpline for immediate cybercrime reporting</p>
        </div>

        <div className="text-center mb-6">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
          >
            Submit Complaint Online (cybercrime.gov.in)
          </a>
        </div>

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
