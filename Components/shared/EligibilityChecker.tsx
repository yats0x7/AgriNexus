import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Calculator } from 'lucide-react';

import { GovernmentSchemeInterface } from '@/entities/GovernmentScheme';

interface EligibilityResult {
    eligible: boolean;
    reasons: string[];
    confidence: number;
}

interface EligibilityCheckerProps {
    scheme: GovernmentSchemeInterface;
    onEligibilityCheck?: (result: EligibilityResult) => void;
}

export default function EligibilityChecker({ scheme, onEligibilityCheck }: EligibilityCheckerProps) {
    const [farmerProfile, setFarmerProfile] = useState({
        landSize: '',
        annualIncome: '',
        age: '',
        category: '',
        hasAadhar: true
    });
    const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);

    const checkEligibility = () => {
        // Simple eligibility logic based on scheme criteria
        let eligible = true;
        let reasons = [];

        // Basic checks for common schemes
        if (scheme.scheme_name.includes('PM-KISAN') && parseFloat(farmerProfile.landSize) > 2) {
            eligible = false;
            reasons.push('Land holding exceeds 2 hectares limit');
        }

        if (scheme.category === 'loan' && parseFloat(farmerProfile.annualIncome) > 300000) {
            eligible = false;
            reasons.push('Annual income exceeds limit for subsidized loans');
        }

        if (parseInt(farmerProfile.age) < 18) {
            eligible = false;
            reasons.push('Minimum age requirement not met');
        }

        if (!farmerProfile.hasAadhar) {
            eligible = false;
            reasons.push('Aadhaar card is mandatory');
        }

        const result = {
            eligible,
            reasons: eligible ? ['All eligibility criteria met'] : reasons,
            confidence: eligible ? 95 : 85
        };

        setEligibilityResult(result);
        onEligibilityCheck && onEligibilityCheck(result);
    };

    return (
        <Card className="mt-4 border-blue-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Eligibility Check for {scheme.scheme_name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Land Size (in hectares)</Label>
                        <Input
                            type="number"
                            value={farmerProfile.landSize}
                            onChange={(e) => setFarmerProfile({ ...farmerProfile, landSize: e.target.value })}
                            placeholder="e.g., 1.5"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Annual Income (₹)</Label>
                        <Input
                            type="number"
                            value={farmerProfile.annualIncome}
                            onChange={(e) => setFarmerProfile({ ...farmerProfile, annualIncome: e.target.value })}
                            placeholder="e.g., 200000"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Age</Label>
                        <Input
                            type="number"
                            value={farmerProfile.age}
                            onChange={(e) => setFarmerProfile({ ...farmerProfile, age: e.target.value })}
                            placeholder="e.g., 35"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={farmerProfile.category}
                            onValueChange={(value) => setFarmerProfile({ ...farmerProfile, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="sc">SC</SelectItem>
                                <SelectItem value="st">ST</SelectItem>
                                <SelectItem value="obc">OBC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={checkEligibility} className="w-full bg-blue-600 hover:bg-blue-700">
                    Check Eligibility
                </Button>

                {eligibilityResult && (
                    <Card className={`border-2 ${eligibilityResult.eligible ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                {eligibilityResult.eligible ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-600" />
                                )}
                                <span className={`font-bold text-lg ${eligibilityResult.eligible ? 'text-green-700' : 'text-red-700'}`}>
                                    {eligibilityResult.eligible ? 'Eligible' : 'Not Eligible'}
                                </span>
                                <Badge variant="outline">
                                    {eligibilityResult.confidence}% confidence
                                </Badge>
                            </div>
                            <ul className="space-y-1">
                                {eligibilityResult.reasons.map((reason, index) => (
                                    <li key={index} className="text-sm text-gray-700">
                                        • {reason}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
}