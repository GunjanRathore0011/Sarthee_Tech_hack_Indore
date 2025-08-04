import React from 'react'
import { useState } from 'react';
import { Button } from "@/components/ui/button";

function CyberCrimeForm() {
  const [delay, setDelay] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    description: '',
    lost_money: 0,
    incident_datetime: '',
    reson_of_delay: '',
    delay_in_report: delay,
  });

  const subCategorys = ["Banking Fraud", "UPI / Wallet Fraud", "Loan Fraud", "Investment Scam", "Online Shopping Fraud", "Insurance Fraud",
    "Job/Work-from-Home Scam", "Lottery/Prize/KYC Scam", "ATM Skimming", "Online Loan App Harassment"];


  const [accData, setAccData] = useState({
    accountNumber: '',
    lost_money: '',
    bankName: '',
    ifscCode: '',
    transactionId: '',
    transactionDate: '',
  })


  const [lostMoney, setLostMoney] = useState(false);

  return (
    <div>
      <form className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Cyber Crime Complaint Form</h2>
        {/* Category */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="Financial Fraud">Financial Fraud</option>
            <option value="Harassment or Abuse">Harassment or Abuse</option>
            <option value="Other Cyber Crimes">Other Cyber Crimes</option>
          </select>
        </div>

        {/* SubCategory */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">subCategory</label>
          <select
            name="district"
            value={formData.subCategory}
            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select subCategory</option>
            {subCategorys.map((dist, index) => (
              <option key={index} value={dist}>
                {dist}
              </option>
            ))}
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

        {/* {lost money or not} */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Have you lost money?</label>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="lostMoney"
                value="yes"
                checked={lostMoney === true}
                onChange={() => setLostMoney(true)}
                className="mr-2"
              />
              <span className="text-gray-700">Yes</span>
            </div>

            <div className="flex items-center">
              <input
                type="radio"
                name="lostMoney"
                value="no"
                checked={lostMoney === false}
                onChange={() => setLostMoney(false)}
                className="mr-2"
              />
              <span className="text-gray-700">No</span>
            </div>
          </div>
        </div>

        {/* If lost money, show these fields */}
        {lostMoney === true && (
          <>
            {/* lost_money Lost */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                lost_money Lost <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="lost_money"
                value={formData.lost_money}
                onChange={(e) => setFormData({ ...formData, lost_money: e.target.value })}
                placeholder="Enter lost_money lost"
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Grid of 2 inputs per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Number */}
              <div>
                <label className="block mb-1 font-medium">
                  Account No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={accData.accountNumber}
                  onChange={(e) => setAccData({ ...accData, accountNumber: e.target.value })}
                  placeholder="Account Number"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block mb-1 font-medium">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={accData.bankName}
                  onChange={(e) => setAccData({ ...accData, bankName: e.target.value })}
                  placeholder="Bank Name"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block mb-1 font-medium">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={accData.ifscCode}
                  onChange={(e) => setAccData({ ...accData, ifscCode: e.target.value })}
                  placeholder="IFSC Code"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block mb-1 font-medium">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="transactionId"
                  value={accData.transactionId}
                  onChange={(e) => setAccData({ ...accData, transactionId: e.target.value })}
                  placeholder="Transaction ID"
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Transaction Date */}
              <div>
                <label className="block mb-1 font-medium">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="transactionDate"
                  value={accData.transactionDate}
                  onChange={(e) => setAccData({ ...accData, transactionDate: e.target.value })}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>
          </>
        )}

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

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">
          Submit Complaint
        </Button>

      </form>
    </div>
  )
}

export default CyberCrimeForm
