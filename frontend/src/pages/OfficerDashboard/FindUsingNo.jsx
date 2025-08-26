import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent } from "@/components/ui/dialog";

import 'leaflet/dist/leaflet.css';

function FindUsingNo() {
  const [countryCode, setCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [phoneData, setPhoneData] = useState(null);
  const [phoneNo, setPhoneNo] = useState('');
  const [error, setError] = useState('');

  const handleNumberFind = async () => {
    if (!phoneNo.trim()) {
      setError('Please enter a phone number');
      return;
    }
    if (phoneNo.length < 12) {
      setError('Phone number must be at least 10 digits');
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    setError('');
    setLoading(true);
    setPhoneData(null);

    try {
      const response = await axios.post("http://localhost:4000/telegram/ask", { query: phoneNo });
      console.log(response.data);
      setPhoneData(response.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch phone details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">

        Enter Phone Number</h1>

      {/* Input Section */}
      <div className="flex items-center gap-3 mb-4 w-full max-w-md">
        <input
          type="number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          placeholder="Enter phone number"
          className="flex-grow p-2 border rounded text-sm bg-white"
        />
        <button
          onClick={handleNumberFind}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition text-sm font-medium"
        >
          {loading ? 'Finding...' : 'Find'}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Show details only when we have phoneData */}
     {phoneData && phoneData.length > 0 && (
  <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-3xl mt-6">
    <div className="bg-gradient-to-r from-blue-400 to-blue-800 px-4 py-2">
      <h2 className="text-white font-semibold">Phone Number Details</h2>
    </div>

    <div className="p-4 space-y-6 text-black">
      {phoneData.map((person, index) => (
        <div key={index} className="rounded-lg border border-black p-3">
          {Object.entries(person).map(([key, value], i) => (
            <div key={i} className="mt-2">
              <strong className="capitalize">{key}:</strong>{" "}
              
              {/* Agar value array hai toh list me dikhao */}
              {Array.isArray(value) ? (
                <ul className="list-disc ml-5">
                  {value.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ) : (
                <span>{value || "N/A"}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)}


      {/* Optional: Show "no results" only AFTER searching */}
      {phoneData && phoneData.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 text-gray-600 mt-6 w-full max-w-3xl">
          No phone data found. Please try a different number.
        </div>
      )}
      <Dialog open={loading} onOpenChange={() => { }}>
        <DialogContent
          className="flex items-center justify-center p-0 border-none bg-transparent shadow-none"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center w-[600px] h-[320px] space-y-6 p-6">

              {/* Circle Loader with Counter */}
              <div className="relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-500 border-t-transparent"></div>
                {/* <span className="absolute text-2xl font-bold text-blue-600">
                     {count}
                   </span> */}
              </div>

              <p className="text-lg font-semibold text-gray-700">
                Please wait...
              </p>
              <p className="text-sm text-gray-500">Finding details using 10+ resources</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FindUsingNo;
