'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ComplaintCategory from '@/component/complaintCategory';

const ComplaintForm = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gray-50 py-10 px-4">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-10 text-center" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">File a Cyber Crime Complaint</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Cyber crimes such as online fraud, identity theft, harassment, and financial scams are increasing rapidly. 
          This platform enables you to securely register your complaint and ensure it reaches the authorities.
        </p>
      </div>

      {/* Awareness Box */}
      <div
        className="max-w-4xl mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-6 mb-10 rounded shadow"
        data-aos="fade-right"
      >
        <h2 className="text-xl font-semibold mb-2">⚠️ Important Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Every cybercrime complaint is confidential and reviewed by official investigators.</li>
          <li>Even if someone submits a false complaint, they are initially treated as victims until verification is completed.</li>
          <li>Misuse of this platform by submitting fake reports can lead to legal consequences.</li>
          <li>Please provide accurate details and attach any evidence you have.</li>
          <li>Once submitted, you will receive a unique Complaint ID to track the status.</li>
        </ul>
      </div>

      {/* Complaint Category Section */}
      <div className="max-w-4xl mx-auto" data-aos="zoom-in-up">
        <ComplaintCategory />
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto mt-10 text-gray-700 text-sm text-center" data-aos="fade-up">
        <p className="mb-1">Need Help? Call the 24/7 Cyber Crime Helpline: <strong className="text-blue-700">1930</strong></p>
        <p>
          Or visit the National Cyber Crime Portal at{' '}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            cybercrime.gov.in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ComplaintForm;
