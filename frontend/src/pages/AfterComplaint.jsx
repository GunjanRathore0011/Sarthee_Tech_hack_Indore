import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FeedbackForm from './form/New';

function AfterComplaint() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get the passed data
    const responseData = location.state?.responseData;
    console.log('Response Data:', responseData);

    // Redirect if no data (page opened directly)
    if (!responseData) {
        navigate("/");
        return null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center my-8">
                Complaint Submitted Successfully
            </h1>

            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Your Complaint Details</h2>
                <p><strong>Complaint ID:</strong> {responseData._id}</p>
                <p><strong>Status:</strong> {responseData.status}</p>
                {/* <p><strong>Description:</strong> {responseData.description}</p> */}
                <p><strong>Date Submitted:</strong> {new Date(responseData.date).toLocaleDateString()}</p>
            </div>

            <div className="max-w-2xl mx-auto mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <FeedbackForm />
            </div>
        </div>
    );
}

export default AfterComplaint;
