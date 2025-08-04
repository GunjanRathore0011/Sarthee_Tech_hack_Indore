import React, { useState } from "react";

const CyberCrimeForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "Online Financial Fraud",
    subCategory: "E-Wallet Related Fraud",
    lostMoney: "No",
    incidentDate: "",
    incidentHour: "",
    incidentMinute: "",
    incidentPeriod: "AM",
    delayInReporting: "No",
    incidentLocation: "",
    additionalInfo: "",
    // Step 2 fields
    bankName: "",
    walletId: "",
    transactionId: "",
    amount: "",
    transactionDate: "",
    transactionHour: "",
    transactionMinute: "",
    transactionPeriod: "AM",
    referenceNo: "",
    suspectAccountDetails: "No",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Check Step 1 required fields
    const requiredFields = [
      "category", "subCategory", "lostMoney",
      "incidentDate", "incidentHour", "incidentMinute", "incidentPeriod",
      "delayInReporting", "incidentLocation", "additionalInfo",
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill all required fields in Step 1.");
        return;
      }
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check Step 2 required fields
    const requiredFields = [
      "bankName", "walletId", "transactionId", "amount", "transactionDate",
      "transactionHour", "transactionMinute", "transactionPeriod"
    ];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill all required fields in Step 2.");
        return;
      }
    }

    const submission = new FormData();
    for (const key in formData) {
      submission.append(key, formData[key]);
    }

    // Send to backend
    fetch("/api/submit-complaint", {
      method: "POST",
      body: submission,
    })
      .then((res) => res.json())
      .then((data) => alert("Complaint submitted successfully!"))
      .catch((err) => alert("Error submitting complaint"));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Complaint / Incident Details</h2>

          <div>
            <label>Category of complaint *</label>
            <input type="text" className="input" name="category" value={formData.category} readOnly />
          </div>

          <div>
            <label>Sub-Category of complaint *</label>
            <input type="text" className="input" name="subCategory" value={formData.subCategory} readOnly />
          </div>

          <div>
            <label>Have you lost money? *</label>
            <div className="flex gap-4">
              <label><input type="radio" name="lostMoney" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="lostMoney" value="No" onChange={handleChange} defaultChecked /> No</label>
            </div>
          </div>

          <div>
            <label>Approximate date & time of incident *</label>
            <div className="flex gap-2">
              <input type="date" name="incidentDate" onChange={handleChange} className="input" />
              <input type="number" placeholder="HH" name="incidentHour" onChange={handleChange} className="input w-20" />
              <input type="number" placeholder="MM" name="incidentMinute" onChange={handleChange} className="input w-20" />
              <select name="incidentPeriod" onChange={handleChange} className="input">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          <div>
            <label>Is there any delay in reporting? *</label>
            <div className="flex gap-4">
              <label><input type="radio" name="delayInReporting" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="delayInReporting" value="No" onChange={handleChange} defaultChecked /> No</label>
            </div>
          </div>

          <div>
            <label>Where did the incident occur? *</label>
            <input type="text" name="incidentLocation" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Additional information about the incident * (min 200 chars)</label>
            <textarea name="additionalInfo" rows={4} maxLength={1500} minLength={200} className="input" onChange={handleChange} required />
          </div>

          <button type="button" onClick={handleNext} className="btn-blue mt-4">Save as Draft & Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Victim Account Details</h2>

          <div>
            <label>Bank/Wallet/UPI/Merchant *</label>
            <input type="text" name="bankName" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Account No / Wallet ID / UPI ID *</label>
            <input type="text" name="walletId" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Transaction ID / UTR Number *</label>
            <input type="text" name="transactionId" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Amount *</label>
            <input type="number" name="amount" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Transaction Date *</label>
            <input type="date" name="transactionDate" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Approximate Time *</label>
            <div className="flex gap-2">
              <input type="number" placeholder="HH" name="transactionHour" className="input w-20" onChange={handleChange} />
              <input type="number" placeholder="MM" name="transactionMinute" className="input w-20" onChange={handleChange} />
              <select name="transactionPeriod" onChange={handleChange} className="input">
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>

          <div>
            <label>Reference No</label>
            <input type="text" name="referenceNo" className="input" onChange={handleChange} />
          </div>

          <div>
            <label>Do you have suspect account details? *</label>
            <div className="flex gap-4">
              <label><input type="radio" name="suspectAccountDetails" value="Yes" onChange={handleChange} /> Yes</label>
              <label><input type="radio" name="suspectAccountDetails" value="No" onChange={handleChange} defaultChecked /> No</label>
            </div>
          </div>

          <button type="submit" className="btn-green mt-4">Submit Complaint</button>
        </>
      )}
    </form>
  );
};

export default CyberCrimeForm;
