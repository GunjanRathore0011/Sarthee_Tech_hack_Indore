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
import { toast } from 'react-toastify';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [investigatorId, setInvestigatorId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New States for Pagination & Filters
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    subCategory: '',
    month: ''
  });

  console.log("complaints", complaints);

  // Fetch complaints with pagination & filters
  const fetchComplaints = async (append = false) => {
    try {
      const params = { startIndex, limit: 5, ...filters }; // ✅ Always fetch 5
      const res = await axios.get('http://localhost:4000/api/v1/admin/dashboard', { params });

      if (Array.isArray(res.data.data)) {
        if (append) {
          setComplaints((prev) => [...prev, ...res.data.data]);
        } else {
          setComplaints(res.data.data);
        }

        // ✅ Only show "Show More" if exactly 5 were returned
        setHasMore(res.data.data.length === 5);
      } else {
        setComplaints([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };


  // Initial load
  useEffect(() => {
    fetchComplaints(false);
  }, [startIndex]);

  // Show more
  const handleShowMore = () => {
    if (!hasMore) return;
    setStartIndex((prev) => prev + 5);
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters
  const applyFilters = () => {
    setStartIndex(0);
    fetchComplaints(false);
  };

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
      const response = await axios.post('http://localhost:4000/api/v1/admin/assignInvestigator', {
        complaintId: selectedComplaint._id,
        investigatorId,
      });

      if (response.data.success) {
        toast.success("Investigator assigned successfully");
        fetchComplaints(false);
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

      {/* Filter Section */}
      <div className="bg-gray-100 p-4  mb-4 ">
        <div className="flex flex-wrap items-center gap-4 flex-row justify-between">
          {/* Status */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[150px]"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Priority */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[150px]"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sub Category */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Sub Category</label>
            <input
              type="text"
              name="subCategory"
              value={filters.subCategory}
              onChange={handleFilterChange}
              placeholder="Enter sub category"
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[180px]"
            />
          </div>

          {/* Month */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1.5 ml-1">Month</label>
            <input
              type="month"
              name="month"
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value.split('-')[1] })
              }
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[150px]"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <Button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Apply
            </Button>
            <Button
              onClick={() =>
                setFilters({ status: '', priority: '', subCategory: '', month: '' })
              }
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
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
                  <Link to={`/complaints/${complaint._id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </TableCell>
                <TableCell>
                  <Link to={`/edit-complaint/${complaint._id}`} className="text-green-600 hover:underline">
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Show More Button */}
      {hasMore && complaints.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button onClick={handleShowMore} className="bg-blue-600 text-white">
            Show More
          </Button>
        </div>
      )}

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
