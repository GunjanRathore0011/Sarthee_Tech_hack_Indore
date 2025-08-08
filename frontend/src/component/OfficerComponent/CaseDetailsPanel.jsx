import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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

export const CaseDetailsPanel = ({ case: complaint, notes, onClose, onUpdateNotes }) => {
    const [newNote, setNewNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(complaint.status);
    const [caseNotes, setCaseNotes] = useState(notes);

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

    const handleAddNote = () => {
        if (newNote.trim()) {
            const newCaseNote = {
                id: `note-${Date.now()}`,
                caseId: complaint.caseId,
                note: newNote.trim(),
                timestamp: new Date().toISOString(),
                author: 'Current Officer',
                type: 'investigation',
            };

            const updatedNotes = [...caseNotes, newCaseNote];
            setCaseNotes(updatedNotes);
            onUpdateNotes?.(updatedNotes);
            setNewNote('');

            toast({
                title: 'Note Added',
                description: 'Investigation note has been added successfully',
            });
        }
    };

    const handleStatusUpdate = () => {
        toast({
            title: 'Status Updated',
            description: `Case status updated to ${selectedStatus}`,
        });
    };

    const handleContactComplainant = () => {
        toast({
            title: 'Contacting Complainant',
            description: `Sending notification to ${complaint.userEmail}`,
        });
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
        toast({
            title: 'Download Started',
            description: `Downloading ${evidenceName}`,
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="w-[96vw] max-h-[90vh] overflow-y-auto">


                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-blue-700 font-semibold">{complaint.caseId}</span>
                            <Badge className={`${getPriorityColor(complaint.priority)} border`}>
                                {complaint.priority === 'High' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {complaint.priority} Priority
                            </Badge>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5 text-blue-700" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Side – Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview */}
                        <Card className="p-6 bg-blue-50">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">Case Overview</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-blue-500">Crime Type</p>
                                    <p className="font-medium">{complaint.crimeType}</p>
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
                                        <p className="font-medium">{complaint.userName}</p>
                                        <p className="text-xs text-muted-foreground">{complaint.userEmail}</p>
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
                                    Received: {new Date(complaint.dateReceived).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-500 mb-2">Description</p>
                                <p className="text-sm leading-relaxed">{complaint.description}</p>
                            </div>
                        </Card>

                        {/* Evidence */}
                        <Card className="p-6 bg-white border border-blue-100">
                            <h3 className="text-lg font-semibold mb-4">Evidence ({complaint.evidence.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {complaint.evidence.map((evidence) => (
                                    <div
                                        key={evidence.id}
                                        className="p-4 border border-blue-200 rounded-lg bg-blue-50"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                {getEvidenceIcon(evidence.type)}
                                                <span className="font-medium text-sm">{evidence.name}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDownloadEvidence(evidence.name)}
                                            >
                                                <Download className="h-4 w-4 text-blue-600" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-blue-500">
                                            Uploaded: {new Date(evidence.uploadDate).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-blue-500 capitalize">Type: {evidence.type}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Investigation Actions */}
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
                                <Button variant="outline" onClick={handleStatusUpdate}>
                                    Update Status
                                </Button>
                                <Button variant="outline">Request Additional Info</Button>
                                <Button variant="outline">Generate Report</Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right Side – Notes & Quick Actions */}
                    <div className="space-y-6">
                        {/* Notes */}
                        <Card className="p-6 bg-white border border-blue-100">
                            <h3 className="text-lg font-semibold mb-4">Case Notes</h3>
                            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                                {caseNotes.map((note) => (
                                    <div key={note.id} className="p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-medium text-sm">{note.author}</span>
                                            <span className="text-xs text-blue-400">
                                                {new Date(note.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-700">{note.note}</p>
                                        <Badge variant="outline" className="text-xs mt-2">
                                            {note.type.replace('_', ' ')}
                                        </Badge>
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
    );
};
