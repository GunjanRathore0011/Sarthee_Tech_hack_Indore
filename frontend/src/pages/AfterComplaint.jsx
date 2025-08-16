import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaFilePdf } from "react-icons/fa";
import axios from "axios";

function AfterComplaint() {
    const location = useLocation();
    const navigate = useNavigate();
    const responseData = location.state?.responseData;

    if (!responseData) {
        navigate("/");
        return null;
    }

    const complaint = responseData.data || responseData;
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Check if feedback already given for this complaint
    useEffect(() => {
        if (complaint?._id) {
            const storedStatus = localStorage.getItem(`feedback_${complaint._id}`);
            if (storedStatus === "submitted") {
                setSubmitted(true);
            }
        }
    }, [complaint?._id]);

    const handleOpenPDF = () => {
        if (complaint.reportpdf) {
            window.open(complaint.reportpdf, "_blank");
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!rating) {
            alert("Please select a rating before submitting.");
            return;
        }
        setLoading(true);
        try {
            await axios.post(
                "http://localhost:4000/api/v1/auth/giveFeedback",
                { rating, description, complaintId: complaint._id },
                { withCredentials: true }
            );
            localStorage.setItem(`feedback_${complaint._id}`, "submitted");
            setSubmitted(true);
        } catch (error) {
            alert(error.response?.data || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 px-4">
            <h1 className="text-3xl font-bold text-center mb-5 text-blue-700">
                Complaint Submitted Successfully
            </h1>

            {/* <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* LEFT: Complaint Details */}
                <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                        Your Complaint Details
                    </h2>

                    <div className="space-y-4 text-gray-700">
                        <p>
                            <span className="font-medium text-gray-500">Complaint ID:</span>{" "}
                            <span className="text-blue-600 font-semibold">
                                {complaint._id}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium text-gray-500">Category:</span>{" "}
                            {complaint.category}
                        </p>
                        <p>
                            <span className="font-medium text-gray-500">Subcategory:</span>{" "}
                            {complaint.subCategory}
                        </p>
                        <p>
                            <span className="font-medium text-gray-500">Incident Date:</span>{" "}
                            {complaint.incident_datetime
                                ? new Date(complaint.incident_datetime).toLocaleString()
                                : "N/A"}
                        </p>
                        <p>
                            <span className="font-medium text-gray-500">Date Submitted:</span>{" "}
                            {complaint.createdAt
                                ? new Date(complaint.createdAt).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    {/* Status History
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3 text-gray-800">Status History</h3>
                        <div className="space-y-4">
                            {complaint.statusHistory?.map((status, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border"
                                >
                                    <div className="w-3 h-3 mt-2 rounded-full bg-blue-500"></div>
                                    <div>
                                        <p className="font-medium">{status.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    {/* View PDF */}
                    {complaint.reportpdf && (
                        <div className="mt-6">
                            <button
                                onClick={handleOpenPDF}
                                className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600 shadow-md"
                            >
                                <FaFilePdf /> View PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* RIGHT: Feedback Form */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 justify-center flex flex-col items-center">
                    {submitted ? (
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
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                How was your complaint submission experience?
                            </h2>

                            {/* Star Rating */}
                            <div className="flex space-x-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={30}
                                        className={`cursor-pointer transition-colors duration-200 ${(hover || rating) >= star
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                ))}
                            </div>

                            {/* Description */}
                            <textarea
                                className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                rows="4"
                                placeholder="Tell us more about your experience..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitFeedback}
                                disabled={loading}
                                className={`w-full py-3 rounded-lg text-white font-medium transition ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {loading ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </>
                    )}
                </div>

            </div>

            {/* Info Section below both cards */}
            <div className="mt-5 text-center">
                <p className="text-gray-700 text-lg mb-4">
                    Complaint status track करने के लिए <span className="font-semibold text-blue-600">Complaint ID</span> को संभालकर रखें।
                </p>
                <button
                    onClick={() => navigate("/track-status")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition "
                >
                    Track Complaint
                </button>
            </div>


        </div>
    );
}

export default AfterComplaint;
