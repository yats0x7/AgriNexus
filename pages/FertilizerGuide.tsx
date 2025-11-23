import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FlaskConical, Search, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { InvokeLLM } from "@/integrations/Core";

export default function FertilizerGuide() {
    interface Alternative {
        name: string;
        description: string;
    }

    interface AnalysisResult {
        fertilizer?: string;
        toxicity_level?: string;
        environmental_impact?: string;
        alternatives?: Alternative[];
        error?: string;
    }

    const [fertilizerName, setFertilizerName] = useState("");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkToxicity = async () => {
        if (!fertilizerName) return;
        setIsLoading(true);
        setResult(null);

        try {
            const prompt = `
                Provide a toxicity analysis for the fertilizer "${fertilizerName}". 
                Include its main chemical components, toxicity level (Low, Medium, High, Very High), 
                potential environmental impact, and suggest 2-3 safer, eco-friendly or organic alternatives with brief descriptions.
            `;
            const responseStr = await InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        fertilizer: { type: "string" },
                        toxicity_level: { type: "string", enum: ["Low", "Medium", "High", "Very High"] },
                        environmental_impact: { type: "string" },
                        alternatives: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    description: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            const llmResult = JSON.parse(responseStr);
            setResult(llmResult);
        } catch (error) {
            console.error("Error checking toxicity:", error);
            setResult({ error: "Could not retrieve information for this fertilizer. Please try another name." });
        } finally {
            setIsLoading(false);
        }
    };

    const toxicityColors = {
        "Low": "bg-green-100 border-green-300 text-green-800",
        "Medium": "bg-yellow-100 border-yellow-300 text-yellow-800",
        "High": "bg-orange-100 border-orange-300 text-orange-800",
        "Very High": "bg-red-100 border-red-300 text-red-800",
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-amber-50 via-white to-lime-50">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <FlaskConical className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Fertilizer Guide</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Check fertilizer toxicity and discover safer, eco-friendly alternatives.
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Check Fertilizer Toxicity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="Enter fertilizer name (e.g., Urea, DAP)"
                            value={fertilizerName}
                            onChange={(e) => setFertilizerName(e.target.value)}
                        />
                        <Button onClick={checkToxicity} disabled={isLoading} className="bg-amber-500 hover:bg-amber-600">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Analyze
                        </Button>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="shadow-xl">
                        {result.error ? (
                            <CardContent className="p-6">
                                <Alert className="bg-red-50 border-red-200 text-red-800">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{result.error}</AlertDescription>
                                </Alert>
                            </CardContent>
                        ) : (
                            <>
                                <CardHeader>
                                    <CardTitle>Analysis for: {result.fertilizer}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Alert className={toxicityColors[result.toxicity_level as keyof typeof toxicityColors] || "bg-gray-100"}>
                                        <AlertTitle className="flex items-center gap-2">
                                            <AlertCircle /> Toxicity Level: {result.toxicity_level}
                                        </AlertTitle>
                                        <AlertDescription>
                                            {result.environmental_impact}
                                        </AlertDescription>
                                    </Alert>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Leaf className="text-green-600" />
                                            Safer Alternatives
                                        </h3>
                                        <div className="space-y-4">
                                            {result.alternatives?.map((alt, index) => (
                                                <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                                                    <h4 className="font-bold text-green-800">{alt.name}</h4>
                                                    <p className="text-gray-600">{alt.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}