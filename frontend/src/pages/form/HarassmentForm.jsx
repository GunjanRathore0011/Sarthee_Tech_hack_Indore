import React, { useState } from 'react';
import axios from 'axios';
const subCategoryOptions = [
  'Sexual Harassment',
  'Verbal Abuse',
  'Physical Abuse',
  'Cyberbullying',
  'Stalking',
  'Discrimination',
];

const HarassmentForm = () => {
  const [delay, setDelay] = useState('No');

  const [formData, setFormData] = useState({
    category: 'Harassment',
    subCategory: '',
    incident_datetime: '',
    description: '',
    reson_of_delay: '',
    delay_in_report: delay,
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelayChange = (e) => {
    const value = e.target.value;
    setDelay(value);
    setFormData((prev) => ({
      ...prev,
      delay_in_report: value,
      reson_of_delay: value === 'Yes' ? prev.reson_of_delay : '',
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let newErrors = {};
    if (formData.description.length < 200) {
      newErrors.description = 'Description must be at least 200 characters.';
    }

    if (delay === 'Yes' && formData.reson_of_delay.trim() === '') {
      newErrors.reson_of_delay = 'Please provide a reason for the delay.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Log final data
    const completeData = {
      ...formData,
      files,
    };
     
    const response = await axios.post('http://localhost:4000/api/v1/auth/complaintInformation', completeData, {
      headers: {    
        'Content-Type': 'multipart/form-data',
      },
        withCredentials: true, // Send session cookie
    });
    if (response.data.success) {
        alert('Complaint submitted successfully!');
    }
    else {
        alert('Failed to submit complaint: ' + response.data.message);
    }
    
    console.log('Submitted Data:', completeData);
    // Send to backend if needed
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Harassment Complaint Form</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            readOnly
            className="w-full p-2 rounded border bg-gray-100"
          />
        </div>

        {/* Subcategory */}
        <div>
          <label className="block mb-1 font-semibold">Subcategory</label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Subcategory</option>
            {subCategoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Incident Datetime */}
        <div>
          <label className="block mb-1 font-semibold">Incident Date & Time</label>
          <input
            type="datetime-local"
            name="incident_datetime"
            value={formData.incident_datetime}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-semibold">Description (min 200 characters)</label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Delay in Report */}
        <div>
          <label className="block mb-2 font-semibold">Delay in Reporting?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="delay"
                value="Yes"
                checked={delay === 'Yes'}
                onChange={handleDelayChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="delay"
                value="No"
                checked={delay === 'No'}
                onChange={handleDelayChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Reason for Delay */}
        {delay === 'Yes' && (
          <div>
            <label className="block mb-1 font-semibold">Reason for Delay</label>
            <input
              type="text"
              name="reson_of_delay"
              value={formData.reson_of_delay}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.reson_of_delay && (
              <p className="text-red-600 text-sm mt-1">{errors.reson_of_delay}</p>
            )}
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="block mb-1 font-semibold">Upload Files (Images, Docs etc.)</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default HarassmentForm;
