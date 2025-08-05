import React, { useState } from 'react';

function OtherCrimeForm() {
  const [delay, setDelay] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [formData, setFormData] = useState({
    category: 'Other Crime',
    description: '',
    incident_datetime: '',
    reson_of_delay: '',
    delay_in_report: delay,
    subCategory: ''
  });

  // Handle file input
  const handleFileChange = (e) => {
    setUploadedFiles(Array.from(e.target.files));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <form className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide">
          🛡️ Report Other Crime
        </h2>

        {/* Category */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 transition"
            required
          >
            <option value="Other Crime">Other Crime</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Vandalism">Vandalism</option>
            <option value="Fraud">Fraud</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Incident */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold text-gray-700">Date of Incident</label>
          <input
            type="datetime-local"
            name="incident_datetime"
            value={formData.incident_datetime}
            onChange={(e) => setFormData({ ...formData, incident_datetime: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, reson_of_delay: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-blue-400 transition"
            rows="4"
            placeholder="Provide a detailed description of the incident (min 200 characters)"
            required
          ></textarea>
          <p
            className={`text-sm mt-1 ${
              formData.description.length < 200 ? 'text-red-600' : 'text-green-600'
            }`}
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
          {uploadedFiles.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit Button (you can hook this to actual API later) */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
}

export default OtherCrimeForm;
