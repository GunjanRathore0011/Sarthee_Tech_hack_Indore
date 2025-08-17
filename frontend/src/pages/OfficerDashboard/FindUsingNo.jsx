import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    if (phoneNo.length < 10) {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Find Details Using Phone Number</h1>

      {/* Input Section */}
      <div className="flex items-center gap-3 mb-4 w-full max-w-md">
        <input
          type="number"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          placeholder="Enter phone number"
          className="flex-grow p-2 border rounded text-sm"
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

          <div className="p-4 space-y-6 bg-gradient-to-r from-blue-500 to-blue-800 text-white">
            {phoneData.map((person, index) => (
              <div key={index} className="rounded-lg border border-black p-3">
                <h3 className="text-lg font-semibold mb-2">
                  {person.fullName || "Unknown Name"}
                </h3>
                <p><strong>Father's Name:</strong> {person.fatherName || "N/A"}</p>

                {person.documentNumber && (
                  <p>
                    <strong>{person.documentType || "Document"}:</strong>{" "}
                    {person.documentNumber}
                  </p>
                )}

                {/* Telephones */}
                {person.telephones?.length > 0 && (
                  <div className="mt-2">
                    <strong>Telephones:</strong>
                    <ul className="list-disc ml-5">
                      {person.telephones.map((tel, i) => (
                        <li key={i}>{tel}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Addresses */}
                {person.addresses?.length > 0 && (
                  <div className="mt-2">
                    <strong>Addresses:</strong>
                    <ul className="list-disc ml-5">
                      {person.addresses.map((addr, i) => (
                        <li key={i}>{addr}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Regions */}
                {person.regions?.length > 0 && (
                  <div className="mt-2">
                    <strong>Regions:</strong>
                    <ul className="flex flex-wrap gap-2 mt-1">
                      {person.regions.map((region, i) => (
                        <span
                          key={i}
                          className="bg-white text-blue-700 px-2 py-1 rounded-full text-sm font-medium"
                        >
                          {region}
                        </span>
                      ))}
                    </ul>
                  </div>
                )}
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
    </div>
  );
}

export default FindUsingNo;
