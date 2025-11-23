import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Sprout, Droplets, FlaskConical, Scissors } from 'lucide-react';
import { add, format } from 'date-fns';

interface CropStage {
    stage: string;
    duration: number;
    icon: React.ReactElement;
    color: string;
}

interface ScheduleItem extends CropStage {
    startDate: Date;
    endDate: Date;
}

const cropCycles: Record<string, CropStage[]> = {
    "Rice": [
        { stage: "Sowing", duration: 7, icon: <Sprout />, color: "text-green-600" },
        { stage: "Germination & Growth", duration: 40, icon: <Droplets />, color: "text-blue-600" },
        { stage: "Flowering", duration: 30, icon: <FlaskConical />, color: "text-amber-600" },
        { stage: "Harvesting", duration: 20, icon: <Scissors />, color: "text-red-600" },
    ],
    "Wheat": [
        { stage: "Sowing", duration: 10, icon: <Sprout />, color: "text-green-600" },
        { stage: "Tillering", duration: 45, icon: <Droplets />, color: "text-blue-600" },
        { stage: "Grain Filling", duration: 35, icon: <FlaskConical />, color: "text-amber-600" },
        { stage: "Harvesting", duration: 20, icon: <Scissors />, color: "text-red-600" },
    ],
};

export default function CropCalendar() {
    const [selectedCrop, setSelectedCrop] = useState("");
    const [plantingDate, setPlantingDate] = useState("");
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

    const generateSchedule = () => {
        if (!selectedCrop || !plantingDate) return;

        const cycle = cropCycles[selectedCrop];
        let currentDate = new Date(plantingDate);
        const newSchedule = cycle.map(phase => {
            const startDate = new Date(currentDate);
            currentDate = add(currentDate, { days: phase.duration });
            const endDate = new Date(currentDate);
            return { ...phase, startDate, endDate };
        });
        setSchedule(newSchedule);
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Crop Cycle Calendar</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Track your crop's journey from sowing to harvesting.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Create Your Crop Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-2">
                            <label>Select Crop</label>
                            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                                <SelectTrigger><SelectValue placeholder="Choose a crop" /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(cropCycles).map(crop => <SelectItem key={crop} value={crop}>{crop}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label>Planting Date</label>
                            <Input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} />
                        </div>
                        <Button onClick={generateSchedule} className="bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto">
                            Generate Calendar
                        </Button>
                    </CardContent>
                </Card>

                {schedule.length > 0 && (
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle>{selectedCrop} Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {schedule.map((phase, index) => (
                                <div key={index} className="p-4 rounded-lg border flex items-start gap-4" style={{ borderLeft: '4px solid', borderLeftColor: phase.color.replace('text-', '').replace('-600', '') }}>
                                    <div className={`p-2 rounded-full bg-gray-100 ${phase.color}`}>
                                        {React.cloneElement(phase.icon as any, { className: 'w-6 h-6' })}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{phase.stage}</h3>
                                        <p className="text-sm text-gray-600">
                                            {format(phase.startDate, 'MMM dd')} - {format(phase.endDate, 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{phase.duration} Days</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}