import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
// import { toast } from '@/components/ui/use-toast';
import {
    X,
    FileText,
    Download,
    Image,
    Link,
    Volume2,
    User,
    MapPin,
    Calendar,
    AlertTriangle,
    MessageSquare,
    Send,
    Play,
    Pause,
    CheckCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedCases } from '@/ReduxSlice/stats/statsSlice';

export const CaseDetailsPanel = ({ caseId: caseId, notes, onClose, onUpdateNotes, onStartInvestigation,
    onMarkResolved }) => {


    const [complaint, setComplaint] = useState({});
    const [newNote, setNewNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(complaint.status);
    const [caseNotes, setCaseNotes] = useState(notes);
    const dispatch = useDispatch()

    const currentUser = useSelector((state) => state.user);
    const investigatorId = currentUser.user.additionDetails;
    //  console.log('Investigator ID:', investigatorId);
    // console.log("Complaint Data:", complaint.id);
    const [isContactOpen, setIsContactOpen] = useState(false);


    useEffect(() => {
        const fetchComplaintDetails = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:4000/api/v1/admin/complaint-details",
                    { id: caseId }
                );
                const data = response.data.data;
                console.log("Complaint Data:", data);
                setComplaint(data);
                setSelectedStatus(data.status);
            } catch (error) {
                console.error("Failed to fetch complaint details", error);
            }
        };
        fetchComplaintDetails();

    }, [caseId]);



    const fetchNotes = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/v1/investigator/getCaseNotes', {
                params: { complaintId: caseId }
            });
            setCaseNotes(res.data.data);
            // console.log("Fetched Notes:", res.data.data);
        } catch (error) {
            console.error("Failed to fetch notes", error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [complaint.id]);

    const handleAddNote = async () => {
        try {
            await axios.post('http://localhost:4000/api/v1/investigator/addCaseNote', {
                complaintId: caseId,
                investigatorId,
                note: newNote,
            });
            setNewNote("");
            fetchNotes();  // Refresh notes list
        } catch (error) {
            console.error("Failed to add note", error);
        }
    };

    const getEvidenceIcon = (type) => {
        switch (type) {
            case 'image':
                return <Image className="h-4 w-4" />;
            case 'pdf':
                return <FileText className="h-4 w-4" />;
            case 'audio':
                return <Volume2 className="h-4 w-4" />;
            case 'link':
                return <Link className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'text-red-600 bg-red-100';
            case 'Medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'Low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };
    // const handleStatusUpdate = async () => {
    //     try {
    //         const res = await axios.post(`http://localhost:4000/api/v1/investigator/updateComplaintStatus`, {
    //             complaintId: complaint.id,
    //             newStatus: "AssignInvestigator",
    //             remark: "Investigation started by officer"
    //         })
    //         const result = res.data;
    //         dispatch(fetchAssignedCases(investigatorId));
    //         console.log('Status Update Response:', result);
    //     }
    //     catch (error) {
    //         console.error("Failed to update status", error);
    //     }

    // };

    const handleContactComplainant = () => {
        setIsContactOpen(true);
    };
    const handleViewRuleBook = () => {
        toast({
            title: 'Rule Book Opened',
            description: `Displaying procedures for ${complaint.crimeType}`,
        });
    };

    const handleEscalateCase = () => {
        toast({
            title: 'Case Escalated',
            description: 'Case has been escalated to senior investigator',
            variant: 'destructive',
        });
    };

    const handleDownloadEvidence = (evidenceName) => {
        // console.log(evidenceName);
    };

    return (
        <>
            <div className='w-full h-full flex items-center justify-center'>
                <Dialog open={true} onOpenChange={onClose}>
                    <DialogContent className="w-[1500px] h-[96vh]  max-h-[96vh] overflow-y-auto " >

                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="text-blue-700 font-semibold">{caseId}</span>
                                    <Badge className={`${getPriorityColor(complaint.priority)} border`}>
                                        {complaint.priority === 'High' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                        {complaint.priority} Priority
                                    </Badge>
                                </div>
                                
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Side – Main Details */}
                            <div className="lg:col-span-2 space-y-6">

                                {/* Case Overview */}
                                <Card className="p-6 bg-blue-50">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Case Overview</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-blue-500">Crime Type</p>
                                            <p className="font-medium">{complaint.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-500">Status</p>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="px-3 py-1 bg-white border border-blue-300 rounded text-sm"
                                            >
                                                <option value="Assigned">Assigned</option>
                                                <option value="Investigating">Investigating</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <User className="h-4 w-4 text-blue-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-blue-500">Complainant</p>
                                                <p className="font-medium">{complaint.comName}</p>
                                                {/* <p className="text-xs text-muted-foreground">{complaint.comEmail}</p>
                                                <p className="text-xs text-muted-foreground">{complaint.comPhone}</p> */}
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-2">
                                            <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                                            <div>
                                                <p className="text-sm text-blue-500">Location</p>
                                                <p className="font-medium">{complaint.location}</p>
                                                <p className="text-xs text-muted-foreground">PIN: {complaint.pinCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <Calendar className="h-4 w-4 text-blue-400" />
                                        <p className="text-sm text-muted-foreground">
                                            Received: {new Date(complaint.incident_datetime).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-500 mb-2">Description</p>
                                        <p className="text-sm leading-relaxed">{complaint.description}</p>
                                    </div>
                                </Card>

                                {/* Incident Details */}
                                <Card className="p-6 bg-white border border-blue-100">
                                    <h3 className="text-lg font-semibold mb-4">Incident Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-blue-500">Incident Time</p>
                                            <p className="font-medium">
                                                {complaint.incident_datetime ? new Date(complaint.incident_datetime).toLocaleString() : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-500">Lost Money</p>
                                            <p className="font-medium">{complaint.lost_money ? `₹${complaint.lost_money}` : "Not Reported"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-500">Delay in Report</p>
                                            <p className="font-medium">{complaint.delay_in_report ? "Yes" : "No"}</p>
                                            {complaint.delay_in_report && (
                                                <p className="text-xs text-red-600 mt-1">{complaint.reason_of_delay || "Reason not provided"}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                {/* Victim Details */}
                                {complaint.victimDetails && (
                                    <Card className="p-6 bg-blue-50">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Victim Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-blue-500">Victim ID</p>
                                                <p className="font-medium">{complaint.victimDetails._id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Bank Name</p>
                                                <p className="font-medium">{complaint.victimDetails.bankName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Account Number</p>
                                                <p className="font-medium">{complaint.victimDetails.accountNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">IFSC Code</p>
                                                <p className="font-medium">{complaint.victimDetails.ifscCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Transaction ID</p>
                                                <p className="font-medium">{complaint.victimDetails.transactionId}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Transaction Date</p>
                                                <p className="font-medium">{new Date(complaint.victimDetails.transactionDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Suspect Details */}
                                {complaint.suspectDetails && (
                                    <Card className="p-6 bg-white border border-blue-100">
                                        <h3 className="text-lg font-semibold mb-4">Suspect Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-blue-500">Suspect ID</p>
                                                <p className="font-medium">{complaint.suspectDetails._id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Name</p>
                                                <p className="font-medium">{complaint.suspectDetails.suspectedName}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Platform/Card</p>
                                                <p className="font-medium">{complaint.suspectDetails.suspectedCard}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-blue-500">Card/Number</p>
                                                <p className="font-medium">{complaint.suspectDetails.suspectedCardNumber}</p>
                                            </div>
                                        </div>
                                        {complaint.suspectDetails.suspectedImages?.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm text-blue-500 mb-2">Suspect Images</p>
                                                <div className="flex gap-3 flex-wrap">
                                                    {complaint.suspectDetails.suspectedImages.map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={img}
                                                            alt="Suspect"
                                                            className="h-24 w-24 object-cover rounded-lg border border-blue-200"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                )}

                                {/* Evidence */}
                                <Card className="p-6 bg-white border border-blue-100">
                                    <h3 className="text-lg font-semibold mb-4">Evidence ({complaint.screenShots})</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {complaint.screenShots?.map((evidence) => (
                                            <div
                                                key={evidence.id}
                                                className="p-4 border border-blue-200 rounded-lg bg-blue-50"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {getEvidenceIcon()}
                                                        <span className="font-medium text-sm">View Evidence</span>
                                                    </div>
                                                    <a
                                                        href={evidence}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownloadEvidence(screenShots)}
                                                        >
                                                            <Download className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Investigation Actions (same as before) */}
                                <Card className="p-6 bg-blue-50">
                                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Investigation Actions</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {complaint.status === 'Assigned' && (
                                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                                <Play className="h-4 w-4 mr-2" />
                                                Start Investigation
                                            </Button>
                                        )}
                                        {complaint.status === 'Investigating' && (
                                            <>
                                                <Button variant="outline">
                                                    <Pause className="h-4 w-4 mr-2" />
                                                    Pause Investigation
                                                </Button>
                                                <Button className="bg-green-600 text-white hover:bg-green-700">
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Mark as Resolved
                                                </Button>
                                            </>
                                        )}
                                        <div className="relative inline-block">
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value === "investigation") {
                                                        onStartInvestigation(complaint.id);
                                                        console.log("Investigation started for case:", complaint.id);
                                                    } else if (e.target.value === "resolved") {
                                                        onMarkResolved(complaint.id);
                                                    }
                                                    onClose();
                                                }}
                                                defaultValue=""
                                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="" disabled>
                                                    Update Status
                                                </option>
                                                <option value="investigation">Start Investigation</option>
                                                <option value="resolved">Mark Resolved</option>
                                            </select>
                                        </div>

                                        <Button variant="outline">Request Additional Info</Button>
                                        <Button variant="outline">Generate Report</Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Side – Notes & Quick Actions */}
                            <div className="space-y-6">

                                {/* Assigned Investigator */}
                                {complaint.assignedTo && (
                                    <Card className="p-6 bg-white border border-blue-100">
                                        <h3 className="text-lg font-semibold mb-4">Assigned Investigator</h3>
                                        <p className="font-medium">{complaint.assignedTo.name}</p>
                                        <p className="text-sm text-gray-500 mb-2">ID: {complaint.assignedTo.id}</p>
                                        {/* <p className="text-sm text-blue-600">Specialist In:</p>
                                        <ul className="list-disc ml-5 text-sm text-gray-700">
                                            {complaint.assignedTo.specialistIn.map((skill, idx) => (
                                                <li key={idx}>{skill}</li>
                                            ))}
                                        </ul> */}
                                    </Card>
                                )}

                                {/* Notes */}
                                <Card className="p-6 bg-white border border-blue-100">
                                    <h3 className="text-lg font-semibold mb-4">Case Notes</h3>
                                    <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                                        {caseNotes.map((note) => (
                                            <div key={note._id} className="p-3 bg-blue-50 rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs text-blue-400">
                                                        {new Date(note.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-700">{note.noteText}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <Textarea
                                            placeholder="Add investigation note..."
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                        <Button
                                            onClick={handleAddNote}
                                            disabled={!newNote.trim()}
                                            size="sm"
                                            className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Add Note
                                        </Button>
                                    </div>
                                </Card>

                                {/* Quick Actions */}
                                <Card className="p-6 bg-blue-50">
                                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start" onClick={handleContactComplainant}>
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Contact Complainant
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" onClick={handleViewRuleBook}>
                                            <FileText className="h-4 w-4 mr-2" />
                                            View Rule Book
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" onClick={handleEscalateCase}>
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Escalate Case
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Contact Dialog */}
            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                <DialogContent className="w-[420px] max-w-md rounded-2xl shadow-lg border border-gray-200 bg-white">
                    <DialogHeader className=" border-b border-gray-100">
                        <DialogTitle className="text-lg font-semibold text-blue-600">
                            Complainant Contact Details
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-3">
                        <div className="flex items-center">
                            <span className="w-20 font-medium text-gray-700">Name:</span>
                            <span className="text-gray-900">{complaint.comName}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-20 font-medium text-gray-700">Email:</span>
                            <span className="text-gray-900">{complaint.comEmail}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-20 font-medium text-gray-700">Phone:</span>
                            <span className="text-gray-900">{complaint.comPhone}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>

    );
};
