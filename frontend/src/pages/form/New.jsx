import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

const ComplaintFeedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // useEffect(() => {
  //   // Check if user has already given feedback
  //   const alreadySubmitted = localStorage.getItem("complaintFeedbackGiven");
  //   if (alreadySubmitted) {
  //     setSubmitted(true);
  //   }
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    setLoading(true);
    // setSubmitted(true);
    try {
      await axios.post(
        "http://localhost:4000/api/v1/auth/giveFeedback",
        { rating, description },
        { withCredentials: true }
      );

      // Mark feedback as given
      // localStorage.setItem("complaintFeedbackGiven", "true");
      setSubmitted(true);
    } catch (error) {
      alert(error.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-6 rounded shadow-md text-center max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-green-600">🎉 Thank You!</h2>
        <p className="mt-2 text-gray-700">
          Your complaint has been successfully submitted and will be reviewed
          by our cybercrime team. Your feedback helps us improve our services
          and respond more effectively.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          Stay safe online. If you have urgent concerns, call our helpline:
          <br /> <span className="font-semibold">1930</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        How was your complaint submission experience?
      </h2>

      {/* Star Rating */}
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={30}
            className={`cursor-pointer transition-colors duration-200 ${(hover || rating) >= star ? "text-blue-500" : "text-gray-300"
              }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          />
        ))}
      </div>

      {/* Description */}
      <textarea
        className="w-full border rounded p-2 mb-4 focus:outline-none"
        rows="4"
        placeholder="Tell us more about your experience..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 rounded text-white transition ${loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
};

export default ComplaintFeedback;
