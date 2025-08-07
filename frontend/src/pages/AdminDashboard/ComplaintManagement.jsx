import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);

    // Fetch complaints from backend
    const fetchComplaints = async () => {
        try {
            const res= await axios.get('http://localhost:4000/api/v1/admin/dashboard');
            console.log("Fetched complaints:", res.data.data);  
            // Ensure data is array before setting
            if (Array.isArray(res.data.data)) {
                setComplaints(res.data.data);
            } else {
                console.error("Invalid complaints data format:", res.data.data);
                setComplaints([]);
            }

        }
        catch (error) {
            console.error('Error fetching complaints:', error);
        }
           
    }
    useEffect(() => {
        // Temporary static data    
        fetchComplaints();
    }, []);
    console.log("Complaints data:", complaints);
    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 border border-orange-300';
            case 'in progress':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            case 'resolved':
                return 'bg-green-100 text-green-800 border border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800 border border-red-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-800 border border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-300';
        }
    };

    
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>View</TableHead>
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {complaints.map((complaint) => (
                            <TableRow key={complaint._id}>
                                <TableCell>{complaint._id}</TableCell>
                                <TableCell>{complaint.category}</TableCell>
                                <TableCell>{complaint.location}</TableCell>
                                <TableCell>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 ${getStatusStyle(complaint.status)}`}>
                                        {complaint.status.toLowerCase() === 'pending' && <span>🕒</span>}
                                        {complaint.status.toLowerCase() === 'resolved' && <span>✅</span>}
                                        {complaint.status}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getPriorityStyle(complaint.priority)}`}>
                                        {complaint.priority}
                                    </div>
                                </TableCell>

                                <TableCell>{complaint.assignedTo}</TableCell>
                                <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Link
                                        to={`/complaints/${complaint._id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        to={`/edit-complaint/${complaint._id}`}
                                        className="text-green-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            
        </div>
    );
};

export default ComplaintManagement;
