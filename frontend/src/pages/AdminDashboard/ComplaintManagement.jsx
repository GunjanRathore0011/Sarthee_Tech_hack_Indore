import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [investigatorId, setInvestigatorId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);

  // New States for Pagination & Filters
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    subCategory: '',
    month: ''
  });


  // console.log("filters", filters);
  // console.log("complaints", complaints);
  const subCategories = [
    "Banking Fraud", "UPI / Wallet Fraud", "Loan Fraud", "Investment Scam",
    "Online Shopping Fraud", "Insurance Fraud", "Job/Work-from-Home Scam",
    "Lottery/Prize/KYC Scam", "ATM Skimming", "Online Loan App Harassment",
    'Sexual Harassment', 'Verbal Abuse', 'Physical Abuse', 'Cyberbullying',
    'Stalking', 'Discrimination', "Hacking", "Cyberbullying", "Identity Theft",
    "Online Defamation", "Phishing (non-financial)", "Unauthorized Access",
    "Social Media Abuse"];


  // investigators data
  const fetchOfficerData = async () => {
    try {
      setLoading(true); // start loader
      // console.log("Fetching officer data...");

      const response = await axios.get(
        "http://localhost:4000/api/v1/admin/suggestInvestigator"
      );

      // console.log("Fetched officer data:", response.data.data);

      if (Array.isArray(response.data.data)) {
        setOfficers(response.data.data);
        console.log("Officers data set:", response.data.data);
      } else {
        console.error("Invalid officer data format:", response.data.data);
        setOfficers([]);
      }
    } catch (error) {
      console.error("Error fetching officer data:", error);
      setOfficers([]);
    } finally {
      setLoading(false); // stop loader
    }
  };

  // auto assign investigators
  const autoassign = async () => {
    try { 
      const response = await axios.post('http://localhost:4000/api/v1/admin/autoAssignInvestigator');
      if (response.data.success) {
        toast.success("Investigators auto-assigned successfully");
        fetchComplaints(false); // refresh complaints
      } else {

        toast.error("Failed to auto-assign investigators");
      }
    } catch (error) {
      console.error("Auto-assign error:", error);
      toast.error("Error auto-assigning investigators");
    }
  };



  // Fetch complaints with pagination & filters
  const fetchComplaints = async () => {
    try {

      const params = { ...filters };
      const res = await axios.get('http://localhost:4000/api/v1/admin/dashboard', { params });
      const result = res.data;
      console.log("Fetched complaints:", result);
      setComplaints(result.data);

      setHasMore(true); // Reset hasMore to true
      if (result.data.length < 10) {
        setHasMore(false); // No more data to load
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to fetch complaints");
    }
  };


  // Initial load
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Show more
  const handleShowMore = async () => {

    const startIndex = complaints.length; // Start from the current length

    const params = { startIndex, limit: 10, ...filters }; // ✅ Always fetch 5
    const res = await axios.get('http://localhost:4000/api/v1/admin/dashboard', { params });
    const result = res.data.data;
    console.log("Fetched more complaints:", result);
    setComplaints(prev => [...prev, ...result]);
    if (result.length < 10) {
      setHasMore(false); // No more data to load
    }
  };


  // Filter change handler
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Apply filters
  const applyFilters = () => {
    fetchComplaints();
  };

  const onAssignCase = (complaint) => {
    setSelectedComplaint(complaint);
    fetchOfficerData(); // Fetch officers when assigning
    setInvestigatorId('');
    setIsDialogOpen(true);
  };

  const handleAssign = async (id) => {
    if (!id || !id.trim()) {
      toast.error("Investigator ID is required");
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/admin/assignInvestigator', {
        complaintId: selectedComplaint._id,
        investigatorId: id,   // use id directly here
      });

      if (response.data.success) {
        toast.success("Investigator assigned successfully");
        fetchComplaints(false);
        setIsDialogOpen(false);
        setInvestigatorId(""); // reset if needed
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
            <select
              name="subCategory"
              value={filters.subCategory}
              onChange={handleFilterChange}
              className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none min-w-[180px]"
            >
              <option value="">All</option>
              {subCategories.map((subCat, index) => (
                <option key={index} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
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
              onClick={autoassign}
              className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Auto assign 
            </Button>
             <Button
              onClick={applyFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Apply
            </Button>
            <Button
              onClick={() => {
                const emptyFilters = { status: '', priority: '', subCategory: '', month: '' };
                // console.log("Reset filters about to run"); // simple log first
                setFilters(emptyFilters);                  // update state
                // console.log("Empty filters object:", emptyFilters); // log the object itself
                applyFilters();
              }
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
      {hasMore && complaints.length > 0 ? (
        <div className="flex justify-center mt-4">
          <Button onClick={handleShowMore} className="bg-blue-600 text-white">
            Show More
          </Button>
        </div>
      ) :
        (<div>
          <p className="text-gray-500 text-center mt-4">No more complaints to show.</p>
        </div>)
      }

      {/* Assign Investigator Dialog */}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (open) fetchOfficerData();
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="w-[700px] h-[800px] max-h-[90vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>Assign Investigator</DialogTitle>
            <DialogDescription>
              Select an available investigator to assign to this case.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="text-gray-500 text-center">Loading investigators...</p>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              {officers.length > 0 ? (
                officers
                  // .filter(inv => inv.status === "Free")  // only free investigators
                  // .filter(inv => inv.isActive && inv.status === "Free" || inv.status === "Available" ) // filter based on status
                  .filter(inv => inv.isActive && (inv.status === "Free" || inv.status === "Available"))
                  .map((inv) => {
                    const borderColor = "border-green-500";
                    const statusBg = "bg-green-100 text-green-700";
                    const isClickable = true;

                    return (
                      <div
                        key={inv.id}
                        onClick={() => handleAssign(inv.id)}
                        className={`flex flex-col p-4 border-l-4 ${borderColor} rounded-lg shadow-sm 
            transition hover:shadow-lg cursor-pointer bg-white`}
                      >
                        {/* Name + Status */}
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{inv.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${statusBg}`}>
                            {inv.status}
                          </span>
                        </div>

                        {/* Specializations */}
                        <p className="text-sm text-gray-600 mt-1">
                          Specializations:{" "}
                          <span className="font-medium">
                            {inv.specializations?.join(", ") || "N/A"}
                          </span>
                        </p>

                        {/* Performance & Active Cases */}
                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-700">
                          <span>
                            Performance:{" "}
                            <span className="font-semibold">
                              {inv.performance !== null ? inv.performance + "%" : "N/A"}
                            </span>
                          </span>
                          <span>
                            Active Cases:{" "}
                            <span className="font-semibold">{inv.activeCases}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-gray-500 text-center">No available investigators found.</p>
              )}

            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



    </div>
  );
};

export default ComplaintManagement;
