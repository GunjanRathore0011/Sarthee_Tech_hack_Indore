import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { resetAllFormData, setAdditionDetail } from '@/ReduxSlice/formData/formSlice';
import { setuserAdditionalDetailsField } from '@/ReduxSlice/formData/formSlice';


const AdditionalDetail = ({ onNext }) => {
    const savedFormData = useSelector((state) => state.formData.additionDetail);

    const dispatch = useDispatch();

    const [formData, setFormData] = useState(savedFormData || {
        fullName: '',
        dob: '',
        gender: '',
        house: '',
        street: '',
        colony: '',
        state: 'Madhya Pradesh',
        district: '',
        policeStation: '',
        pincode: '',
        files: []
    });
    console.log('📝 Saved Form Data:', savedFormData);
    const districts = [
        "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur",
        "Chachaura", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad",
        "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Maihar", "Mandla", "Mandsaur", "Morena", "Nagda",
        "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni",
        "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
    ];


    const handleChange = (e) => {
        const updatedForm = { ...formData, [e.target.name]: e.target.value };
        setFormData(updatedForm);
        dispatch(setAdditionDetail(updatedForm)); // ✅ update store
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            const updated = { ...formData, files: file };
            setFormData(updated);
            dispatch(setAdditionDetail(updated));
        } else {
            alert('File size should be less than 5MB');
        }
    };

    const apiCall = async () => {
        try {
            console.log('📤 Submitting to API with data:', formData);

            const fd = new FormData();

            // Append all fields
            fd.append('fullName', formData.fullName);
            fd.append('dob', formData.dob);
            fd.append('gender', formData.gender);
            fd.append('house', formData.house);
            fd.append('street', formData.street);
            fd.append('colony', formData.colony);
            fd.append('state', formData.state);
            fd.append('district', formData.district);
            fd.append('policeStation', formData.policeStation);
            fd.append('pincode', formData.pincode);

            // Append file
            if (formData.files) {
                fd.append('file', formData.files); // 👈 field name should match backend
            }

            const response = await axios.post(
                'http://localhost:4000/api/v1/auth/additionalDetails',
                fd,
                {
                    headers: {
                        // DO NOT manually set Content-Type
                    },
                    withCredentials: true, // 👈 sends session cookie
                }
            );

            const data = response.data;

            if (data.success) {
                alert('✅ Additional Details registered successfully!');
                dispatch(setuserAdditionalDetailsField({ fill: 1 }));
                onNext();
            } else {
                alert('⚠ Failed to register Additional Details: ' + data.message);
            }

        } catch (error) {
            console.error('❌ Error during API call:', error);
            alert('An error occurred: ' + (error.response?.data?.message || error.message));
        }
    };
    const userFilled = useSelector((state) => state.formData.userAdditionalDetailsField.fill);
    console.log('User Filled Additional Details:', userFilled);

    useEffect(() => {
        if (userFilled) {
            onNext();
        }

    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                alert(`${key} is required`);
                return;
            }
        }

        // If validation passes, call API
        console.log('Submitting to API...');
        apiCall();
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Additional Details</h2>

            {/* Full Name */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                    max="2008-12-31"
                />
            </div>

            {/* Gender */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* House */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">House No. / Building Name</label>
                <input
                    type="text"
                    name="house"
                    value={formData.house}
                    onChange={handleChange}
                    placeholder="e.g., Plot 123, Gandhi Apts."
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

         

            {/* Colony */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Colony / Area</label>
                <input
                    type="text"
                    name="colony"
                    value={formData.colony}
                    onChange={handleChange}
                    placeholder="e.g., Shivaji Nagar"
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

               {/* Street */}
            <div className="mb-4">
                <label className="block mb-1 font-medium"> City</label>
                <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g., Main Street, near Post Office"
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            {/* State */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">State</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                />
            </div>

            {/* District */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">District</label>
                <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="">Select District</option>
                    {districts.map((dist, index) => (
                        <option key={index} value={dist}>{dist}</option>
                    ))}
                </select>
            </div>

            {/* Police Station */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Police Station</label>
                <input
                    type="text"
                    name="policeStation"
                    value={formData.policeStation}
                    onChange={handleChange}
                    placeholder="Enter Police Station Name"
                    className="w-full border p-2 rounded"
                    required
                />
            </div>

            {/* Pincode */}
            <div className="mb-6">
                <label className="block mb-1 font-medium">Pincode</label>
                <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d{0,6}$/.test(val)) {
                            handleChange(e);
                        }
                    }}
                    placeholder="Enter 6-digit pincode"
                    className="w-full border p-2 rounded"
                    maxLength={6}
                    required
                />
            </div>

            {/* Photo Upload */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload a goverment ID</label>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handlePhotoUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded file:bg-gray-50 hover:file:bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Allowed formats: JPG, JPEG, PNG (Max: 5MB)</p>
            </div>

            <button
                type="submit"

                className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700"
            >
                Save & Next
            </button>
        </form>
    );
};

export default AdditionalDetail;
