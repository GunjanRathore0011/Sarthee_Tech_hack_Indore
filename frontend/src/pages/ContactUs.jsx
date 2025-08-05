'use client';

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    alert("Your message has been sent!");
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-8" data-aos="fade-down">
          Contact CyberSentinel
        </h1>

        {/* Info and Form Container */}
        <div className="grid md:grid-cols-2 gap-8" data-aos="fade-up">
          {/* Contact Info */}
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">
              Have questions, need help, or want to report an issue? Reach out to our cyber protection team.
            </p>
            <div>
              <h3 className="text-lg font-semibold text-blue-600">📍 Office Address</h3>
              <p className="text-gray-600">CyberSentinel HQ, 2nd Floor, Tech Park, Indore, MP, India</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600">📧 Email</h3>
              <p className="text-gray-600">support@cybersentinel.in</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-600">📞 Helpline</h3>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-sm text-gray-500">Available 24/7 | Toll-free cybercrime helpline: 1930</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border border-gray-300 rounded p-3 w-full"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="border border-gray-300 rounded p-3 w-full"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="border border-gray-300 rounded p-3 w-full"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="border border-gray-300 rounded p-3 w-full"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded w-full transition"
            >
              Send Message
            </button>
          </form>
        </div>

     
      </div>
    </div>
  );
};

export default ContactPage;
