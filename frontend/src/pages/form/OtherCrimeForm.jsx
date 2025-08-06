import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOtherCrime } from '@/ReduxSlice/formData/formSlice';
import { Button } from "@/components/ui/button";

function OtherCrimeForm({ onNext }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.formData.otherCrime);

  // Delay state synced with Redux formData
  const [delay, setDelay] = useState(formData.delay_in_report);

  // Sync delay_in_report in Redux when delay state changes
  useEffect(() => {
    dispatch(setOtherCrime({ ...formData, delay_in_report: delay }));
  }, [delay]);

  // Update form field to Redux
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setOtherCrime({ ...formData, [name]: value }));
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const updated = { ...formData, files: file };
      dispatch(setOtherCrime(updated));
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.description.length < 200) {
      alert("Description must be at least 200 characters.");
      return;
    }
    console.log('Other Crime Data:', formData);

    onNext(); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide">
          🛡️ Report Other Crime
        </h2>

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

        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">SubCategory</label>
          <select
            name="subCategory"
            value={formData.subCategory || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="">Select SubCategory</option>
            <option value="Hacking">Hacking</option>
            <option value="Cyberbullying">Cyberbullying</option>
            <option value="Identity Theft">Identity Theft</option>
            <option value="Online Defamation">Online Defamation</option>
            <option value="Phishing (non-financial)">Phishing (non-financial)</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
            <option value="Social Media Abuse">Social Media Abuse</option>
          </select>
        </div>

        {/* Date of Incident */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Date of Incident</label>
          <input
            type="datetime-local"
            name="incident_datetime"
            value={formData.incident_datetime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        {/* Delay in Reporting */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Is there any delay in reporting?</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="delay"
                value="yes"
                checked={delay === true}
                onChange={() => setDelay(true)}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="radio"
                name="delay"
                value="no"
                checked={delay === false}
                onChange={() => setDelay(false)}
              />
              No
            </label>
          </div>
        </div>

        {/* Reason for Delay */}
        {delay && (
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-gray-700">Reason for Delay</label>
            <input
              type="text"
              name="reson_of_delay"
              value={formData.reson_of_delay}
              onChange={handleChange}
              placeholder="Enter reason for delay"
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 transition"
            rows="4"
            placeholder="Provide a detailed description of the incident (min 200 characters)"
            required
          ></textarea>
          <p
            className={`text-sm mt-1 ${formData.description.length < 200 ? 'text-red-600' : 'text-green-600'}`}
          >
            {formData.description.length < 200
              ? `⚠️ At least 200 characters required. Current: ${formData.description.length}`
              : '✅ Character requirement met.'}
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Upload Supporting Files (images, documents, etc.)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full border border-gray-300 p-3 rounded-md text-gray-600 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition"
          />
          {formData.files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
              {formData.files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Submit Complaint
        </Button>
      </form>
    </div>
  );
}

export default OtherCrimeForm;
