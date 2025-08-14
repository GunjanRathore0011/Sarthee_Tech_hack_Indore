import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle, Clock, FileText, Play, MessageSquare } from 'lucide-react';
import { CaseDetailsPanel } from '@/component/OfficerComponent/CaseDetailsPanel';
import { DialogDemo } from '@/component/DialogDemo';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { fetchAssignedCases } from '@/ReduxSlice/stats/statsSlice';

// Utility functions for badge colors
const getPriorityBadge = (priority) => {
    switch (priority) {
        case 'High': return 'bg-red-100 text-red-700';
        case 'Medium': return 'bg-yellow-100 text-yellow-700';
        case 'Low': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'Assigned': return 'bg-blue-100 text-blue-700';
        case 'Investigating': return 'bg-purple-100 text-purple-700';
        case 'Resolved': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const mockCaseNotes = [
    {
        id: 'note-1',
        caseId: 'CASE-2025-001',
        note: 'Initial investigation started. Suspect identified.',
        timestamp: new Date().toISOString(),
        author: 'Officer Sharma',
        type: 'update'
    },
    {
        id: 'note-2',
        caseId: 'CASE-2025-001',
        note: 'Evidence collected from social media.',
        timestamp: new Date().toISOString(),
        author: 'Officer Sharma',
        type: 'evidence'
    },
    {
        id: 'note-3',
        caseId: 'CASE-2025-002',
        note: 'Victim’s statement recorded.',
        timestamp: new Date().toISOString(),
        author: 'Officer Verma',
        type: 'update'
    }
];

const OfficerCaseSection = () => {
    const [activeTab, setActiveTab] = useState('cases');
    const [activeCases, setActiveCases] = useState([]);
    const [resolvedCases, setResolvedCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);

    const currentUser = useSelector((state) => state.user);
    const investigatorId = currentUser.user.additionDetails;

    const dispatch = useDispatch();
    // console.log('Investigator ID:', investigatorId);
    const handleStartInvestigation = async (id) => {
        try {
            const res = await axios.post(`http://localhost:4000/api/v1/investigator/updateComplaintStatus`, {
                complaintId: id,
                newStatus: "In_review",
                remark: "Investigation started by officer"
            });

            const result = await res.data;

            if (result.success) {
                toast.success('Investigation started successfully');
                fetchAssignedCase(); // Fetch updated cases after starting investigation
                dispatch(fetchAssignedCases(investigatorId)); // only this is enough
            } else {
                toast.error('Failed to start investigation');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error starting investigation');
        }
    };


    const handleUpdateStatus = (id, newStatus) => {
        alert(`Marking case ${id} as ${newStatus}`);
    };

    const visibleCases = activeTab === 'cases' ? activeCases : resolvedCases;
    const fetchAssignedCase = async () => {
        try {

            const res = await fetch(`http://localhost:4000/api/v1/investigator/allAssignedCases/${investigatorId}`);
            const result = await res.json();
            // console.log('Assigned Cases Response:', result.activeCases);

            if (result.success) {
                setActiveCases(result.activeCases);
                setResolvedCases(result.resolvedCases);
            }
        } catch (error) {
            console.error('Error fetching assigned cases:', error);
        }
    };

    const handleMarkResolved = async(id) => {
         try {
            const res = await axios.post(`http://localhost:4000/api/v1/investigator/updateComplaintStatus`, {
                complaintId: id,
                newStatus: "Resolved",
                remark: "Congratulations! Your case has been resolved successfully."
            });

            const result = await res.data;

            if (result.success) {
                toast.success('Case marked as resolved successfully');
                fetchAssignedCase(); // Fetch updated cases after starting investigation
                dispatch(fetchAssignedCases(investigatorId)); // only this is enough
            } else {
                toast.error('Failed to mark case as resolved');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error marking case as resolved');
        }
    }

    useEffect(() => {
        fetchAssignedCase();
    }, []);

    return (
        <>
            <div className="px-6 py-6 min-h-screen">
                {/* Tabs */}
                <div className="border-b border-blue-200 mb-6">
                    <div className="flex space-x-8">
                        {[
                            { id: 'cases', label: 'Active Cases', count: activeCases.length },
                            { id: 'resolved', label: 'Resolved Cases', count: resolvedCases.length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 py-4 border-b-2 transition-all text-sm font-medium tracking-wide ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-blue-600'
                                    }`}
                            >
                                <span>{tab.label}</span>
                                <Badge variant="outline" className="text-xs">
                                    {tab.count}
                                </Badge>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Case Cards */}
                <div className="space-y-4">
                    {visibleCases.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">
                                {activeTab === 'cases' ? 'No active cases assigned' : 'No resolved cases'}
                            </div>
                            <p className="text-sm text-gray-400">
                                {activeTab === 'cases'
                                    ? 'New cases will appear here when assigned by admin'
                                    : 'Resolved cases will be listed here'}
                            </p>
                        </div>
                    ) : (
                        visibleCases.map((complaint) => (
                            <Card
                                key={complaint.id}
                                className="cyber-card p-6 cyber-transition hover:cyber-glow bg-white text-blue-900"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4 mb-3">
                                            <h3 className="text-lg text-gray-600 font-semibold ">{complaint.caseId}</h3>
                                            <Badge className={`${getPriorityBadge(complaint.priority)} border`}>
                                                {complaint.priority === 'High' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                                {complaint.priority}
                                            </Badge>
                                            <Badge className={`${getStatusBadge(complaint.status)} border`}>
                                                {complaint.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Crime Type</p>
                                                <p className="font-medium">{complaint.crimeType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Location</p>
                                                <p className="font-medium">
                                                    {complaint.location} {complaint.pinCode ? `(${complaint.pinCode})` : ''}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Complainant</p>
                                                <p className="font-medium">{complaint.userName}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Description</p>

                                        <p className="text-muted-foreground line-clamp-2 mb-4">
                                            {complaint.description}
                                        </p>

                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Received: {new Date(complaint.dateReceived).toLocaleString()}</span>
                                            <span className="mx-2">•</span>
                                            <FileText className="h-4 w-4" />
                                            {/* <span>{complaint.evidence.length} evidence files</span> */}
                                            <a
                                                href={complaint.evidence}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Evidence Files
                                            </a>
                                            <span className="mx-2">•</span>
                                            <FileText className="h-4 w-4" />
                                            <a
                                                href={complaint.complaint_report}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Complaint Report
                                            </a>

                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 ml-6">
                                        <Button
                                            variant="default"
                                            onClick={() => setSelectedCase(complaint)}
                                            className="cyber-glow-secondary"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>

                                        {complaint.status === 'AssignInvestigator' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleStartInvestigation(complaint.id)}
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                Start Investigation
                                            </Button>
                                        )}

                                        {complaint.status !== 'Resolved' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleMarkResolved(complaint.id)}
                                            >
                                                <MessageSquare className="h-4 w-4 mr-2 "  />
                                                Mark Resolved
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
                {/* Case Details Modal */}
                {selectedCase && (
                    <CaseDetailsPanel
                        case={selectedCase}
                        onStartInvestigation={handleStartInvestigation}
                        onMarkResolved={handleMarkResolved}
                        notes={mockCaseNotes.filter(note => note.caseId === selectedCase.caseId)}
                        onClose={() => setSelectedCase(null)}
                    />
                )}

                {/* <DialogDemo /> */}
            </div>

        </>
    );
};

export default OfficerCaseSection;
