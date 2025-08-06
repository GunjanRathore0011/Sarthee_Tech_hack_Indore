import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setNextStep } from '@/ReduxSlice/formData/formSlice';
import axios from 'axios';

export default function PreviewForm({ onBack }) {
  const additionalDetail = useSelector((state) => state.formData.additionDetail);
  const suspectData = useSelector((state) => state.formData.suspectData);
  const harassment = useSelector((state) => state.formData.harassment);
  const financialFraud = useSelector((state) => state.formData.financialFraud.formData);
  const financialAcc = useSelector((state) => state.formData.financialFraud.accData);

  const otherCrime = useSelector((state) => state.formData.otherCrime);
  console.log("suspesctData", suspectData);

  const category = useSelector((state) => state.formData.categoryKey.value);
  console.log('Category:', category);

  const renderCrimeDetails = () => {
    switch (category) {
      case 'harassment':
        return (
          <div>
            <h3>Harassment Details</h3>
            <p><strong>Subcategory:</strong> {harassment.subCategory}</p>
            <p><strong>Description:</strong> {harassment.description}</p>
            <p><strong>Date & Time:</strong> {harassment.incident_datetime}</p>
            <p><strong>Delay:</strong> {harassment.delay_in_report ? 'Yes' : 'No'}</p>
            <p><strong>Reason for Delay:</strong> {harassment.reson_of_delay}</p>
          </div>
        );
      case 'financial_fraud':
        return (
          <div>
            <h3>Financial Fraud Details</h3>
            <p><strong>Subcategory:</strong> {financialFraud.subCategory}</p>
            <p><strong>Description:</strong> {financialFraud.description}</p>
            <p><strong>Lost Money:</strong> ₹{financialFraud.lost_money}</p>
            <p><strong>Date & Time:</strong> {financialFraud.incident_datetime}</p>
            <p><strong>Delay:</strong> {financialFraud.delay_in_report ? 'Yes' : 'No'}</p>
            <p><strong>Reason for Delay:</strong> {financialFraud.reson_of_delay}</p>

            {/* Conditional File Display */}
            {financialFraud.files && financialFraud.files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Uploaded Files:</h4>
                <ul className="list-disc ml-5">
                  {financialFraud.files.map((file, index) => (
                    <li key={index}>{file.name || `File ${index + 1}`}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conditional Bank Details Display */}
            {(financialAcc.accountNumber || financialAcc.bankName || financialAcc.transactionId) && (
              <div className="mt-4">
                <h4 className="font-semibold">Bank Transaction Details:</h4>
                {financialAcc.accountNumber && <p><strong>Account Number:</strong> {financialAcc.accountNumber}</p>}
                {financialAcc.bankName && <p><strong>Bank Name:</strong> {financialAcc.bankName}</p>}
                {financialAcc.ifscCode && <p><strong>IFSC Code:</strong> {financialAcc.ifscCode}</p>}
                {financialAcc.transactionId && <p><strong>Transaction ID:</strong> {financialAcc.transactionId}</p>}
                {financialAcc.transactionDate && <p><strong>Transaction Date:</strong> {financialAcc.transactionDate}</p>}
                {financialAcc.lost_money && <p><strong>Lost Amount (via Bank):</strong> ₹{financialAcc.lost_money}</p>}
              </div>
            )}
          </div>
        );
      case 'other':
        return (
          <div>
            <h3>Other Crime Details</h3>
            <p><strong>Subcategory:</strong> {otherCrime.subCategory}</p>
            <p><strong>Description:</strong> {otherCrime.description}</p>
            <p><strong>Date & Time:</strong> {otherCrime.incident_datetime}</p>
            <p><strong>Delay:</strong> {otherCrime.delay_in_report ? 'Yes' : 'No'}</p>
            <p><strong>Reason for Delay:</strong> {otherCrime.reson_of_delay}</p>
          </div>
        );
      default:
        return <p>No crime data available.</p>;
    }
  };
  const dispatch = useDispatch();

  const submithandler = async () => {
    try {
      let payload = {};

      if (category === 'financial_fraud') {
        payload = {
          ...financialFraud,
          ...financialAcc,
          ...suspectData,
        };
      } else if (category === 'harassment') {
        payload = {
          ...harassment,
          ...suspectData,
        };
      } else if (category === 'other') {
        payload = {
          ...otherCrime,
          ...suspectData,
        };
      }
      console.log('Payload to submit:', payload);
      const { data } = await axios.post('http://localhost:4000/api/v1/auth/complaintInformation', payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 👈 Send session cookie
        }
      );

      if (data.success) {
        alert('✅ Form submitted successfully!');
        dispatch(resetAllFormData());
      } else {
        alert('⚠️ Error submitting form: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Axios submission error:', error);
      alert('❌ Network/server error while submitting form.');
    }
  };


  return (
    <div className="p-6 border rounded shadow-md space-y-6">
      <h2 className="text-xl font-bold mb-4">Preview Your Submission</h2>

      <div>
        <h3>Additional Details</h3>
        <p><strong>Name:</strong> {additionalDetail.fullName}</p>
        <p><strong>DOB:</strong> {additionalDetail.dob}</p>
        <p><strong>Gender:</strong> {additionalDetail.gender}</p>
        <p><strong>Address:</strong> {additionalDetail.house}, {additionalDetail.street}, {additionalDetail.colony}</p>
        <p><strong>District:</strong> {additionalDetail.district}</p>
        <p><strong>Police Station:</strong> {additionalDetail.policeStation}</p>
        <p><strong>Pincode:</strong> {additionalDetail.pincode}</p>
      </div>

      <div>{renderCrimeDetails()}</div>

      <div>
        <h3>Suspect Details</h3>
        <p><strong>Name:</strong> {suspectData.name}</p>
        <p><strong>Card Type:</strong> {suspectData.suspectedCard}</p>
        <p><strong>Card Number:</strong> {suspectData.suspectedCardNumber}</p>
        <p><strong>Details:</strong> {suspectData.details}</p>
        {suspectData.suspectFile instanceof File && (
          <div>
            <strong>suspectFile:</strong>
            <img
              src={URL.createObjectURL(suspectData.suspectFile)}
              alt="Suspect"
              className="w-40 h-auto border mt-2"
            />
          </div>
        )}

      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Back
        </button>
        <button
          onClick={submithandler}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
