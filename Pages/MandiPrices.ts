import React, { useState, useEffect } from 'react';
import { MandiPrice } from '@/entities/MandiPrice';
import { z } from 'zod';

// Define types for the price data
interface PriceData {
  state: string;
  district: string;
  crop_name: string;
  price_modal: number;
  // Add other fields as needed
}

// Define types for AI insights
interface AiInsights {
  price_analysis: string;
  best_mandi: string;
  selling_advice: string;
  farmer_tip: string;
}

// Define types for historical data
interface HistoricalDataPoint {
  date: string;
  price: number;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import LocationSelector from '../components/shared/LocationSelector';
import VoiceSearch from '../components/shared/VoiceSearch';
import PriceComparison from '../components/mandi/PriceComparison';
import { TrendingUp, Wheat, RefreshCw, MapPin, Calendar, Brain, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InvokeLLM } from '@/integrations/Core';

// Mock historical data for trends
const generateHistoricalData = (crop: string, basePrice: number): HistoricalDataPoint[] => {
    return Array.from({ length: 7 }, (_, i) => ({
        date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM dd'),
        price: basePrice + (Math.random() - 0.5) * 200
    }));
};

const cropOptions = ["Wheat", "Rice", "Cotton", "Sugarcane", "Tomato", "Onion", "Potato"];

export default function MandiPrices() {
        const [prices, setPrices] = useState<PriceData[]>([]);
    const [filteredPrices, setFilteredPrices] = useState<PriceData[]>([]);
    const [selectedState, setSelectedState] = useState<string>("Punjab");
    const [selectedDistrict, setSelectedDistrict] = useState<string>("Ludhiana");
    const [selectedCrop, setSelectedCrop] = useState<string>("Rice");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);
    const [loadingInsights, setLoadingInsights] = useState<boolean>(false);

    const fetchPrices = React.useCallback(async () => {
        setIsLoading(true);
        try {
            // In real implementation, this would call eNAM and Agmarknet APIs
            const allPrices = await MandiPrice.list();
            setPrices(allPrices);
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error fetching prices:", error);
        }
        setIsLoading(false);
    }, []);

    const filterPrices = React.useCallback(() => {
        let result = prices;
        if (selectedState) {
            result = result.filter(p => p.state === selectedState);
        }
        if (selectedDistrict) {
            result = result.filter(p => p.district === selectedDistrict);
        }
        if (selectedCrop) {
            result = result.filter(p => p.crop_name === selectedCrop);
        }
        setFilteredPrices(result);
    }, [prices, selectedState, selectedDistrict, selectedCrop]);

    const generateAiInsights = React.useCallback(async () => {
        if (filteredPrices.length === 0) return;
        
        setLoadingInsights(true);
        try {
            const priceData = filteredPrices.slice(0, 5); // Take top 5 for analysis
            
            const prompt = `
                You are an agricultural expert helping Indian farmers. Analyze this mandi price data and provide farmer-friendly advice in simple language:
                
                Crop: ${selectedCrop}
                Location: ${selectedDistrict}, ${selectedState}
                Price Data: ${JSON.stringify(priceData)}
                
                Provide:
                1. Simple explanation of current prices (good/bad/average)
                2. Best mandi to sell in this area with reason
                3. Price trend advice (sell now or wait)
                4. Practical tip for the farmer
                
                Write in a conversational, helpful tone as if speaking directly to the farmer.
            `;

            const insights = await InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        price_analysis: { type: "string" },
                        best_mandi: { type: "string" },
                        selling_advice: { type: "string" },
                        farmer_tip: { type: "string" }
                    }
                }
            });

            setAiInsights(insights);
        } catch (error) {
            console.error("Error generating insights:", error);
        }
        setLoadingInsights(false);
    }, [filteredPrices, selectedCrop, selectedDistrict, selectedState]);

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    useEffect(() => {
        filterPrices();
    }, [filterPrices]);

    useEffect(() => {
        if (filteredPrices.length > 0) {
            generateAiInsights();
        }
    }, [generateAiInsights, filteredPrices]);

    const handleVoiceSearch = (transcript: string): void => {
        const lowerTranscript = transcript.toLowerCase();
        
        // Simple voice command processing for crops
        const cropMap = {
            'rice': 'Rice', 'chawal': 'Rice',
            'wheat': 'Wheat', 'gehun': 'Wheat',
            'cotton': 'Cotton', 'kapas': 'Cotton',
            'sugarcane': 'Sugarcane', 'ganna': 'Sugarcane',
            'tomato': 'Tomato', 'tamatar': 'Tomato',
            'onion': 'Onion', 'pyaaz': 'Onion'
        };

        for (const [voice, crop] of Object.entries(cropMap)) {
            if (lowerTranscript.includes(voice)) {
                setSelectedCrop(crop);
                break;
            }
        }
    };

    const currentPrice = filteredPrices[0];
    const historicalData = currentPrice ? generateHistoricalData(selectedCrop, currentPrice.price_modal) : [];

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Live Mandi Prices</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Real-time market rates from eNAM and Agmarknet APIs with AI insights
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        Last updated: {format(lastUpdated, 'MMM dd, yyyy HH:mm')}
                    </div>
                </div>

                {/* Location and Controls */}
                <LocationSelector
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                />

                {/* AI Insights */}
                {aiInsights && (
                    <Card className="shadow-lg border-l-4 border-l-blue-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-700">
                                <Brain className="w-5 h-5" />
                                AI Market Advisor - {selectedCrop} in {selectedDistrict}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert className="bg-blue-50 border-blue-200">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                <AlertDescription className="text-blue-800 font-medium">
                                    {aiInsights.price_analysis}
                                </AlertDescription>
                            </Alert>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h4 className="font-semibold text-green-800 mb-2">🏪 Best Mandi</h4>
                                    <p className="text-green-700">{aiInsights.best_mandi}</p>
                                </div>
                                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <h4 className="font-semibold text-amber-800 mb-2">📈 Selling Advice</h4>
                                    <p className="text-amber-700">{aiInsights.selling_advice}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <h4 className="font-semibold text-purple-800 mb-2">💡 Farmer Tip</h4>
                                <p className="text-purple-700">{aiInsights.farmer_tip}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Crop Selection and Voice Search */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <CardTitle className="flex items-center gap-2">
                                <Wheat className="w-6 h-6 text-green-700" />
                                Select Crop
                            </CardTitle>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <VoiceSearch 
                                    onVoiceResult={handleVoiceSearch}
                                    placeholder="Say crop name in Hindi or English"
                                />
                                <Button
                                    variant="outline"
                                    onClick={fetchPrices}
                                    disabled={isLoading}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    Refresh Prices
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full md:w-64">
                            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cropOptions.map(crop => (
                                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Current Prices */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                Current Prices - {selectedCrop} in {selectedDistrict}
                            </div>
                            {currentPrice && (
                                <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                                    ₹{currentPrice.price_modal}/Qtl
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">Mandi Name</TableHead>
                                        <TableHead className="font-semibold">Variety</TableHead>
                                        <TableHead className="font-semibold">Min Price (₹/Qtl)</TableHead>
                                        <TableHead className="font-semibold">Max Price (₹/Qtl)</TableHead>
                                        <TableHead className="font-semibold">Modal Price (₹/Qtl)</TableHead>
                                        <TableHead className="font-semibold">Arrival (Qtl)</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan="7" className="text-center py-8">
                                                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                Loading latest prices from government APIs...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredPrices.length > 0 ? (
                                        filteredPrices.map(price => (
                                            <TableRow key={price.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{price.mandi_name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{price.variety}</Badge>
                                                </TableCell>
                                                <TableCell className="text-red-600 font-semibold">
                                                    ₹{price.price_min}
                                                </TableCell>
                                                <TableCell className="text-green-600 font-semibold">
                                                    ₹{price.price_max}
                                                </TableCell>
                                                <TableCell className="font-bold text-blue-600 text-lg">
                                                    ₹{price.price_modal}
                                                </TableCell>
                                                <TableCell>{price.arrival_quantity?.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {format(new Date(price.price_date), 'dd MMM')}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan="7" className="text-center py-8 text-gray-500">
                                                No prices available for {selectedCrop} in {selectedDistrict}.
                                                Try selecting a different location or crop.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Price Trend Chart */}
                {historicalData.length > 0 && (
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-amber-600" />
                                7-Day Price Trend - {selectedCrop}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <LineChart data={historicalData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                                        <Tooltip 
                                            formatter={(value) => [`₹${Math.round(value)}`, 'Price/Qtl']}
                                        />
                                        <Legend />
                                        <Line 
                                            type="monotone" 
                                            dataKey="price" 
                                            stroke="#16a34a" 
                                            strokeWidth={3}
                                            dot={{ fill: '#16a34a', strokeWidth: 2, r: 6 }}
                                            activeDot={{ r: 8, stroke: '#16a34a', strokeWidth: 2 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Price Comparison */}
                {prices.length > 0 && (
                    <PriceComparison prices={prices} selectedCrop={selectedCrop} />
                )}
            </div>
        </div>
    );
}