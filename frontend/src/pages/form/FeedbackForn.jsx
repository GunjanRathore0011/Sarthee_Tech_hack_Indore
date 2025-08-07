import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return alert("Please enter your feedback.");

    try {
      setLoading(true);
      const response = await axios.post(
        '/api/submit-feedback',
        { description: feedback },
        { withCredentials: true } // 🔐 send session cookies
      );

      if (response.status === 200) {
        setSubmitted(true);
        setFeedback('');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Error while submitting feedback. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border shadow-md p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-blue-700">We value your Feedback</h3>

      <textarea
        rows={4}
        placeholder="Write your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </Button>

      {submitted && (
        <p className="text-green-600 mt-4 text-sm text-center">
          ✅ Thank you for your feedback!
        </p>
      )}
    </div>
  );
};

export default FeedbackForm;
