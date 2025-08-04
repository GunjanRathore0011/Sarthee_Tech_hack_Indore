import ComplaintCategory from '@/component/complaintCategory';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CyberCrimeForm from './form/CyberCrimeForm';

const ComplaintForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    house: '',
    street: '',
    colony: '',
    state: 'Madhya Pradesh',
    district: '',
    policeStation: '',
    pincode: ''
  });

  const districts = [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna',
    'Ratlam', 'Dewas', 'Chhindwara', 'Mandsaur', 'Neemuch', 'Shivpuri', 'Vidisha',
    'Betul', 'Seoni', 'Khandwa', 'Dhar', 'Khargone'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const complaintData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) return alert(`${key} is required`);
      complaintData.append(key, value);
    });
    // Send or handle FormData here
    console.log('Complaint Form Submitted');
      navigate("/financial-fraud");
  };

  return (
    <>
    
    <ComplaintCategory></ComplaintCategory>


    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Complaint Form</h2>

      {/* Full Name */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* House Number */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">House No. / Building Name</label>
        <input
          type="text"
          name="house"
          value={formData.house}
          onChange={handleChange}
          placeholder="e.g., Plot 123, Gandhi Apts."
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Street / Locality */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Street / Locality</label>
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="e.g., Main Street, near Post Office"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Colony / Area */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Colony / Area</label>
        <input
          type="text"
          name="colony"
          value={formData.colony}
          onChange={handleChange}
          placeholder="e.g., Shivaji Nagar"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* State (auto-filled) */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">State</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          readOnly
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      {/* District */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">District</label>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select District</option>
          {districts.map((dist, index) => (
            <option key={index} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </div>

      {/* Police Station */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Police Station</label>
        <input
          type="text"
          name="policeStation"
          value={formData.policeStation}
          onChange={handleChange}
          placeholder="Enter Police Station Name"
          className="w-full border p-2 rounded"
          required
        />
      </div>

      {/* Pincode */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter 6-digit pincode"
          className="w-full border p-2 rounded"
          maxLength={6}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700"
      >
        Submit Complaint
      </button>
    </form>

    <CyberCrimeForm></CyberCrimeForm>
    </>
  );
};

export default ComplaintForm;
