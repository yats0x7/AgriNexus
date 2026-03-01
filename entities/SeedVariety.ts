export interface SeedVarietyInterface {
    id: string;
    crop_name: string;
    variety: string;
    seed_type: string;
    state: string;
    district: string;
    availability_status: string;
    supplier_name: string;
    price: number;
    unit: string;
    certification: string;
    expected_yield: string;
    soil_suitability: string[];
    suitability_score: number;
    recommended_season?: string;
    sowing_window?: {
        start_date: string;
        end_date: string;
    };
    supplier_contact?: {
        phone: string;
    };
    source?: string;
    source_link?: string;
    last_updated?: string;
}

const allSeeds: SeedVarietyInterface[] = [
    // Punjab
    { id: "1", crop_name: "Wheat", variety: "HD-2967", seed_type: "Certified", state: "Punjab", district: "Ludhiana", availability_status: "InStock", supplier_name: "Punjab State Seed Corp", price: 40, unit: "kg", certification: "StateCertified", expected_yield: "50-55 q/ha", soil_suitability: ["Loamy", "Alluvial"], suitability_score: 95, recommended_season: "Rabi", sowing_window: { start_date: "Nov 01", end_date: "Nov 25" } },
    { id: "2", crop_name: "Rice", variety: "PR-126", seed_type: "Certified", state: "Punjab", district: "Ludhiana", availability_status: "InStock", supplier_name: "National Seeds Corp", price: 35, unit: "kg", certification: "NSC", expected_yield: "70-75 q/ha", soil_suitability: ["Clay", "Loamy"], suitability_score: 90, recommended_season: "Kharif", sowing_window: { start_date: "Jun 15", end_date: "Jul 10" } },
    { id: "3", crop_name: "Cotton", variety: "RCH-773", seed_type: "Hybrid", state: "Punjab", district: "Bathinda", availability_status: "Limited", supplier_name: "Private Vendor", price: 800, unit: "packet", certification: "None", expected_yield: "25-30 q/ha", soil_suitability: ["Black", "Alluvial"], suitability_score: 85, recommended_season: "Kharif" },
    { id: "4", crop_name: "Maize", variety: "PMH-1", seed_type: "Hybrid", state: "Punjab", district: "Amritsar", availability_status: "InStock", supplier_name: "PAU Seeds", price: 280, unit: "kg", certification: "StateCertified", expected_yield: "60-65 q/ha", soil_suitability: ["Loamy", "Sandy"], suitability_score: 88, recommended_season: "Kharif" },

    // Maharashtra
    { id: "5", crop_name: "Soybean", variety: "JS-9560", seed_type: "Certified", state: "Maharashtra", district: "Pune", availability_status: "InStock", supplier_name: "Mahabeej", price: 80, unit: "kg", certification: "StateCertified", expected_yield: "25-30 q/ha", soil_suitability: ["Black", "Red"], suitability_score: 92, recommended_season: "Kharif", sowing_window: { start_date: "Jun 15", end_date: "Jul 15" } },
    { id: "6", crop_name: "Onion", variety: "Phule Samarth", seed_type: "Improved", state: "Maharashtra", district: "Nashik", availability_status: "InStock", supplier_name: "MPKV Seeds", price: 800, unit: "kg", certification: "University", expected_yield: "300-400 q/ha", soil_suitability: ["Loamy", "Red"], suitability_score: 90, recommended_season: "Rabi" },
    { id: "7", crop_name: "Sugarcane", variety: "Co-86032", seed_type: "Certified", state: "Maharashtra", district: "Solapur", availability_status: "InStock", supplier_name: "VSI Pune", price: 150, unit: "bundle", certification: "Research", expected_yield: "1000-1200 q/ha", soil_suitability: ["Black", "Alluvial"], suitability_score: 93, recommended_season: "Zaid" },
    { id: "8", crop_name: "Cotton", variety: "BGII Bollgard", seed_type: "Hybrid", state: "Maharashtra", district: "Nagpur", availability_status: "InStock", supplier_name: "Mahyco Seeds", price: 850, unit: "packet", certification: "NSC", expected_yield: "20-25 q/ha", soil_suitability: ["Black"], suitability_score: 87, recommended_season: "Kharif" },

    // Uttar Pradesh
    { id: "9", crop_name: "Wheat", variety: "PBW-343", seed_type: "Certified", state: "Uttar Pradesh", district: "Lucknow", availability_status: "InStock", supplier_name: "UP State Seed Corp", price: 38, unit: "kg", certification: "StateCertified", expected_yield: "45-50 q/ha", soil_suitability: ["Alluvial", "Loamy"], suitability_score: 91, recommended_season: "Rabi" },
    { id: "10", crop_name: "Rice", variety: "Sona Masuri", seed_type: "Certified", state: "Uttar Pradesh", district: "Varanasi", availability_status: "InStock", supplier_name: "IARI Seeds", price: 45, unit: "kg", certification: "IARI", expected_yield: "55-60 q/ha", soil_suitability: ["Alluvial", "Clay"], suitability_score: 89, recommended_season: "Kharif" },
    { id: "11", crop_name: "Potato", variety: "Kufri Bahar", seed_type: "Foundation", state: "Uttar Pradesh", district: "Agra", availability_status: "InStock", supplier_name: "CPRI Shimla", price: 30, unit: "kg", certification: "CPRI", expected_yield: "250-300 q/ha", soil_suitability: ["Sandy", "Loamy"], suitability_score: 94, recommended_season: "Rabi" },
    { id: "12", crop_name: "Sugarcane", variety: "CoS-8436", seed_type: "Certified", state: "Uttar Pradesh", district: "Muzaffarnagar", availability_status: "InStock", supplier_name: "IISR Lucknow", price: 120, unit: "bundle", certification: "Research", expected_yield: "800-1000 q/ha", soil_suitability: ["Alluvial", "Loamy"], suitability_score: 92, recommended_season: "Zaid" },

    // Karnataka
    { id: "13", crop_name: "Ragi", variety: "GPU-28", seed_type: "Improved", state: "Karnataka", district: "Bangalore Rural", availability_status: "InStock", supplier_name: "KSSCA", price: 35, unit: "kg", certification: "StateCertified", expected_yield: "35-40 q/ha", soil_suitability: ["Red", "Laterite"], suitability_score: 91, recommended_season: "Kharif" },
    { id: "14", crop_name: "Rice", variety: "KRH-4", seed_type: "Hybrid", state: "Karnataka", district: "Shimoga", availability_status: "InStock", supplier_name: "UAS Bangalore", price: 60, unit: "kg", certification: "University", expected_yield: "65-70 q/ha", soil_suitability: ["Clay", "Red"], suitability_score: 88, recommended_season: "Kharif" },
    { id: "15", crop_name: "Maize", variety: "NAH-2049", seed_type: "Hybrid", state: "Karnataka", district: "Davanagere", availability_status: "InStock", supplier_name: "Pioneer Seeds", price: 320, unit: "kg", certification: "NSC", expected_yield: "80-90 q/ha", soil_suitability: ["Red", "Black"], suitability_score: 86, recommended_season: "Kharif" },

    // Gujarat
    { id: "16", crop_name: "Groundnut", variety: "GG-20", seed_type: "Certified", state: "Gujarat", district: "Junagadh", availability_status: "InStock", supplier_name: "Gujarat Seed Corp", price: 65, unit: "kg", certification: "StateCertified", expected_yield: "25-30 q/ha", soil_suitability: ["Sandy", "Red"], suitability_score: 93, recommended_season: "Kharif" },
    { id: "17", crop_name: "Cotton", variety: "Shankar-6", seed_type: "Hybrid", state: "Gujarat", district: "Rajkot", availability_status: "InStock", supplier_name: "Nuziveedu Seeds", price: 900, unit: "packet", certification: "NSC", expected_yield: "22-28 q/ha", soil_suitability: ["Black", "Alluvial"], suitability_score: 85, recommended_season: "Kharif" },
    { id: "18", crop_name: "Cumin", variety: "Gujarat Cumin-4", seed_type: "Improved", state: "Gujarat", district: "Mehsana", availability_status: "Limited", supplier_name: "SDAU Seeds", price: 250, unit: "kg", certification: "University", expected_yield: "8-10 q/ha", soil_suitability: ["Sandy", "Loamy"], suitability_score: 87, recommended_season: "Rabi" },

    // Rajasthan
    { id: "19", crop_name: "Mustard", variety: "RH-725", seed_type: "Certified", state: "Rajasthan", district: "Jaipur", availability_status: "InStock", supplier_name: "Rajasthan Seed Corp", price: 65, unit: "kg", certification: "StateCertified", expected_yield: "18-22 q/ha", soil_suitability: ["Sandy", "Loamy"], suitability_score: 92, recommended_season: "Rabi" },
    { id: "20", crop_name: "Bajra", variety: "RHB-173", seed_type: "Hybrid", state: "Rajasthan", district: "Jodhpur", availability_status: "InStock", supplier_name: "RARI Seeds", price: 200, unit: "kg", certification: "Research", expected_yield: "30-35 q/ha", soil_suitability: ["Sandy", "Red"], suitability_score: 90, recommended_season: "Kharif" },
    { id: "21", crop_name: "Cumin", variety: "RZ-19", seed_type: "Improved", state: "Rajasthan", district: "Barmer", availability_status: "InStock", supplier_name: "RARI Seeds", price: 280, unit: "kg", certification: "Research", expected_yield: "7-9 q/ha", soil_suitability: ["Sandy"], suitability_score: 88, recommended_season: "Rabi" },

    // Tamil Nadu
    { id: "22", crop_name: "Rice", variety: "ADT-43", seed_type: "Certified", state: "Tamil Nadu", district: "Thanjavur", availability_status: "InStock", supplier_name: "TNAU Seeds", price: 30, unit: "kg", certification: "University", expected_yield: "55-60 q/ha", soil_suitability: ["Alluvial", "Clay"], suitability_score: 93, recommended_season: "Kharif" },
    { id: "23", crop_name: "Groundnut", variety: "TMV-7", seed_type: "Certified", state: "Tamil Nadu", district: "Tiruvannamalai", availability_status: "InStock", supplier_name: "TNAU Seeds", price: 55, unit: "kg", certification: "University", expected_yield: "20-25 q/ha", soil_suitability: ["Red", "Sandy"], suitability_score: 89, recommended_season: "Rabi" },

    // West Bengal
    { id: "24", crop_name: "Rice", variety: "Swarna", seed_type: "Certified", state: "West Bengal", district: "Bardhaman", availability_status: "InStock", supplier_name: "WB Seeds", price: 32, unit: "kg", certification: "StateCertified", expected_yield: "45-50 q/ha", soil_suitability: ["Alluvial", "Clay"], suitability_score: 92, recommended_season: "Kharif" },
    { id: "25", crop_name: "Jute", variety: "JRC-321", seed_type: "Certified", state: "West Bengal", district: "Murshidabad", availability_status: "InStock", supplier_name: "CRIJAF", price: 100, unit: "kg", certification: "Research", expected_yield: "30-35 q/ha", soil_suitability: ["Alluvial", "Loamy"], suitability_score: 90, recommended_season: "Kharif" },

    // Haryana
    { id: "26", crop_name: "Wheat", variety: "WH-1105", seed_type: "Certified", state: "Haryana", district: "Karnal", availability_status: "InStock", supplier_name: "Haryana Seed Corp", price: 42, unit: "kg", certification: "StateCertified", expected_yield: "52-58 q/ha", soil_suitability: ["Loamy", "Alluvial"], suitability_score: 94, recommended_season: "Rabi" },
    { id: "27", crop_name: "Mustard", variety: "RH-749", seed_type: "Improved", state: "Haryana", district: "Hisar", availability_status: "InStock", supplier_name: "HAU Seeds", price: 70, unit: "kg", certification: "University", expected_yield: "20-24 q/ha", soil_suitability: ["Sandy", "Loamy"], suitability_score: 91, recommended_season: "Rabi" },

    // Madhya Pradesh
    { id: "28", crop_name: "Soybean", variety: "JS-9560", seed_type: "Certified", state: "Madhya Pradesh", district: "Indore", availability_status: "InStock", supplier_name: "MP Seed Corp", price: 75, unit: "kg", certification: "StateCertified", expected_yield: "22-28 q/ha", soil_suitability: ["Black"], suitability_score: 93, recommended_season: "Kharif" },
    { id: "29", crop_name: "Wheat", variety: "Lokwan", seed_type: "Certified", state: "Madhya Pradesh", district: "Bhopal", availability_status: "InStock", supplier_name: "JNKVV Seeds", price: 40, unit: "kg", certification: "University", expected_yield: "45-50 q/ha", soil_suitability: ["Black", "Alluvial"], suitability_score: 90, recommended_season: "Rabi" },
];

export class SeedVariety {
    static async filter(criteria: any): Promise<SeedVarietyInterface[]> {
        return allSeeds.filter(seed => {
            if (criteria.state && seed.state !== criteria.state) return false;
            if (criteria.district && seed.district !== criteria.district) return false;
            if (criteria.crop_name && seed.crop_name !== criteria.crop_name) return false;
            if (criteria.season && seed.recommended_season !== criteria.season) return false;
            return true;
        });
    }
}
