import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import {
  setFinancialFraudAcc,
  setFinancialFraudForm
} from '@/ReduxSlice/formData/formSlice';

function CyberCrimeForm({ onNext }) {
  const dispatch = useDispatch();

  const savedFormData = useSelector((state) => state.formData.financialFraud.formData);
  const savedAccData = useSelector((state) => state.formData.financialFraud.accData);

  const [delay, setDelay] = useState(savedFormData?.delay_in_report || false);
  const [lostMoney, setLostMoney] = useState(!!savedFormData?.lost_money);

  const [formData, setFormData] = useState(savedFormData || {
    category: 'Financial Fraud',
    subCategory: '',
    description: '',
    lost_money: 0,
    incident_datetime: '',
    reson_of_delay: '',
    delay_in_report: false,
    files: []
  });

  const [accData, setAccData] = useState(savedAccData || {
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

  useEffect(() => {
    dispatch(setFinancialFraudForm({
      ...formData,
      delay_in_report: delay,
      lost_money: lostMoney ? formData.lost_money : 0
    }));
  }, [formData, delay, lostMoney, dispatch]);

  useEffect(() => {
    if (lostMoney) {
      dispatch(setFinancialFraudAcc(accData));
    }
  }, [accData, lostMoney, dispatch]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.description || !formData.incident_datetime || (lostMoney && !accData.accountNumber)) {
      alert("Please fill required fields.");
      return;
    }

    if (onNext) onNext(); // ✅ move to next step
  };

  return (
    <div className="flex justify-center bg-gray-50 py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-lg border border-gray-200"
      >
        <h2 className="text-4xl font-bold text-blue-700 mb-8 text-center">Cyber Crime Complaint</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category (Disabled) */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              disabled
              className="w-full bg-gray-100 text-gray-700 border border-gray-300 p-3 rounded-md cursor-not-allowed"
            >
              <option value="Financial Fraud">Financial Fraud</option>
            </select>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Subcategory</label>
            <select
              value={formData.subCategory}
              onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Subcategory</option>
              {subCategorys.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Incident Date & Time */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Incident Date & Time</label>
            <input
              type="datetime-local"
              value={formData.incident_datetime}
              onChange={(e) => setFormData({ ...formData, incident_datetime: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Money Lost */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Did you lose money?</label>
            <div className="flex gap-6 mt-2">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="lostMoney" checked={lostMoney} onChange={() => setLostMoney(true)} />
                Yes
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="lostMoney" checked={!lostMoney} onChange={() => setLostMoney(false)} />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Lost Money Details */}
        {lostMoney && (
          <>
            <div className="mt-8">
              <label className="block mb-2 text-sm font-medium text-gray-700">Amount Lost</label>
              <input
                type="number"
                value={formData.lost_money}
                onChange={(e) => setFormData({ ...formData, lost_money: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                { name: "accountNumber", label: "Account Number" },
                { name: "bankName", label: "Bank Name" },
                { name: "ifscCode", label: "IFSC Code" },
                { name: "transactionId", label: "Transaction ID" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-2 text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type="text"
                    value={accData[field.name]}
                    onChange={(e) => setAccData({ ...accData, [field.name]: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Transaction Date</label>
                <input
                  type="date"
                  value={accData.transactionDate}
                  onChange={(e) => setAccData({ ...accData, transactionDate: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Delay Section */}
        <div className="mt-8">
          <label className="block mb-2 text-sm font-medium text-gray-700">Any delay in reporting?</label>
          <div className="flex gap-6 mt-2">
            <label className="inline-flex items-center gap-2">
              <input type="radio" name="delay" checked={delay} onChange={() => setDelay(true)} />
              Yes
            </label>
            <label className="inline-flex items-center gap-2">
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
              className="w-full border border-gray-300 p-3 rounded-md mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
        </div>

        {/* Description */}
        <div className="mt-8">
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="mt-8">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="block w-full text-gray-700 file:bg-blue-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-md hover:file:bg-blue-700 border border-gray-300 p-2 rounded-md bg-gray-50"
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

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save & Next
          </button>
        </div>

      </form>
    </div>


  );
}

export default CyberCrimeForm;
