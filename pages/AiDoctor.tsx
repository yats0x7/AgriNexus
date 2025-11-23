import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Camera,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  Brain,
  Lightbulb
} from "lucide-react";
import { CropDiagnosis, CropDiagnosisInterface } from "@/entities/CropDiagnosis";
import { UploadFile, InvokeLLM } from "@/integrations/Core";

interface DiagnosisResult extends Partial<CropDiagnosisInterface> {
  prevention_tips?: string[];
  disease_identified?: string;
}

export default function AiDoctor() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    farmer_name: "",
    crop_type: "",
    problem_description: "",
    location: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cropTypes = [
    "Rice", "Wheat", "Maize", "Sugarcane", "Cotton", "Soybeans", "Tomato",
    "Potato", "Onion", "Chili", "Groundnut", "Sunflower", "Mustard", "Tea", "Coffee"
  ];

  const handleImageUpload = async (files: File[]) => {
    const imageUrls: string[] = [];
    setIsAnalyzing(true);

    try {
      for (const file of files) {
        const file_url = await UploadFile(file);
        imageUrls.push(file_url);
      }
      setUploadedImages(prev => [...prev, ...imageUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    setIsAnalyzing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleImageUpload(files);
    }
  };

  const analyzeCrop = async () => {
    if (!formData.crop_type || !formData.problem_description || uploadedImages.length === 0) {
      alert("Please fill all required fields and upload at least one image");
      return;
    }

    setIsAnalyzing(true);

    try {
      const prompt = `
        You are an expert agricultural pathologist. Analyze the crop images and provide a detailed diagnosis.
        
        Crop Type: ${formData.crop_type}
        Problem Description: ${formData.problem_description}
        Location: ${formData.location}
        
        Based on the uploaded images and description, provide:
        1. Detailed diagnosis of the crop condition
        2. Possible diseases or pest issues
        3. Recommended treatment and prevention measures
        4. Confidence level of your diagnosis (0-1)
        5. Severity assessment (low, medium, high, critical)
        
        Be specific, practical, and farmer-friendly in your recommendations.
      `;

      const responseStr = await InvokeLLM({
        prompt,
        file_urls: uploadedImages,
        response_json_schema: {
          type: "object",
          properties: {
            diagnosis: { type: "string" },
            disease_identified: { type: "string" },
            recommended_solutions: {
              type: "array",
              items: { type: "string" }
            },
            confidence_score: { type: "number" },
            severity: { type: "string" },
            prevention_tips: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      const result = JSON.parse(responseStr);

      // Save diagnosis to database
      const savedDiagnosis = await CropDiagnosis.create({
        ...formData,
        image_urls: uploadedImages,
        ai_diagnosis: result.diagnosis,
        recommended_solution: result.recommended_solutions,
        confidence_score: result.confidence_score,
        severity: result.severity,
        status: "diagnosed"
      });

      setDiagnosis({
        ...savedDiagnosis,
        prevention_tips: result.prevention_tips || [],
        disease_identified: result.disease_identified
      });

    } catch (error) {
      console.error("Error analyzing crop:", error);
      alert("Error analyzing crop. Please try again.");
    }

    setIsAnalyzing(false);
  };

  const resetForm = () => {
    setDiagnosis(null);
    setUploadedImages([]);
    setFormData({
      farmer_name: "",
      crop_type: "",
      problem_description: "",
      location: ""
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">AI Crop Doctor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered diagnosis for your crop diseases and pest problems
          </p>
        </div>

        {!diagnosis ? (
          <div className="space-y-6">
            {/* Image Upload */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Upload Crop Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Clear Images of Affected Crops
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Take clear photos of leaves, stems, fruits, or any affected parts
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Select Images
                      </Button>
                    </div>
                  </div>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Uploaded Images ({uploadedImages.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Crop image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Crop Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmer_name">Farmer Name</Label>
                    <Input
                      id="farmer_name"
                      value={formData.farmer_name}
                      onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Village, District, State"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="crop_type">Crop Type *</Label>
                  <Select
                    value={formData.crop_type}
                    onValueChange={(value) => setFormData({ ...formData, crop_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem_description">Problem Description *</Label>
                  <Textarea
                    id="problem_description"
                    value={formData.problem_description}
                    onChange={(e) => setFormData({ ...formData, problem_description: e.target.value })}
                    placeholder="Describe what you've observed - leaf color changes, spots, wilting, pest damage, etc."
                    className="h-32"
                  />
                </div>

                <Button
                  onClick={analyzeCrop}
                  disabled={isAnalyzing || uploadedImages.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-6"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Crop Images...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Get AI Diagnosis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Diagnosis Results */
          <div className="space-y-6">
            <Card className="shadow-xl border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    AI Diagnosis Complete
                  </div>
                  <Badge variant={
                    diagnosis.severity === 'critical' ? 'destructive' :
                      diagnosis.severity === 'high' ? 'destructive' :
                        diagnosis.severity === 'medium' ? 'secondary' : 'outline'
                  }>
                    {diagnosis.severity?.toUpperCase()} Severity
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Diagnosis</h3>
                  <p className="text-gray-700 leading-relaxed">{diagnosis.ai_diagnosis}</p>
                </div>

                {diagnosis.disease_identified && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Identified Issue:</strong> {diagnosis.disease_identified}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Recommended Solutions
                  </h3>
                  <ul className="space-y-2">
                    {diagnosis.recommended_solution?.map((solution, index) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {diagnosis.prevention_tips && diagnosis.prevention_tips.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prevention Tips</h3>
                    <ul className="space-y-2">
                      {diagnosis.prevention_tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                          <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Confidence Score: <span className="font-semibold">{Math.round((diagnosis.confidence_score || 0) * 100)}%</span>
                  </div>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="bg-white hover:bg-gray-50"
                  >
                    New Diagnosis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}