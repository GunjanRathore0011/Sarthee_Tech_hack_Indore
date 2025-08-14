import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AddOfficerModal = ({ isOpen, onClose, onAddOfficer }) => {
    const [formData, setFormData] = useState({
        name: '',
        badgeId: '',
        email: '',
        phone: '',
        password: '',
        station: '',
        specialistIn: [],
    });

    const [newSpecialization, setNewSpecialization] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, badgeId, email, phone, password, station, specialistIn } = formData;

        if (!name || !email || !badgeId || !password) return;

        try {
            const { data } = await axios.post('http://localhost:4000/api/v1/investigator/investigator', {
                name, badgeId, email, phone, password, station, specialistIn,
            });

            onAddOfficer(data);
            setFormData({ name: '', badgeId: '', email: '', phone: '', password: '', station: '', specialistIn: [] });
            onClose();
            navigate('/officer-management'); // Redirect to officers page after adding
        } catch (error) {
            console.error('Axios error:', error);
            alert('Failed to add officer.');
        }
    };
    const addSpecialization = () => {
        if (newSpecialization && !formData.specialistIn.includes(newSpecialization)) {
            setFormData((prev) => ({
                ...prev,
                specialistIn: [...prev.specialistIn, newSpecialization],
            }));
            setNewSpecialization('');
        }
    };

    const removeSpecialization = (spec) => {
        setFormData((prev) => ({
            ...prev,
            specialistIn: prev.specialistIn.filter((s) => s !== spec),
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md h-[90%]">
                <DialogHeader>
                    <DialogTitle>Add New Officer</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter officer's full name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="badgeId">Badge ID</Label>
                        <Input
                            id="badgeId"
                            value={formData.badgeId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, badgeId: e.target.value }))}
                            placeholder="Enter badge ID"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter officer's email"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            placeholder="Set a password"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="station">Station</Label>
                        <Input
                            id="station"
                            value={formData.station}
                            onChange={(e) => setFormData((prev) => ({ ...prev, station: e.target.value }))}
                            placeholder="Enter station name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Specializations</Label>
                        <div className="flex space-x-2">
                            <Input
                                value={newSpecialization}
                                onChange={(e) => setNewSpecialization(e.target.value)}
                                placeholder="Add specialization"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addSpecialization();
                                    }
                                }}
                            />
                            <Button type="button" onClick={addSpecialization} size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.specialistIn.map((spec) => (
                                <Badge key={spec} variant="outline" className="text-xs">
                                    {spec}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 ml-1"
                                        onClick={() => removeSpecialization(spec)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="cyber-glow ">
                            Add Officer
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
