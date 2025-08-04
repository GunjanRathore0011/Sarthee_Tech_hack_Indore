import React, { useState } from 'react';
import { FiMail, FiPhone } from 'react-icons/fi';
import logoImage from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        otp: '',
    });

    const [otpSent, setOtpSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Inside component:
    const handleSendOtp = async () => {
        if (!formData.email) {
            alert('Please enter your email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/v1/auth/sendOTPforSignUp', {
                email: formData.email,
            });

            console.log('OTP sent response:', response.data);
            alert('OTP sent successfully!');
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        }
    };

    const handleRegister = async () => {
        const payload = {
            userName: formData.fullName,
            email: formData.email,
            number: Number(formData.mobile),
            otp: Number(formData.otp),
        };

        try {
            const res = await axios.post('http://localhost:4000/api/v1/auth/signup', payload);
            console.log('Response:', res.data);
            alert('Registered successfully!');
        } catch (err) {
            console.error('Registration error:', err);
            alert('Something went wrong during registration.');
        }
    };
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
                {/* Header */}
                <div className="mb-6">
                    <img src={logoImage} alt="Logo" className="h-12 w-auto mx-auto mb-2" />
                    <h2 className="text-xl font-semibold">Create a New Account</h2>
                    <p className="text-sm text-gray-500">Enter your details to register for Cyber Sentinel services.</p>
                </div>

                {/* Full Name */}
                <div className="text-left mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        className="w-full p-2 border rounded focus:outline-none"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>

                {/* Email Address */}
                <div className="text-left mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center border rounded px-2">
                        <FiMail className="text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            className="w-full p-2 focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Mobile Number */}
                <div className="text-left mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <div className="flex items-center border rounded px-2">
                        <FiPhone className="text-gray-400" />
                        <input
                            type="text"
                            name="mobile"
                            placeholder="+91"
                            className="w-full p-2 focus:outline-none"
                            value={formData.mobile}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* OTP and Send OTP */}
                <div className="text-left mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
                    <input
                        type="text"
                        name="otp"
                        placeholder="******"
                        className="w-full p-2 border rounded mb-2 focus:outline-none"
                        value={formData.otp}
                        onChange={handleChange}
                        disabled={!otpSent}
                    />
                    <button
                        onClick={handleSendOtp}
                        className="w-full text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
                    >
                        Send OTP
                    </button>
                </div>

                {/* Register Button */}
                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Register Now
                </button>

                {/* Footer */}
                <p className="text-sm mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
