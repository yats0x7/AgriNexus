
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeedVariety, SeedVarietyInterface } from '@/entities/SeedVariety';
import { SeedVendor, SeedVendorInterface } from '@/entities/SeedVendor';
import LocationSelector from '../components/shared/LocationSelector';
import SeedSuggestionWidget from '../components/widgets/SeedSuggestionWidget';
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
    Verified
} from 'lucide-react';

export default function SeedMarketplace() {
    const [selectedState, setSelectedState] = useState("Punjab");
    const [selectedDistrict, setSelectedDistrict] = useState("Ludhiana");
    const [seeds, setSeeds] = useState<SeedVarietyInterface[]>([]);
    const [vendors, setVendors] = useState<SeedVendorInterface[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    const fetchSeedsAndVendors = React.useCallback(async () => {
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
    }, [selectedState, selectedDistrict]); // Dependencies for useCallback

    useEffect(() => {
        fetchSeedsAndVendors();
    }, [fetchSeedsAndVendors]); // Dependency for useEffect

    const filteredSeeds = seeds.filter(seed => {
        const matchesSearch = seed.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seed.variety.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" ||
            seed.seed_type.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
    });

    const categories = ["all", "hybrid", "certified", "organic"];

    const getAvailabilityColor = (status: string) => {
        const colors: Record<string, string> = {
            'InStock': 'bg-green-100 text-green-800',
            'Limited': 'bg-yellow-100 text-yellow-800',
            'OutOfStock': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-emerald-50">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <Sprout className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900">Seeds Marketplace</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover certified seeds from government-approved suppliers with AI recommendations
                    </p>
                </div>

                {/* Location Selector */}
                <LocationSelector
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    selectedDistrict={selectedDistrict}
                    setSelectedDistrict={setSelectedDistrict}
                />

                <Tabs defaultValue="suggestions" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="suggestions" className="flex items-center gap-2">
                            <Sprout className="w-4 h-4" />
                            AI Suggestions
                        </TabsTrigger>
                        <TabsTrigger value="marketplace" className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Browse Seeds
                        </TabsTrigger>
                        <TabsTrigger value="vendors" className="flex items-center gap-2">
                            <Verified className="w-4 h-4" />
                            Certified Vendors
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="suggestions" className="mt-8">
                        <SeedSuggestionWidget
                            state={selectedState}
                            district={selectedDistrict}
                        />
                    </TabsContent>

                    <TabsContent value="marketplace" className="mt-8">
                        {/* Search and Filter */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <Input
                                            placeholder="Search seeds by crop name or variety..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-gray-500" />
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat === 'all' ? 'All Types' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seeds Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSeeds.map(seed => (
                                <Card key={seed.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{seed.crop_name}</CardTitle>
                                                <p className="text-gray-600">Variety: {seed.variety}</p>
                                                <p className="text-sm text-gray-500">{seed.supplier_name}</p>
                                            </div>
                                            <Badge className={getAvailabilityColor(seed.availability_status)}>
                                                {seed.availability_status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="font-medium">Type</p>
                                                <p>{seed.seed_type}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Certification</p>
                                                <p>{seed.certification}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Price</p>
                                                <p className="font-bold text-green-600">₹{seed.price}/{seed.unit}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Expected Yield</p>
                                                <p>{seed.expected_yield}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-medium text-sm mb-2">Suitable Soils:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {seed.soil_suitability.slice(0, 3).map(soil => (
                                                    <Badge key={soil} variant="outline" className="text-xs">
                                                        {soil}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span className="text-sm font-medium">
                                                    {seed.suitability_score || 'N/A'}% match
                                                </span>
                                            </div>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                Contact Supplier
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {filteredSeeds.length === 0 && !isLoading && (
                            <div className="text-center py-12">
                                <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-lg text-gray-600">No seeds found matching your criteria</p>
                                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="vendors" className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vendors.map(vendor => (
                                <Card key={vendor.id} className="shadow-lg">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="flex items-center gap-2">
                                                {vendor.certification_status === 'certified' && (
                                                    <Verified className="w-5 h-5 text-green-500" />
                                                )}
                                                {vendor.vendor_name}
                                            </CardTitle>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span>{vendor.rating || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {vendor.location}
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="font-medium text-sm mb-2">Available Crops:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {vendor.crops_available.slice(0, 4).map(crop => (
                                                    <Badge key={crop} variant="secondary" className="text-xs">
                                                        {crop}
                                                    </Badge>
                                                ))}
                                                {vendor.crops_available.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{vendor.crops_available.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span>Certification:</span>
                                            <Badge className={vendor.certification_status === 'certified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                                {vendor.certification_status}
                                            </Badge>
                                        </div>

                                        {vendor.delivery_available && (
                                            <div className="flex justify-between items-center text-sm">
                                                <span>Delivery:</span>
                                                <span className="text-green-600">
                                                    Within {vendor.delivery_radius || 50} km
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1">
                                                <Phone className="w-4 h-4 mr-1" />
                                                Call
                                            </Button>
                                            {vendor.email && (
                                                <Button size="sm" variant="outline" className="flex-1">
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    Email
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
