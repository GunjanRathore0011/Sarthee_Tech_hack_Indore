import React, { useState } from 'react';

function SuspectForm() {
    const [suspectData, setSuspectData] = useState({
        name: '',
        suspectedCard: 'Other',
        photo: null,
        details: '',
        suspectedCardNumber: '', // fixed spelling
    });

    const socialMedia = [
        "WhatsApp",
        "Instagram",
        "Facebook",
        "Website",
        "Snapchat",
        "Twitter",
        "LinkedIn",
        "YouTube",
        "Telegram",
        "Contact Number"
    ];

    const [charCount, setCharCount] = useState(250);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'details') {
            if (value.length <= 250) {
                setSuspectData(prev => ({ ...prev, [name]: value }));
                setCharCount(250 - value.length);
            }
        } else {
            setSuspectData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setSuspectData(prev => ({ ...prev, photo: file }));
        } else {
            alert('File size should be less than 5MB');
        }
    };

    const handleSubmit = () => {
        console.log('Form Submitted:', suspectData);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🚨 Suspect Details</h2>

            <div className="bg-blue-100 text-blue-800 p-3 rounded text-sm mb-6">
                ℹ Please share the details of the suspect. Any information provided will be kept confidential and may help during the investigation.
            </div>

            {/* Suspect Name */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Suspect Name ( if you know) </label>
                <input
                    type="text"
                    name="name"
                    value={suspectData.name}
                    onChange={handleChange}
                    placeholder="Enter suspect name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                />
            </div>

            {/* Social Media Type Dropdown */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Any Other Details about Suspect</label>
                <select
                    name="suspectedCard"
                    value={suspectData.suspectedCard}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                >
                    <option value="Other">Other</option>
                    {socialMedia.map((media) => (
                        <option key={media} value={media}>{media}</option>
                    ))}
                </select>
            </div>

            {/* Dynamic Input Field */}
            {suspectData.suspectedCard && suspectData.suspectedCard !== 'Other' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {suspectData.suspectedCard} info
                    </label>
                    <input
                        type={suspectData.suspectedCard === "Contact Number" ? "tel" : "text"}
                        name="suspectedCardNumber"
                        value={suspectData.suspectedCardNumber}
                        onChange={handleChange}
                        placeholder={`Enter ${suspectData.suspectedCard}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
            )}

            {/* Photo Upload */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Suspect Photo</label>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handlePhotoUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:bg-gray-50 hover:file:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Allowed formats: JPG, JPEG, PNG (Max: 5MB)</p>
            </div>

            {/* Textarea for Other Details */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Any other information / details</label>
                <textarea
                    name="details"
                    value={suspectData.details}
                    onChange={handleChange}
                    maxLength={250}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter any additional information (max 250 characters)"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                    {charCount} characters left
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={() => console.log('Back clicked')}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Preview & Next
                </button>
            </div>
        </div>
    );
}

export default SuspectForm;
