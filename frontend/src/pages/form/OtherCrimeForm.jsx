import React, { useState } from 'react'

function OtherCrimeForm() {
const [delay, setDelay] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Other Crime',
    description: '',
    incident_datetime : '',
    reson_of_delay  : '',
    delay_in_report :delay,
    subCategory :''
  });
  return (
    <div>
      <form className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Report Other Crime</h2>

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category" 
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target
.value })}

            className="w-full border p-2 rounded"
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
        <div className="mb-4">
          <label className="block mb-1 font-medium">incident_datetime of Incident</label>
          <input
            type="date"
            name="incident_datetime"
            value={formData.incident_datetime}
            onChange={(e) => setFormData({ ...formData, incident_datetime: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        {/* Delay in Reporting */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">is there any delay in reporting?</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="Delay"
                value="yes"
                checked={delay === true}
                onChange={() => setDelay(true)}
                className="mr-2"
              />
              <span className="text-gray-700">Yes</span>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                name="noDelay"
                value="no"
                checked={delay === false}
                onChange={() => setDelay(false)}
                className="mr-2"
              />
              <span className="text-gray-700">No</span>
            </div>
          </div>
        </div>

        {/* {reson of delay} */}
        {delay === true && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Reason for Delay</label>
            <input
              type="text"
              name="reson_of_delay"
              value={formData.reson_of_delay}
              onChange={(e) => setFormData({ ...formData, reson_of_delay: e.target.value })}
              placeholder="Enter reason for delay"
              className="w-full border p-2 rounded"
              required
            />
          </div>)}
          {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Description <span className="text-red-500">*</span>
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border p-2 rounded"
            rows="4"
            placeholder="Provide a detailed description of the incident (min 200 characters)"
            required
          ></textarea>

          {/* Character Validation Message */}
          <p className={`text-sm mt-1 ${formData.description.length < 200 ? 'text-amber-800' : 'text-green-600'}`}>
            {formData.description.length < 200
              ? `⚠️ At least 200 characters required. Current: ${formData.description.length}`
              : '✅ Character requirement met.'}
          </p>
        </div>
      </form>
      
    </div>
  )
}

export default OtherCrimeForm
