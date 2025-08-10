import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiRefreshCcw } from 'react-icons/fi';
import logoImage from '../assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetAllFormData } from '@/ReduxSlice/formData/formSlice';
import { loginSuccess } from '@/ReduxSlice/user/userSlice';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        otp: '',
    });

    const [otpSent, setOtpSent] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const [loadingOtp, setLoadingOtp] = useState(false);   // Loading for OTP button
    const [loadingRegister, setLoadingRegister] = useState(false); // Loading for Register button

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Generate twisted CAPTCHA
    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let text = '';
        for (let i = 0; i < 5; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(text);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSendOtp = async () => {
        if (!formData.email) {
            toast.error("Enter your email address");            
            return;
        }

        setLoadingOtp(true); // Start loading
        try {
            const response = await axios.post(
                'http://localhost:4000/api/v1/auth/sendOTPforSignUp',
                { email: formData.email },
                { withCredentials: true }
            );
            toast.success("OTP sent successfully!");
            setOtpSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoadingOtp(false); // Stop loading
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // CAPTCHA verification
        if (captchaInput.trim().toUpperCase() !== captcha) {
            toast.error("Incorrect CAPTCHA");
            generateCaptcha();
            setCaptchaInput('');
            return;
        }

        if (!otpSent) {
            toast.error("Please send OTP first");
            return;
        }

        const payload = {
            userName: formData.fullName,
            email: formData.email,
            number: Number(formData.mobile),
            otp: Number(formData.otp),
        };

        setLoadingRegister(true); // Start loading
        try {
            const res = await axios.post('http://localhost:4000/api/v1/auth/signup', payload, { withCredentials: true });
            toast.success("Registration successful!");
            dispatch(resetAllFormData());
            dispatch(loginSuccess({ user: res.data.user }));
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoadingRegister(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
                <div className="mb-6">
                    <img src={logoImage} alt="Logo" className="h-12 w-auto mx-auto mb-2" />
                    <h2 className="text-xl font-semibold">Create a New Account</h2>
                    <p className="text-sm text-gray-500">Enter your details to register for Cyber Sentinel services.</p>
                </div>

                <form onSubmit={handleRegister}>
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
                            required
                        />
                    </div>

                    {/* Email */}
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
                                required
                            />
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div className="flex items-center border rounded px-2">
                            <FiPhone className="text-gray-400" />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Enter 10-digit number"
                                className="w-full p-2 focus:outline-none"
                                value={formData.mobile}
                                maxLength={10}
                                onChange={(e) => {
                                    if (/^\d{0,10}$/.test(e.target.value)) {
                                        handleChange(e);
                                    }
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* OTP */}
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                name="otp"
                                placeholder="******"
                                className="w-full p-2 border rounded focus:outline-none"
                                value={formData.otp}
                                onChange={handleChange}
                                disabled={!otpSent}
                                required
                                maxLength={6}
                            />
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

                    {/* CAPTCHA + Input */}
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className="px-4 py-2 border rounded bg-gray-100 font-mono text-lg tracking-widest select-none"
                            style={{
                                transform: 'rotate(-2deg)',
                                letterSpacing: '3px',
                                fontWeight: 'bold',
                                userSelect: 'none',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {captcha}
                        </div>
                        <FiRefreshCcw
                            className="text-gray-500 cursor-pointer hover:text-gray-700"
                            size={20}
                            onClick={() => {
                                generateCaptcha();
                                setFormData((prev) => ({ ...prev, captchaInput: '' }));
                            }}
                            style={{ minWidth: '20px' }}
                        />
                        <input
                            type="text"
                            name="captchaInput"
                            placeholder="Enter CAPTCHA"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            className="border rounded px-3 py-2 focus:outline-none flex-grow"
                            style={{
                                height: '44px',
                                fontSize: '1rem',
                            }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loadingRegister} // Disable during loading
                        className={`w-full py-2 rounded text-white transition 
                            ${loadingRegister ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loadingRegister ? 'Registering...' : 'Register Now'}
                    </button>
                </form>

                <p className="text-sm mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
