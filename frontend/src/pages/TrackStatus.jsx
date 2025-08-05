import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; // adjust this path if needed

const TrackStatus = () => {
  const [complaintId, setComplaintId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleTrack = () => {
    if (!complaintId.trim()) return;
    setSubmitted(true);
    // Here you would call API to fetch complaint status using complaintId
    console.log("Tracking Complaint ID:", complaintId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md border">
        <h2 className="text-3xl font-semibold text-blue-700 text-center mb-6">Track Your Cyber Complaint</h2>

        <p className="text-gray-700 text-center mb-6">
          Stay informed about the status of your cyber crime complaint. Enter your <span className="font-medium">Complaint ID</span> below to track your case. We are committed to delivering justice with speed and transparency.
        </p>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter Complaint ID"
            value={complaintId}
            onChange={(e) => {
              setComplaintId(e.target.value);
              setSubmitted(false);
            }}
            className="flex-1 border border-gray-300 rounded-md p-3 text-sm"
          />
          <Button
            type="button"
            onClick={handleTrack}
            disabled={!complaintId.trim()}
            className={`px-6 py-3 font-semibold rounded-md ${complaintId.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Track
          </Button>
        </div>

        {submitted && (
          <div className="mt-6 text-center text-gray-600">
            🔍 Tracking Complaint ID: <strong>{complaintId}</strong><br />
            (This is just a placeholder. API integration goes here.)
          </div>
        )}

        <hr className="my-8" />

        <div className="text-gray-700 text-sm">
          <p className="mb-2">🔐 <strong>Important:</strong> Only authorized users can access complaint status. Do not share your Complaint ID with anyone.</p>
          <p>📢 In case of emergencies, call the National Cyber Helpline at <strong>1930</strong> or visit <a href="https://cybercrime.gov.in" className="text-blue-600 hover:underline">cybercrime.gov.in</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default TrackStatus;
