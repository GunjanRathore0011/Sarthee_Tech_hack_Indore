import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

function CyberCrimeForm() {
  const [delay, setDelay] = useState(false);
  const [lostMoney, setLostMoney] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Financial Fraud',
    subCategory: '',
    description: '',
    lost_money: 0,
    incident_datetime: '',
    reson_of_delay: '',
    delay_in_report: false,
    files: []
  });

  const [accData, setAccData] = useState({
    accountNumber: '',
    lost_money: '',
    bankName: '',
    ifscCode: '',
    transactionId: '',
    transactionDate: '',
  });

  const subCategorys = [
    "Banking Fraud", "UPI / Wallet Fraud", "Loan Fraud", "Investment Scam",
    "Online Shopping Fraud", "Insurance Fraud", "Job/Work-from-Home Scam",
    "Lottery/Prize/KYC Scam", "ATM Skimming", "Online Loan App Harassment"
  ];

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    formData.files.forEach((file) => data.append('file', file));

    data.append('category', formData.category);
    data.append('subCategory', formData.subCategory);
    data.append('description', formData.description);
    data.append('incident_datetime', formData.incident_datetime);
    data.append('delay_in_report', delay);
    data.append('reason_of_delay', formData.reson_of_delay);
    data.append('lost_money', lostMoney ? formData.lost_money : 0);

    if (lostMoney) {
      Object.entries(accData).forEach(([key, value]) => data.append(key, value));
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/auth/complaintInformation', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert("✅ Complaint submitted successfully!");
    } catch (error) {
      console.error("❌ Error during submission:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-[60%] bg-white p-8 rounded-xl shadow-md border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Cyber Crime Complaint</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Category (Fixed)</label>
            <select
              value={formData.category}
              disabled
              className="w-full bg-gray-100 text-gray-700 border border-gray-300 p-3 rounded-md"
            >
              <option value="Financial Fraud">Financial Fraud</option>
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Subcategory</label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            >
              <option value="">Select Subcategory</option>
              {subCategorys.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Incident Date */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Incident Date & Time</label>
            <input
              type="datetime-local"
              value={formData.incident_datetime}
              onChange={(e) => setFormData({ ...formData, incident_datetime: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />
          </div>

          {/* Lost Money */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Did you lose money?</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="lostMoney" checked={lostMoney} onChange={() => setLostMoney(true)} />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="lostMoney" checked={!lostMoney} onChange={() => setLostMoney(false)} />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Lost Money Details */}
        {lostMoney && (
          <>
            <div className="mt-6">
              <label className="block mb-2 font-semibold text-gray-700">Amount Lost</label>
              <input
                type="number"
                value={formData.lost_money}
                onChange={(e) => setFormData({ ...formData, lost_money: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {[
                { name: "accountNumber", label: "Account Number" },
                { name: "bankName", label: "Bank Name" },
                { name: "ifscCode", label: "IFSC Code" },
                { name: "transactionId", label: "Transaction ID" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 font-semibold text-gray-700">{field.label}</label>
                  <input
                    type="text"
                    value={accData[field.name]}
                    onChange={(e) => setAccData({ ...accData, [field.name]: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-md"
                    required
                  />
                </div>
              ))}
              {/* Transaction Date */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Transaction Date</label>
                <input
                  type="date"
                  value={accData.transactionDate}
                  onChange={(e) => setAccData({ ...accData, transactionDate: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-md"
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Delay Section */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-700">Any delay in reporting?</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="radio" name="delay" checked={delay} onChange={() => setDelay(true)} />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="delay" checked={!delay} onChange={() => setDelay(false)} />
              No
            </label>
          </div>

          {delay && (
            <input
              type="text"
              placeholder="Reason for delay"
              value={formData.reson_of_delay}
              onChange={(e) => setFormData({ ...formData, reson_of_delay: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md mt-4"
              required
            />
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-700">Description</label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-md"
            placeholder="Minimum 200 characters"
            required
          ></textarea>
          <p className={`text-sm mt-1 ${formData.description.length < 200 ? 'text-red-600' : 'text-green-600'}`}>
            {formData.description.length < 200
              ? `⚠️ ${200 - formData.description.length} more characters required`
              : '✅ Character limit met'}
          </p>
        </div>

        {/* File Upload */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-700">Upload Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-gray-700 file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md file:mr-4 hover:file:bg-blue-700 border border-gray-300 p-2 rounded-md bg-gray-50"
          />
          {formData.files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
              {formData.files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="mt-8 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700">
          Submit Complaint
        </Button>
      </form>
    </div>
  );
}

export default CyberCrimeForm;
