
import React, { useState, useEffect, useCallback } from 'react';
import { GovernmentScheme, GovernmentSchemeInterface } from '@/entities/GovernmentScheme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LocationSelector from '../components/shared/LocationSelector';
import EligibilityChecker from '../components/shared/EligibilityChecker';
import {
    FileText, Check, ExternalLink, Search, Filter,
    IndianRupee, Shield, GraduationCap, Sprout, Truck, FlaskConical
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categoryIcons: Record<string, React.ReactElement> = {
    subsidy: <IndianRupee className="w-5 h-5" />,
    loan: <IndianRupee className="w-5 h-5" />,
    insurance: <Shield className="w-5 h-5" />,
    training: <GraduationCap className="w-5 h-5" />,
    equipment: <Truck className="w-5 h-5" />,
    seeds: <Sprout className="w-5 h-5" />,
    fertilizer: <FlaskConical className="w-5 h-5" />
};

export default function GovernmentSchemes() {
    const [schemes, setSchemes] = useState<GovernmentSchemeInterface[]>([]);
    const [filteredSchemes, setFilteredSchemes] = useState<GovernmentSchemeInterface[]>([]);
    const [selectedState, setSelectedState] = useState("All India");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedScheme, setSelectedScheme] = useState<GovernmentSchemeInterface | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSchemes = useCallback(async () => {
        setIsLoading(true);
        try {
            // In real implementation, this would integrate with Kisan Suvidha & Farmers' Portal APIs
            const allSchemes = await GovernmentScheme.list();
            setSchemes(allSchemes);
        } catch (error) {
            console.error("Error fetching schemes:", error);
        }
        setIsLoading(false);
    }, []); // No dependencies as `setIsLoading` and `setSchemes` are stable references from `useState`

    const filterSchemes = useCallback(() => {
        let result = schemes;

        // Filter by state
        if (selectedState && selectedState !== "All India") {
            result = result.filter(s => s.state === selectedState || s.state === "All India");
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.scheme_name.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query) ||
                s.benefits.some(b => b.toLowerCase().includes(query))
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter(s => s.category === selectedCategory);
        }

        setFilteredSchemes(result);
    }, [schemes, selectedState, searchQuery, selectedCategory]);

    useEffect(() => {
        fetchSchemes();
    }, [fetchSchemes]);

    useEffect(() => {
        filterSchemes();
    }, [filterSchemes]);

    const categoryColors: Record<string, string> = {
        subsidy: "bg-green-100 text-green-800 border-green-200",
        loan: "bg-blue-100 text-blue-800 border-blue-200",
        insurance: "bg-amber-100 text-amber-800 border-amber-200",
        training: "bg-purple-100 text-purple-800 border-purple-200",
        equipment: "bg-indigo-100 text-indigo-800 border-indigo-200",
        seeds: "bg-lime-100 text-lime-800 border-lime-200",
        fertilizer: "bg-orange-100 text-orange-800 border-orange-200"
    };

    const categories = [
        { value: "all", label: "All Categories" },
        { value: "subsidy", label: "Subsidies" },
        { value: "loan", label: "Loans" },
        { value: "insurance", label: "Insurance" },
        { value: "training", label: "Training" },
        { value: "equipment", label: "Equipment" },
        { value: "seeds", label: "Seeds" }
    ];

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Government Schemes</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Access central and state government schemes with eligibility checking
                    </p>
                </div>

                {/* Location and Search */}
                <div className="space-y-4">
                    <LocationSelector
                        selectedState={selectedState}
                        setSelectedState={setSelectedState}
                        selectedDistrict={selectedDistrict}
                        setSelectedDistrict={setSelectedDistrict}
                    />

                    <Card className="shadow-lg">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <Input
                                        placeholder="Search schemes by name, description, or benefits..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-64">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="all">All</TabsTrigger>
                                            <TabsTrigger value="subsidy">Subsidies</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                        Found <span className="font-bold text-gray-900">{filteredSchemes.length}</span> schemes
                        {selectedState !== "All India" && <span> for {selectedState}</span>}
                    </p>
                </div>

                {/* Schemes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full text-center py-12">
                            <FileText className="w-12 h-12 animate-pulse text-orange-400 mx-auto mb-4" />
                            <p className="text-lg text-gray-600">Loading schemes from government portals...</p>
                        </div>
                    ) : filteredSchemes.length > 0 ? (
                        filteredSchemes.map(scheme => (
                            <Card
                                key={scheme.id}
                                className={`flex flex-col justify-between shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${selectedScheme?.id === scheme.id ? 'ring-2 ring-orange-400' : ''
                                    }`}
                                onClick={() => setSelectedScheme(selectedScheme?.id === scheme.id ? null : scheme)}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg leading-tight pr-2">
                                            {scheme.scheme_name}
                                        </CardTitle>
                                        <div className="flex flex-col gap-1">
                                            <Badge className={`${categoryColors[scheme.category]} border flex items-center gap-1`}>
                                                {categoryIcons[scheme.category]}
                                                <span className="text-xs">{scheme.category}</span>
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {scheme.state}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                        {scheme.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Key Benefits:</h4>
                                        <ul className="list-none space-y-1 text-sm text-gray-600">
                                            {scheme.benefits.slice(0, 2).map((benefit, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-2">{benefit}</span>
                                                </li>
                                            ))}
                                            {scheme.benefits.length > 2 && (
                                                <li className="text-xs text-gray-500">
                                                    +{scheme.benefits.length - 2} more benefits
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {scheme.deadline && (
                                        <div className="text-sm">
                                            <span className="font-medium text-red-600">Deadline: </span>
                                            <span className="text-gray-700">
                                                {new Date(scheme.deadline).toLocaleDateString('en-IN')}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>

                                <div className="p-6 pt-0">
                                    <div className="flex gap-2">
                                        <Button
                                            asChild
                                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                                        >
                                            <a
                                                href={scheme.official_website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Apply Now
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedScheme(selectedScheme?.id === scheme.id ? null : scheme);
                                            }}
                                        >
                                            Check Eligibility
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg text-gray-600">No schemes found matching your criteria</p>
                            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or location filters</p>
                        </div>
                    )}
                </div>

                {/* Eligibility Checker */}
                {selectedScheme && (
                    <EligibilityChecker
                        scheme={selectedScheme}
                        onEligibilityCheck={(result) => {
                            console.log("Eligibility result:", result);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
