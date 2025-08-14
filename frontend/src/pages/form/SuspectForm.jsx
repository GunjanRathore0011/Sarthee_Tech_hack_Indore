import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSuspectData } from '@/ReduxSlice/formData/formSlice';

function SuspectForm({ onNext, onBack }) {
  const suspectData = useSelector((state) => state.formData.suspectData);
  const dispatch = useDispatch();

  const [suspectD, setSuspectD] = useState(suspectData || {
    suspectedName: '',
    suspectedCard: 'Other',
    suspectedFile: null,
    details: '',
    suspectedCardNumber: '',
  });

  const [charCount, setCharCount] = useState(250);

  const socialMedia = [
    "WhatsApp", "Instagram", "Facebook", "Website", "Snapchat",
    "Twitter", "LinkedIn", "YouTube", "Telegram", "Contact Number"
  ];

  useEffect(() => {
    setCharCount(250 - (suspectD.details?.length || 0));
  }, []);

  // useEffect(() => {
  //   suspectD.suspectedCardNumber ="";
  //   dispatch(setSuspectData(suspectD));
  // }, [suspectD.suspectedCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...suspectD, [name]: value };

    if (name === 'details') {
      if (value.length <= 250) {
        setSuspectD(updated);
        setCharCount(250 - value.length);
        dispatch(setSuspectData(updated));
      }
    } else {
      setSuspectD(updated);
      dispatch(setSuspectData(updated));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const updated = { ...suspectD, suspectedFile: file };
      setSuspectD(updated);
      dispatch(setSuspectData(updated));
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🕵️‍♂️ Suspect Data Saved in Redux:', suspectD);
    onNext();
  };

  return (
   <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-xl mt-8 border border-blue-200">
  {/* Heading */}
  <h2 className="text-xl font-bold mb-3 text-blue-700 flex items-center gap-2">
    🚨 Suspect Details
  </h2>

  {/* Info Banner */}
  <div className="bg-blue-50 text-blue-800 p-2 rounded-lg text-sm mb-4 border border-blue-100">
    ℹ️ Please share the details of the suspect. All information will be kept confidential and may help during the investigation.
  </div>

  {/* Suspect Name */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-blue-900 mb-1">Suspect Name (if known)</label>
    <input
      type="text"
      name="suspectedName"
      value={suspectD.suspectedName}
      onChange={handleChange}
      placeholder="Enter suspect name"
      className="w-full px-3 py-1.5 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Social Media / Suspect Info Dropdown */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-blue-900 mb-1">Any Known Identity</label>
    <select
      name="suspectedCard"
      value={suspectD.suspectedCard}
      onChange={handleChange}
      className="w-full px-3 py-1.5 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="Other">Other</option>
      {socialMedia.map((media) => (
        <option key={media} value={media}>{media}</option>
      ))}
    </select>
  </div>

  {/* Dynamic Field Based on Selection */}
  {suspectD.suspectedCard && suspectD.suspectedCard !== 'Other' && (
    <div className="mb-3">
      <label className="block text-sm font-medium text-blue-900 mb-1">{suspectD.suspectedCard} Info</label>
      <input
        type={suspectD.suspectedCard === "Contact Number" ? "tel" : "text"}
        name="suspectedCardNumber"
        value={suspectD.suspectedCardNumber}
        onChange={handleChange}
        placeholder={`Enter ${suspectD.suspectedCard}`}
        className="w-full px-3 py-1.5 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )}

  {/* Photo Upload */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-blue-900 mb-1">Upload Suspect Photo</label>
    <input
      type="file"
      accept=".jpg,.jpeg,.png"
      onChange={handlePhotoUpload}
      className="block w-full text-sm text-gray-700 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1.5 file:rounded-md file:mr-3 hover:file:bg-blue-700 border border-blue-200 p-1.5 rounded-md bg-blue-50"
    />
    <p className="text-xs text-gray-500 mt-1">Allowed formats: JPG, JPEG, PNG (Max: 5MB)</p>
  </div>

  {/* Additional Info */}
  <div className="mb-3">
    <label className="block text-sm font-medium text-blue-900 mb-1">Any other information / details</label>
    <textarea
      name="details"
      value={suspectD.details}
      onChange={handleChange}
      maxLength={250}
      rows={3}
      className="w-full px-3 py-1.5 border border-blue-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Enter any additional information (max 250 characters)"
    />
    <div className="text-right text-xs text-gray-500 mt-1">
      {charCount} characters left
    </div>
  </div>

  {/* Navigation Buttons */}
  <div className="flex justify-between pt-2">
    <button
      onClick={onBack}
      type="button"
      className="px-4 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md"
    >
      Back
    </button>
    <button
      onClick={handleSubmit}
      type="button"
      className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
    >
      Next 
    </button>
  </div>
</div>
  );
}

export default SuspectForm;
