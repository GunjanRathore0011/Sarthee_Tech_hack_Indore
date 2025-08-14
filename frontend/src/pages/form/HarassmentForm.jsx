import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHarassment } from '@/ReduxSlice/formData/formSlice';

const subCategoryOptions = [
  'Sexual Harassment',
  'Verbal Abuse',
  'Physical Abuse',
  'Cyberbullying',
  'Stalking',
  'Discrimination',
];

const HarassmentForm = ({ onNext }) => {
  const dispatch = useDispatch();
  const harassmentData = useSelector((state) => state.formData.harassment);

  const [delay, setDelay] = useState(harassmentData.delay_in_report ? 'Yes' : 'No'); 
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(harassmentData);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 20 * 1024 * 1024) {
      const updated = { ...formData, files: file };
      setFormData(updated);
      dispatch(setHarassment(updated));
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const minLength = 200;
  const maxLength = 1500;

  useEffect(() => {
    dispatch(setHarassment(formData));
  }, [formData, dispatch]);

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
      delay_in_report: value === 'Yes',
      reson_of_delay: value === 'Yes' ? prev.reson_of_delay : '',
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const completeData = {
      ...formData,
    };

    console.log('Submitted Data:', completeData);
    dispatch(setHarassment(completeData));


    onNext(); // Proceed to next step
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg mt-6 border">
  <h2 className="text-xl font-bold px-4 py-3 border-b">Harassment Complaint Form</h2>

  <form onSubmit={handleSubmit} className="p-4 space-y-4">
    {/* Category */}
    <div>
      <label className="block text-sm font-medium mb-1">Category</label>
      <input
        type="text"
        name="category"
        value={formData.category}
        readOnly
        className="w-full p-2 rounded border bg-gray-100 text-sm"
      />
    </div>

    {/* Subcategory */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Subcategory <span className="text-red-500">*</span>
      </label>
      <select
        name="subCategory"
        value={formData.subCategory}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded text-sm"
      >
        <option value="">Select Subcategory</option>
        {subCategoryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>

    {/* Incident Datetime */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Incident Date & Time <span className="text-red-500">*</span>
      </label>
      <input
        type="datetime-local"
        name="incident_datetime"
        value={formData.incident_datetime}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded text-sm"
      />
    </div>

    {/* Description */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Description <span className="text-red-500">*</span>
      </label>
      <textarea
        name="description"
        rows="4"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Provide a detailed description (min 200 characters)"
        required
        minLength={minLength}
        maxLength={maxLength}
      ></textarea>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formData.description.length} characters</span>
        <span>{maxLength - formData.description.length} left</span>
      </div>

      {errors?.description && (
        <p className="text-red-600 text-xs mt-1">{errors.description}</p>
      )}
    </div>

    {/* Delay in Report */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Delay in Reporting? <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="delay"
            value="Yes"
            checked={delay === "Yes"}
            onChange={handleDelayChange}
          />
          Yes
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="delay"
            value="No"
            checked={delay === "No"}
            onChange={handleDelayChange}
          />
          No
        </label>
      </div>
    </div>

    {/* Reason for Delay */}
    {delay === "Yes" && (
      <div>
        <label className="block text-sm font-medium mb-1">
          Reason for Delay <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="reson_of_delay"
          value={formData.reson_of_delay}
          onChange={handleChange}
          className="w-full p-2 border rounded text-sm"
          required
        />
        {errors.reson_of_delay && (
          <p className="text-red-600 text-xs mt-1">{errors.reson_of_delay}</p>
        )}
      </div>
    )}

    {/* File Upload */}
    <div>
      <label className="block text-sm font-medium mb-1">Upload Files</label>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1.5 file:rounded hover:file:bg-blue-700 border border-gray-300 p-1.5 rounded bg-gray-50"
      />
    </div>

    {/* Uploaded Files */}
    {formData.files && formData.files.length > 0 && (
      <div>
        <h4 className="font-medium text-sm mb-1">Uploaded Files:</h4>
        <ul className="space-y-2">
          {formData.files.map((file, index) => {
            const isImage = file.type && file.type.startsWith("image/");
            const fileURL = URL.createObjectURL(file);

            return (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div>
                  <p className="font-medium">{file.name || `File ${index + 1}`}</p>
                  {isImage && (
                    <img
                      src={fileURL}
                      alt={`Preview ${index + 1}`}
                      className="mt-1 w-20 h-20 object-cover rounded border"
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    )}

    {/* Save & Next */}
    <div className="flex justify-end">
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-1.5 rounded text-sm font-medium hover:bg-blue-700"
      >
        Save & Next
      </button>
    </div>
  </form>
</div>

  );
};

export default HarassmentForm;
