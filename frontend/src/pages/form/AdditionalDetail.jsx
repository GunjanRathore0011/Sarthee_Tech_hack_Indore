import React, { useState } from 'react';

const AdditionalDetail = ({ onNext }) => {
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
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur",
    "Chachaura", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad",
    "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Morena", "Nagda",
    "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni",
    "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const apiCall = async () => {
    try {
      // additionalDetails
      const response = await fetch('http://localhost:4000/api/v1/auth/additionalDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('AdditionalDetails registered successfully!');
        onNext(); // ✅ Proceed to next step
      } else {
        alert('Failed to register AdditionalDetails: ' + data.message);
      }
      console.log('Submitting to API with data:', formData);  
      alert('AdditionalDetails registered successfully!');
      onNext(); // ✅ Proceed to next step
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while registering the complaint.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert(`${key} is required`);
        return;
      }
    }

    // If validation passes, call API
    console.log('Submitting to API...');
    apiCall();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Additional Details</h2>

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
          max="2008-12-31"
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

      {/* House */}
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

      {/* Street */}
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

      {/* Colony */}
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

      {/* State */}
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
            <option key={index} value={dist}>{dist}</option>
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
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d{0,6}$/.test(val)) {
              handleChange(e);
            }
          }}
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
        Save & Next
      </button>
    </form>
  );
};

export default AdditionalDetail;
