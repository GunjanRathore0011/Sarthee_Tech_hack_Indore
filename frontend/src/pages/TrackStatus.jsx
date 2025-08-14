import React, { useState } from 'react';
import axios from 'axios';
// import FeedbackForm from './form/FeedbackForn';
import ComplaintFeedback from './form/New';
import { toast } from 'react-toastify';

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showHindi, setShowHindi] = useState(true);

  const handleTrack = async () => {
    if (!complaintId.trim()) return;
    setSubmitted(false);
    setComplaintData(null);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/auth/complaintStatus/${complaintId}`,
        { withCredentials: true }
      );

      if (response.data?.success) {
        setComplaintData(response.data);
        setSubmitted(true);
      } else {
        toast.error('Complaint not found!');
      }
    } catch (error) {
      console.error('Error tracking complaint:', error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const toggleLanguage = () => {
    setShowHindi((prev) => !prev);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-3xl transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4 text-center">
          Track Your Cyber Complaint
        </h2>
        <p className="text-center text-gray-600 mb-8 text-base">
          Enter your <b>Complaint ID</b> below to check the status of your case.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Complaint ID"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="flex-1 border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition rounded-md px-4 py-2 text-gray-800"
          />
          <button
            onClick={handleTrack}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
            disabled={!complaintId.trim()}
          >
            Track
          </button>
        </div>

        {submitted && complaintData && (
          <div className="space-y-6 mt-8">
            <div className="p-4 bg-green-100 border border-green-300 rounded-lg shadow-sm">
              <p className="text-lg font-semibold text-green-800">
                ✅ Complaint Found & Processed
              </p>
              <p className="text-sm text-gray-700">Complaint ID: <b>{complaintData.complaintId}</b></p>
              <p className="text-sm text-gray-700">Current Status: <b className="text-blue-700">{complaintData.currentStatus}</b></p>
            </div>

            {/* Complaint History Timeline */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">📜 Complaint History</h3>
              <div className="border-l-2 border-blue-500 pl-4 space-y-6">
                {complaintData.fullHistory.map((entry, index) => (
                  <div key={entry._id} className="relative pl-4">
                    <div className="absolute -left-3 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                    <p className="text-sm text-gray-500 mb-1">{formatDate(entry.updatedAt)}</p>
                    <p className="text-blue-700 font-semibold mb-1">{entry.status}</p>
                    <p className="text-gray-700 text-sm">{entry.remark}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-sm mt-8 text-gray-700 space-y-2">
          <p className="flex items-start gap-2">
            🔐 <strong>Important:</strong> Do not share your Complaint ID with unauthorized individuals.
          </p>
          <p className="flex items-start gap-2">
            ☎️ In emergencies, call National Cyber Helpline at <b>1930</b>
          </p>
        </div>

        {/* Feedback Section */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-3 italic text-sm md:text-base">
            {showHindi
              ? '📢 अब तक की प्रगति को देखते हुए, आपकी राय हमारे लिए महत्वपूर्ण है। कृपया अपनी प्रतिक्रिया दें।'
              : '📢 Considering the progress so far, your opinion is important to us. Please share your feedback.'}
          </p>

          <button
            onClick={toggleLanguage}
            className="text-sm text-blue-500 underline mb-3 block"
          >
            {showHindi ? 'Show in English' : 'हिंदी में दिखाएं'}
          </button>

          <button
            onClick={() => setFeedbackVisible(!feedbackVisible)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition font-medium"
          >
            {feedbackVisible ? 'Hide Feedback' : 'Give Feedback'}
          </button>

          {/* Inline Feedback Form */}
          {feedbackVisible && (
            <div className="mt-6">
              {/* <FeedbackForm/> */}
              <ComplaintFeedback/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;
