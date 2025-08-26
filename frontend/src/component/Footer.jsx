import React from 'react'
import { FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <>
         <footer className="bg-gradient-to-r from-[#0473fb] to-[#042c70] text-white pt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-30">
        
        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-3">CyberSentinel</h2>
          <p className="text-sm text-gray-100 leading-relaxed">
            Empowering digital safety through awareness, reporting, and 
            AI-powered threat detection. Stay safe, stay informed.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/file-complaint" className="hover:underline">File Complaint</a></li>
            <li><a href="/track-status" className="hover:underline">Track Status</a></li>
            <li><a href="/awareness" className="hover:underline">Awareness</a></li>
            <li><a href="/contact-us" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
        
        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
          <p className="text-sm">24/7 Cybercrime Helpline</p>
          <p className="text-sm font-semibold">Dial 1930</p>
          <p className="text-sm mt-2">Email: support@cybersentinel.gov.in</p>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="mt-8 border-t border-white/20 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <p className="text-sm text-gray-200">
            © {new Date().getFullYear()} CyberSentinel | Government of Madhya Pradesh. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 text-gray-200">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaTwitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaLinkedin size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}

export default Footer