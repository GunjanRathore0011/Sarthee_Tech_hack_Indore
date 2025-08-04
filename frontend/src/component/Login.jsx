import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import logoImage from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: ''
  });

  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

    // Inside component:
    const handleSendOtp = async () => {
        if (!formData.email) {
            alert('Please enter your email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/v1/auth/sendOTPforSignIn', {
                email: formData.email,
            });

            console.log('OTP sent response:', response.data);
            alert('OTP sent successfully!');
            setOtpSent(true);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        }
    };

const handleLogin = async () => {
  const { email, otp } = formData;

  if (!email || !otp) {
    alert('Please enter both Email and OTP.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:4000/api/v1/auth/signin', {
      email,
      otp: Number(otp),
    });

    console.log('Login successful:', response.data);
    alert('Login successful!');
    // TODO: Store token / redirect user
    // Example:
    // localStorage.setItem('token', response.data.token);
    // navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    alert('Invalid OTP or email. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        {/* Logo & Header */}
        <div className="mb-6">
          <img src={logoImage} alt="Cyber Sentinel Logo" className="h-12 w-auto mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Welcome Back to Cyber Sentinel</h2>
          <p className="text-sm text-gray-500">Secure login with your registered email</p>
        </div>

        {/* Email Input */}
        <div className="text-left mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="flex items-center border rounded px-2">
            <FiMail className="text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full p-2 focus:outline-none"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* OTP + Send OTP */}
        <div className="text-left mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
          <div className="flex gap-2 items-center">
            <div className="flex items-center border rounded px-2 flex-grow">
              <FiLock className="text-gray-400" />
              <input
                type="text"
                name="otp"
                placeholder="******"
                className="w-full p-2 focus:outline-none"
                value={formData.otp}
                onChange={handleChange}
                disabled={!otpSent}
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition"
            >
              Send OTP
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Login Securely
        </button>

        {/* Footer */}
        <p className="text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>

        <p className="text-xs text-gray-400 mt-2">
          All activity is monitored for your safety
        </p>
      </div>
    </div>
  );
};

export default Login;
