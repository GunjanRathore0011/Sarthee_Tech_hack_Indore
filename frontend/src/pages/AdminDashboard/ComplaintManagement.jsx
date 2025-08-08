import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify'; // optional for feedback

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [investigatorId, setInvestigatorId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
// console.log("Initial complaints state:", complaints);
// console.log("Selected complaint state:", selectedComplaint);
  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/v1/admin/dashboard');
      if (Array.isArray(res.data.data)) {
        setComplaints(res.data.data);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onAssignCase = (complaint) => {
    setSelectedComplaint(complaint);
    setInvestigatorId('');
    setIsDialogOpen(true);
  };

  const handleAssign = async () => {
    if (!investigatorId.trim()) {
      toast.error("Investigator ID is required");
      return;
    }

    try {
        console.log("Assigning investigator:", { complaintId: selectedComplaint._id, investigatorId });
      // Call the backend API to assign the investigator
      const response = await axios.post('http://localhost:4000/api/v1/admin/assignInvestigator', {
        complaintId: selectedComplaint._id,
        investigatorId,
      });

      if (response.data.success) {
        toast.success("Investigator assigned successfully");
        fetchComplaints(); // refresh data
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to assign investigator");
      }
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Error assigning investigator");
    }
  };

  const getStatusStyle = (status) => {
    // console.log("Status for styling:", status);
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
// console.log("Complaints data:", complaints);
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
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
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

                <TableCell>
                  {complaint.assignedTo === null || complaint.assignedTo === "" ? (
                    <Button
                      size="sm"
                      onClick={() => onAssignCase(complaint)}
                      className="bg-blue-500 text-white hover:bg-blue-700 shadow-sm px-3 py-1 rounded-md"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Assign
                    </Button>
                  ) : (
                    <span className="text-blue-700 font-medium">{complaint.assignedTo}</span>
                  )}
                </TableCell>

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

      {/* Assign Investigator Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Investigator</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <label className="block mb-1 font-medium">Investigator ID</label>
            <Input
              value={investigatorId}
              onChange={(e) => setInvestigatorId(e.target.value)}
              placeholder="Enter Investigator ID"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAssign} className="bg-blue-600 text-white hover:bg-blue-700">
              Confirm Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintManagement;
