import React from "react";
import one from '../assets/images/1.png';
import two from '../assets/images/2.png';
import three from '../assets/images/3.png';
import four from '../assets/images/4.png';
import five from '../assets/images/5.png';
import six from '../assets/images/6.png';

const cyberCrimes = [
  {
    title: "Phishing",
    desc: "Deceptive attempts to obtain sensitive information like usernames, passwords, and credit card details by disguising as a trustworthy entity in electronic communication.",
    img: one,
},
  {
    title: "Identity Theft",
    desc: "The unlawful acquisition and use of an individual's personal identifying information, usually for financial gain or to commit fraud.",
    img: two,
},
  {
    title: "Financial Fraud",
    desc: "Any illegal activity that involves deception for economic gain, often carried out through online scams, credit card fraud, or investment schemes.",
    img: three,
},
  {
    title: "Cyberbullying",
    desc: "The use of electronic communication to bully a person, typically by sending messages of an intimidating or threatening nature.",
    img: four,
},
  {
    title: "Hacking",
    desc: "Unauthorized access to computer systems or networks, often to steal data, disrupt services, or cause damage.",
    img: five,
},
  {
    title: "Ransomware",
    desc: "A type of malicious software that encrypts a victim's files and demands a payment to decrypt them, typically Bitcoin.",
    img: six,
},
];

function CyberCrimeCards() {
  return (
    <div className="py-12 px-6 bg-gradient-to-r from-[#dbeafe] to-[#f9fafb]">
      <h2 className="text-3xl font-bold text-center mb-4">Common Types of Cybercrime</h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
        From digital deception to data destruction, understand the various forms
        cybercriminals use to exploit vulnerabilities.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cyberCrimes.map((crime, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-[#0473fb] to-[#042c70] text-wh rounded-xl shadow-md over:shadow-lg transition transform hover:scale-105 cursor-pointer overflow-hidden"
          >
            {/* Illustration */}
            <div className="flex justify-center items-center bg-white p-1">
              <img
                src={crime.img || two} // Fallback to a default image if not provided
                alt={crime.title}
                className="w-55 h-55 object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 text-white">
                {crime.title}
              </h3>
              <p className="text-sm text-white">{crime.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CyberCrimeCards;
