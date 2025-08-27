// src/components/TopBanner.jsx
import React from "react";
import satymev from "../assets/images/satymev.png"
import Ilogo from "../assets/images/I4C_logo.png"
import smart_city from "../assets/images/smart_city.png"


const TopBanner = () => {
    return (
        <div className="w-full border-b border-gray-300">
            {/* TOP STRIP */}
            <div className="w-full bg-blue-900 text-white text-xs">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1">
                    {/* Left: Govt Name */}
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">मध्यप्रदेश शासन</span>
                        <span className="border-l border-white h-4"></span>
                        <span className="font-semibold">Government of Madhya Pradesh</span>
                    </div>

                    {/* Right utilities (language / accessibility / login) */}
                    <div className="flex gap-2">
                    </div>

                </div>
            </div>


            {/* BOTTOM STRIP */}
            <div className="w-full ">
                <div className="max-w-7xl mx-auto flex justify-between  items-center px-4 py-2">
                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-4">
                        <img
                            src={satymev}
                            alt="Gov Logo"
                            className="h-18 w-auto object-contain"
                        />
                        <span className="border-l border-black h-12"></span>

                        <img
                            src={Ilogo}
                            alt="logo"
                            className="h-12 w-auto object-contain"
                        ></img>
                        <div className="flex flex-col ">
                            <span className=" font-bold text-black">
                                इन्दौर साइबर अपराध रिपोर्टिंग पोर्टल
                            </span>
                            <span className=" font-bold text-black">
                                Indore Cyber Crime Reporting Portal
                            </span>
                        </div>
                    </div>

                    {/* CENTER SECTION */}


                    {/* RIGHT SECTION */}
                    <div className="flex items-center gap-4">

                        <img
                            src={smart_city}
                            alt="Azadi Logo"
                            className="h-18 object-contain"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBanner;
