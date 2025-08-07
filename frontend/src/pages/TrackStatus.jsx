import React, { useState } from 'react';
import axios from 'axios';

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showHindi, setShowHindi] = useState(true);

  const handleTrack = async () => {
    if (!complaintId.trim()) return;
    try {
      const response = await axios.get(`/api/track-complaint/${complaintId}`, {
        withCredentials: true,
      });

      if (response.data) {
        console.log('Complaint Data:', response.data);
        setSubmitted(true);
      } else {
        alert('Complaint not found!');
      }
    } catch (error) {
      console.error('Error tracking complaint:', error);
      alert('Error tracking complaint.');
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) return;

    try {
      await axios.post(
        '/api/feedback',
        { feedback: feedbackText },
        { withCredentials: true }
      );
      alert('Thanks for your feedback!');
      setFeedbackText('');
      setFeedbackVisible(false);
    } catch (err) {
      console.error('Feedback error:', err);
      alert('Failed to submit feedback');
    }
  };

  const toggleLanguage = () => {
    setShowHindi((prev) => !prev);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-2xl transition-all duration-300">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4 text-center">
          Track Your Cyber Complaint
        </h2>
        <p className="text-center text-gray-600 mb-8 text-base">
          Stay informed about the status of your cyber crime complaint. Enter your{' '}
          <b>Complaint ID</b> below to track your case.
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

        {submitted && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-md text-green-800">
            ✅ Complaint is being processed.
          </div>
        )}

        <div className="text-sm mt-4 text-gray-700 space-y-2">
          <p className="flex items-start gap-2">
            🔐 <strong>Important:</strong> Only authorized users can access complaint status. Do not share your Complaint ID.
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

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="text-sm text-blue-500 underline mb-3 block"
          >
            {showHindi ? 'Show in English' : 'हिंदी में दिखाएं'}
          </button>

          {/* Feedback Btn */}
          <button
            onClick={() => setFeedbackVisible(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition font-medium"
          >
            Give Feedback
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackVisible && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg animate-fade-in-up">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Feedback</h3>
            <textarea
              rows="5"
              className="w-full border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition rounded-md p-3 text-gray-800"
              placeholder="Write your experience or feedback here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <div className="text-right mt-4 flex justify-end gap-3">
              <button
                onClick={() => setFeedbackVisible(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition font-medium"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackComplaint;
