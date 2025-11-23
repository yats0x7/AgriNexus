
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SeedVariety, SeedVarietyInterface } from '@/entities/SeedVariety';
import { SeedVendor, SeedVendorInterface } from '@/entities/SeedVendor';
import LocationSelector from '../components/shared/LocationSelector';
import {
    Sprout,
    Search,
    ShoppingCart,
    Star,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Filter,
    Verified,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Calendar,
    Package,
    MessageSquare
} from 'lucide-react';
import { format } from 'date-fns';

export default function SeedMarketplace() {
    const [selectedState, setSelectedState] = useState("Punjab");
    const [selectedDistrict, setSelectedDistrict] = useState("Ludhiana");
    const [seeds, setSeeds] = useState<SeedVarietyInterface[]>([]);
    const [vendors, setVendors] = useState<SeedVendorInterface[]>([]);
    const [filteredSeeds, setFilteredSeeds] = useState<SeedVarietyInterface[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSoil, setSelectedSoil] = useState("");
    const [selectedSeason, setSelectedSeason] = useState("");
    const [selectedCrop, setSelectedCrop] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSeed, setSelectedSeed] = useState<SeedVarietyInterface | null>(null);
    const [showModal, setShowModal] = useState(false);

    const soilTypes = ["Loamy", "Clay", "Sandy", "Alluvial", "Black", "Red", "Laterite"];
    const seasons = ["Kharif", "Rabi", "Zaid"];
    const crops = ["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Onion", "Potato", "Sugarcane"];

    const fetchSeedsAndVendors = useCallback(async () => {
        setIsLoading(true);
        try {
            const [seedData, vendorData] = await Promise.all([
                SeedVariety.filter({ state: selectedState, district: selectedDistrict }),
                SeedVendor.filter({ location: `${selectedDistrict}, ${selectedState}` })
            ]);
            setSeeds(seedData);
            setVendors(vendorData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setIsLoading(false);
    }, [selectedState, selectedDistrict]);

    const filterSeeds = useCallback(() => {
        let result = seeds;

        if (searchQuery) {
            result = result.filter(seed =>
                seed.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seed.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seed.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedSoil) {
            result = result.filter(seed =>
                seed.soil_suitability?.includes(selectedSoil)
            );
        }

        if (selectedSeason) {
            result = result.filter(seed => seed.recommended_season === selectedSeason);
        }

        if (selectedCrop) {
            result = result.filter(seed => seed.crop_name === selectedCrop);
        }

        // Sort by suitability score
        result = result.sort((a, b) => (b.suitability_score || 0) - (a.suitability_score || 0));

        setFilteredSeeds(result);
    }, [seeds, searchQuery, selectedSoil, selectedSeason, selectedCrop]);

    useEffect(() => {
        fetchSeedsAndVendors();
    }, [fetchSeedsAndVendors]);

    useEffect(() => {
        filterSeeds();
    }, [filterSeeds]);

    const getAvailabilityBadge = (status: string) => {
        const configs: Record<string, { color: string; label: string }> = {
            InStock: { color: "bg-green-100 text-green-800", label: "In Stock" },
            Limited: { color: "bg-yellow-100 text-yellow-800", label: "Limited" },
            OutOfStock: { color: "bg-red-100 text-red-800", label: "Out of Stock" }
        };
        return configs[status] || configs.OutOfStock;
    };

    const getCertificationBadge = (cert: string) => {
        const configs: Record<string, { color: string; label: string }> = {
            NSC: { color: "bg-blue-100 text-blue-800", label: "NSC Certified" },
            StateCertified: { color: "bg-purple-100 text-purple-800", label: "State Certified" },
            None: { color: "bg-gray-100 text-gray-800", label: "Not Certified" }
        };
        return configs[cert] || configs.None;
    };

    const handleCallSupplier = (phone: string) => {
        window.open(`tel:${phone}`, '_self');
    };

    const handleWhatsApp = (phone: string) => {
        window.open(`https://wa.me/${phone}`, '_blank');
    };

    const SeedDetailModal = () => {
        if (!showModal || !selectedSeed) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-2xl">{selectedSeed.crop_name} - {selectedSeed.variety}</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>×</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-sm text-gray-700">Seed Type</h4>
                                    <p className="text-lg">{selectedSeed.seed_type}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-sm text-gray-700">Expected Yield</h4>
                                    <p className="text-lg">{selectedSeed.expected_yield}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-sm text-gray-700">Price</h4>
                                    <p className="text-lg">₹{selectedSeed.price}/{selectedSeed.unit}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-sm text-gray-700">Certification</h4>
                                    <Badge className={getCertificationBadge(selectedSeed.certification).color}>
                                        {getCertificationBadge(selectedSeed.certification).label}
                                    </Badge>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-sm text-gray-700">Recommended Season</h4>
                                    <p className="text-lg">{selectedSeed.recommended_season}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <h4 className="font-semibold text-sm text-gray-700">Suitability Score</h4>
                                    <p className="text-lg font-bold text-green-600">{selectedSeed.suitability_score}%</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Suitable Soil Types</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedSeed.soil_suitability?.map(soil => (
                                    <Badge key={soil} variant="outline">{soil}</Badge>
                                ))}
                            </div>
                        </div>

                        {selectedSeed.sowing_window && (
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Optimal Sowing Window</h4>
                                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                    <span>{selectedSeed.sowing_window.start_date} to {selectedSeed.sowing_window.end_date}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-gray-700 mb-3">Supplier Information</h4>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{selectedSeed.supplier_name}</span>
                                    <Badge className={getAvailabilityBadge(selectedSeed.availability_status).color}>
                                        {getAvailabilityBadge(selectedSeed.availability_status).label}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeed.supplier_contact?.phone && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleCallSupplier(selectedSeed.supplier_contact?.phone!)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Supplier
                                        </Button>
                                    )}
                                    {selectedSeed.supplier_contact?.phone && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleWhatsApp(selectedSeed.supplier_contact?.phone!)}
                                        >
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            WhatsApp
                                        </Button>
                                    )}
                                    {selectedSeed.source_link && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                        >
                                            <a href={selectedSeed.source_link} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Official Source
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Data sourced from {selectedSeed.source} - Last updated: {selectedSeed.last_updated ? format(new Date(selectedSeed.last_updated), 'MMM dd, yyyy') : 'N/A'}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-lime-50 via-white to-green-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-lime-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <Sprout className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Seeds Marketplace</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find government-certified seeds & varieties available in your area
                    </p>
                    <Button
                        onClick={() => document.getElementById('searchForm')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-lime-600 hover:bg-lime-700 text-lg px-8 py-3"
                    >
                        Find Seeds
                    </Button>
                </div>

                {/* Search Form */}
                <Card id="searchForm" className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5 text-lime-600" />
                            Search by Location & Soil
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <LocationSelector
                            selectedState={selectedState}
                            setSelectedState={setSelectedState}
                            selectedDistrict={selectedDistrict}
                            setSelectedDistrict={setSelectedDistrict}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Soil Type</label>
                                <Select value={selectedSoil} onValueChange={setSelectedSoil}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select soil type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Soil Types</SelectItem>
                                        {soilTypes.map(soil => (
                                            <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Season</label>
                                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select season" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Seasons</SelectItem>
                                        {seasons.map(season => (
                                            <SelectItem key={season} value={season}>{season}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Crop (Optional)</label>
                                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Crops</SelectItem>
                                        {crops.map(crop => (
                                            <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">Search Seeds</label>
                                <Input
                                    placeholder="Search by crop, variety, or supplier..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Section */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Top Recommended Seeds {selectedCrop && `for ${selectedCrop}`}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">
                                {filteredSeeds.length} results
                            </Badge>
                            {selectedState && (
                                <Badge variant="outline">
                                    {selectedDistrict}, {selectedState}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-lime-500 mx-auto mb-4" />
                            <p className="text-lg text-gray-600">Searching seeds from government databases...</p>
                            <p className="text-sm text-gray-500">Sources: SeedNet, Kisan Suvidha, Farmers' Portal</p>
                        </div>
                    ) : filteredSeeds.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSeeds.map((seed) => (
                                <Card key={seed.id} className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl text-lime-700 mb-1">
                                                    {seed.crop_name}
                                                </CardTitle>
                                                <p className="text-gray-600 font-medium">{seed.variety}</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <Badge className="bg-lime-100 text-lime-800">
                                                    <Star className="w-3 h-3 mr-1" />
                                                    {seed.suitability_score}%
                                                </Badge>
                                                <Badge className={getAvailabilityBadge(seed.availability_status).color}>
                                                    {getAvailabilityBadge(seed.availability_status).label}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 font-medium">Expected Yield</p>
                                                <p className="text-sm font-bold text-blue-800">{seed.expected_yield}</p>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <p className="text-xs text-green-600 font-medium">Season</p>
                                                <p className="text-sm font-bold text-green-800">{seed.recommended_season}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Suitable Soils:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {seed.soil_suitability?.slice(0, 3).map(soil => (
                                                    <Badge key={soil} variant="outline" className="text-xs">{soil}</Badge>
                                                ))}
                                                {seed.soil_suitability?.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">+{seed.soil_suitability.length - 3}</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t pt-3">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700">Supplier:</span>
                                                <Badge className={getCertificationBadge(seed.certification).color}>
                                                    <Verified className="w-3 h-3 mr-1" />
                                                    {getCertificationBadge(seed.certification).label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{seed.supplier_name}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Button
                                                onClick={() => {
                                                    setSelectedSeed(seed);
                                                    setShowModal(true);
                                                }}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                View Details
                                            </Button>

                                            <div className="grid grid-cols-2 gap-2">
                                                {seed.supplier_contact?.phone && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleCallSupplier(seed.supplier_contact?.phone!)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Phone className="w-3 h-3 mr-1" />
                                                        Call
                                                    </Button>
                                                )}
                                                {seed.source_link && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <a href={seed.source_link} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-3 h-3 mr-1" />
                                                            Source
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="shadow-lg">
                            <CardContent className="text-center py-12">
                                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Seeds Found</h3>
                                <p className="text-gray-600 mb-4">
                                    No certified seeds found for your location and criteria.
                                </p>
                                <div className="space-y-2">
                                    <Button onClick={fetchSeedsAndVendors} className="bg-lime-600 hover:bg-lime-700">
                                        Retry Search
                                    </Button>
                                    <p className="text-sm text-gray-500">
                                        Try selecting a different location or remove some filters
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Vendors Section */}
                {vendors.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Certified Vendors in {selectedDistrict}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendors.map((vendor) => (
                                <Card key={vendor.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{vendor.vendor_name}</CardTitle>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="font-bold text-sm">{vendor.rating}</span>
                                            </div>
                                        </div>
                                        <Badge className={vendor.certification_status === 'certified' ?
                                            'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                            <Verified className="w-3 h-3 mr-1" />
                                            {vendor.certification_status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Available Crops:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {vendor.crops_available.slice(0, 3).map(crop => (
                                                    <Badge key={crop} variant="outline" className="text-xs">{crop}</Badge>
                                                ))}
                                                {vendor.crops_available.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">+{vendor.crops_available.length - 3}</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4" />
                                                <span>{vendor.location}</span>
                                            </div>
                                            {vendor.delivery_available && (
                                                <div className="flex items-center gap-2 text-sm text-green-600">
                                                    <Package className="w-4 h-4" />
                                                    <span>Delivery within {vendor.delivery_radius}km</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Button
                                                onClick={() => handleCallSupplier(vendor.contact_number)}
                                                className="w-full bg-green-600 hover:bg-green-700"
                                            >
                                                <Phone className="w-4 h-4 mr-2" />
                                                Contact Vendor
                                            </Button>
                                            {vendor.email && (
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                    className="w-full"
                                                >
                                                    <a href={`mailto:${vendor.email}`}>
                                                        <Mail className="w-4 h-4 mr-2" />
                                                        Email
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer with Data Sources */}
                <Card className="shadow-lg bg-gray-50">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                <strong>Data Sources:</strong> SeedNet, Kisan Suvidha, Farmers' Portal
                            </p>
                            <p className="text-xs text-gray-500">
                                Last updated: {filteredSeeds[0]?.last_updated ? format(new Date(filteredSeeds[0].last_updated), 'MMM dd, yyyy HH:mm') : 'N/A'}
                            </p>
                            <div className="flex justify-center gap-4 text-xs text-gray-500">
                                <a href="/privacy" className="hover:text-gray-700">Privacy</a>
                                <a href="/help" className="hover:text-gray-700">Help</a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <SeedDetailModal />
        </div>
    );
}
