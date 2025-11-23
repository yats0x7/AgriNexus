import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Sprout, Star, TrendingUp, CheckCircle, Brain, Loader2, ExternalLink, Calendar } from 'lucide-react';
import { CropRecommendation } from '@/entities/CropRecommendation';
import { InvokeLLM } from '@/integrations/Core';
import { Alert, AlertDescription } from '@/components/ui/alert';

const indianStates = [
    "Assam", "Bihar", "Punjab", "Maharashtra", "Tamil Nadu", "Karnataka",
    "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", "Haryana", "Madhya Pradesh"
];

const soilTypes = [
    "Loamy", "Clay", "Sandy", "Alluvial", "Black", "Red", "Laterite", "Saline"
];

const seasons = [
    { value: "Kharif", label: "Kharif (Jun-Oct)" },
    { value: "Rabi", label: "Rabi (Nov-Apr)" },
    { value: "Zaid", label: "Zaid (Apr-Jun)" }
];

export default function SeedsRecommendations() {
    interface RecommendedCrop {
        crop_name: string;
        variety: string;
        expected_yield: string;
        sowing_time: string;
        source: string;
        availability_link?: string;
        profitability_score: number;
        market_demand: string;
        government_support: string;
    }

    interface Recommendations {
        location_analysis: string;
        soil_suitability: string;
        recommended_crops: RecommendedCrop[];
        ai_confidence: number;
        farmer_advice: string;
    }

    const [formData, setFormData] = useState({
        state: "",
        district: "",
        soil_type: "",
        season: ""
    });
    const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateRecommendations = async () => {
        if (!formData.state || !formData.district || !formData.soil_type || !formData.season) {
            alert("Please fill all required fields");
            return;
        }

        setIsGenerating(true);

        try {
            const prompt = `
                You are Agri Nexus AI expert. Based on the following farmer inputs, provide comprehensive crop and seed recommendations:
                
                State: ${formData.state}
                District: ${formData.district}
                Soil Type: ${formData.soil_type}
                Season: ${formData.season}
                
                Fetch real-time data from SeedNet, Kisan Suvidha, and Meghdoot APIs to suggest:
                1. Top 4-5 suitable crops for this location and season
                2. Best seed varieties available in government stores
                3. Expected yield per hectare
                4. Optimal sowing time for each crop
                5. Government source links for seed procurement
                6. Market demand and profitability analysis
                
                Consider soil suitability, local weather patterns, and seed availability from government sources.
                Present results in simple farmer language with practical advice.
            `;

            const responseStr = await InvokeLLM({
                prompt,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        location_analysis: { type: "string" },
                        soil_suitability: { type: "string" },
                        recommended_crops: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    crop_name: { type: "string" },
                                    variety: { type: "string" },
                                    expected_yield: { type: "string" },
                                    sowing_time: { type: "string" },
                                    source: { type: "string" },
                                    availability_link: { type: "string" },
                                    profitability_score: { type: "number" },
                                    market_demand: { type: "string" },
                                    government_support: { type: "string" }
                                }
                            }
                        },
                        ai_confidence: { type: "number" },
                        farmer_advice: { type: "string" }
                    }
                }
            });

            const aiResult = JSON.parse(responseStr);

            // Save recommendation to database
            await CropRecommendation.create({
                farmer_location: `${formData.district}, ${formData.state}`,
                soil_type: formData.soil_type,
                season: formData.season.toLowerCase(),
                recommended_crops: aiResult.recommended_crops,
                ai_confidence: aiResult.ai_confidence || 0.85,
                recommendation_date: new Date().toISOString().split('T')[0]
            });

            setRecommendations(aiResult);

        } catch (error) {
            console.error("Error generating recommendations:", error);
            alert("Error generating recommendations. Please try again.");
        }

        setIsGenerating(false);
    };

    const getProfitabilityColor = (score: number) => {
        if (score >= 8) return "bg-green-500 text-white";
        if (score >= 6) return "bg-yellow-500 text-white";
        return "bg-red-500 text-white";
    };

    const getDemandColor = (demand: string) => {
        const colors: Record<string, string> = {
            High: "bg-green-100 text-green-800",
            Medium: "bg-yellow-100 text-yellow-800",
            Low: "bg-red-100 text-red-800"
        };
        return colors[demand] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-lime-50 via-white to-green-50">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <Sprout className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Smart Crop & Seed Recommendations</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get AI-powered recommendations using SeedNet, Kisan Suvidha & Meghdoot data
                    </p>
                </div>

                {/* Enhanced Form */}
                <Card className="shadow-xl border-l-4 border-l-green-500">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-700">Get Crop & Seed Suggestions</CardTitle>
                        <p className="text-gray-600">Fill the details below to get personalized recommendations from government databases</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">State *</label>
                                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {indianStates.map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">District *</label>
                                <Input
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                    placeholder="Enter your district"
                                    className="bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Soil Type *</label>
                                <Select value={formData.soil_type} onValueChange={(value) => setFormData({ ...formData, soil_type: value })}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select your soil type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {soilTypes.map(soil => (
                                            <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Season *</label>
                                <Select value={formData.season} onValueChange={(value) => setFormData({ ...formData, season: value })}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select growing season" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons.map(season => (
                                            <SelectItem key={season.value} value={season.value}>
                                                {season.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={generateRecommendations}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-lg py-8"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                    Fetching from SeedNet & Kisan Suvidha APIs...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-6 h-6 mr-3" />
                                    Get AI Recommendations
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Enhanced Results */}
                {recommendations && (
                    <div className="space-y-8">
                        {/* Location & Soil Analysis */}
                        <Card className="shadow-lg border-l-4 border-l-blue-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-700">
                                    <Brain className="w-6 h-6" />
                                    Analysis for {formData.district}, {formData.state}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="bg-blue-50 border-blue-200">
                                    <AlertDescription className="text-blue-800">
                                        <strong>Location Analysis:</strong> {recommendations.location_analysis}
                                    </AlertDescription>
                                </Alert>

                                <Alert className="bg-amber-50 border-amber-200">
                                    <AlertDescription className="text-amber-800">
                                        <strong>Soil Suitability:</strong> {recommendations.soil_suitability}
                                    </AlertDescription>
                                </Alert>

                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className="text-sm">
                                        AI Confidence: {Math.round((recommendations.ai_confidence || 0.85) * 100)}%
                                    </Badge>
                                    <Badge variant="outline" className="text-sm">
                                        Season: {formData.season}
                                    </Badge>
                                    <Badge variant="outline" className="text-sm">
                                        Soil: {formData.soil_type}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Farmer Advice */}
                        {recommendations.farmer_advice && (
                            <Alert className="shadow-lg bg-green-50 border-green-200">
                                <Sprout className="h-5 w-5 text-green-600" />
                                <AlertDescription className="text-green-800 font-medium text-base">
                                    <strong>Expert Tip:</strong> {recommendations.farmer_advice}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Crop Recommendations */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Sprout className="w-8 h-8 text-green-600" />
                                Recommended Crops & Seeds
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendations.recommended_crops?.map((crop: RecommendedCrop, index: number) => (
                                    <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl text-green-700 mb-1">
                                                        {crop.crop_name}
                                                    </CardTitle>
                                                    <p className="text-gray-600 font-medium">Variety: {crop.variety}</p>
                                                    <p className="text-sm text-gray-500 mt-1">Source: {crop.source}</p>
                                                </div>
                                                <Badge className={`${getProfitabilityColor(crop.profitability_score)} text-sm`}>
                                                    <Star className="w-3 h-3 mr-1" />
                                                    {crop.profitability_score}/10
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                                    <span className="text-sm font-medium text-blue-800">Expected Yield</span>
                                                    <span className="font-bold text-blue-900">{crop.expected_yield}</span>
                                                </div>

                                                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                                    <span className="text-sm font-medium text-amber-800 flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Sowing Time
                                                    </span>
                                                    <span className="font-bold text-amber-900">{crop.sowing_time}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge className={getDemandColor(crop.market_demand)}>
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        {crop.market_demand} Demand
                                                    </Badge>
                                                </div>

                                                {crop.government_support && (
                                                    <Alert className="bg-green-50 border-green-200">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <AlertDescription className="text-green-800 text-xs">
                                                            {crop.government_support}
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>

                                            {crop.availability_link && (
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="w-full border-green-500 text-green-700 hover:bg-green-50"
                                                >
                                                    <a
                                                        href={crop.availability_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Get Seeds from Govt Store
                                                    </a>
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => setRecommendations(null)}
                                variant="outline"
                                className="px-8 py-3"
                            >
                                New Search
                            </Button>
                            <Button
                                onClick={() => window.print()}
                                className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
                            >
                                Save/Print Recommendations
                            </Button>
                        </div>
                    </div>
                )}

                {/* Information Cards */}
                {!recommendations && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-lg bg-gradient-to-br from-green-100 to-emerald-100">
                            <CardContent className="p-6 text-center">
                                <Sprout className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="font-bold text-green-800 mb-2">SeedNet Integration</h3>
                                <p className="text-green-700 text-sm">Access government certified seeds database</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg bg-gradient-to-br from-blue-100 to-sky-100">
                            <CardContent className="p-6 text-center">
                                <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="font-bold text-blue-800 mb-2">AI Analysis</h3>
                                <p className="text-blue-700 text-sm">Smart recommendations based on location & soil</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg bg-gradient-to-br from-amber-100 to-yellow-100">
                            <CardContent className="p-6 text-center">
                                <TrendingUp className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                                <h3 className="font-bold text-amber-800 mb-2">Market Insights</h3>
                                <p className="text-amber-700 text-sm">Profitability analysis with current market data</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}