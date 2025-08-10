import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiRefreshCcw } from 'react-icons/fi';
import logoImage from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/ReduxSlice/user/userSlice';
import { setuserAdditionalDetailsField, setAdditionDetail, resetAllFormData } from '@/ReduxSlice/formData/formSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', otp: '', captchaInput: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [loadingOtp, setLoadingOtp] = useState(false);   // Loading for OTP button
  const [loadingRegister, setLoadingRegister] = useState(false); // Loading for Register button
  // Generate CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);
    // Clear the captcha input field
    setFormData((prev) => ({ ...prev, captchaInput: '' }));
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoadingOtp(true); // Start loading


    try {
      await axios.post('http://localhost:4000/api/v1/auth/sendOTPforSignIn', {
        email: formData.email,
      });
      toast.success('OTP sent successfully!');
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    }
    finally {
      setLoadingOtp(false); // Stop loading
    }
  };

  const handleLogin = async () => {
    const { email, otp, captchaInput } = formData;
         if(!otpSent){
          toast.error('Please send OTP first.');
          return;
         }

    if (!email || !otp || !captchaInput) {
      toast.error('Please fill all fields.');
      return;
    }

    if (captchaInput !== captcha) {
      toast.error('Incorrect CAPTCHA');
      generateCaptcha();
      return;
    }
    setLoadingRegister(true); // Start loading

    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/auth/signin',
        { email, otp: Number(otp) },
        { withCredentials: true }
      );

      dispatch(resetAllFormData());
      const { user, additionalDetails } = response.data;
      dispatch(loginSuccess({ user }));

      if (additionalDetails) {
        dispatch(setAdditionDetail(additionalDetails));
        dispatch(setuserAdditionalDetailsField({ fill: 1 }));
      }

      navigate('/');
    } catch (error) {
      toast.error("Invalid Otp or email")
    }
    finally {
      setLoadingRegister(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <img src={logoImage} alt="Cyber Sentinel Logo" className="h-12 w-auto mx-auto mb-2" />
          <h2 className="text-xl font-semibold">Welcome Back to Cyber Sentinel</h2>
          <p className="text-sm text-gray-500">Secure login with your registered email</p>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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
                required
              />
            </div>
          </div>

          {/* OTP Input */}
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
                  maxLength={6}
                  onChange={(e) => {
                    if (/^\d{0,6}$/.test(e.target.value)) handleChange(e);
                  }}
                  disabled={!otpSent}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loadingOtp} // Disable during loading
                className={`text-blue-600 cursor-pointer border text-sm border-blue-600 px-2 py-1 rounded transition 
                                    ${loadingOtp ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'hover:bg-blue-50'}`}
              >
                {loadingOtp ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </div>

          {/* CAPTCHA + Input in same line */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 border rounded bg-gray-200 font-mono tracking-widest select-none">
              {captcha}
            </span>
            <FiRefreshCcw
              onClick={generateCaptcha}
              className="cursor-pointer text-gray-600 hover:text-black"
              size={20}
            />
            <input
              type="text"
              name="captchaInput"
              placeholder="Enter CAPTCHA"
              className="flex-grow border rounded px-2 py-1 focus:outline-none"
              value={formData.captchaInput}
              onChange={handleChange}
              required
            />

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loadingRegister} // Disable during loading
            className={`w-full py-2 rounded text-white transition 
                            ${loadingRegister ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loadingRegister ? 'loging...' : 'Log in'}

          </button>
        </form>

        {/* Footer */}
        <p className="text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
        <p className="text-xs text-gray-400 mt-2">All activity is monitored for your safety</p>
      </div>
    </div>
  );
};

export default Login;
