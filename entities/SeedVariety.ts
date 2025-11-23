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

export class SeedVariety {
    static async filter(criteria: any): Promise<SeedVarietyInterface[]> {
        // Mock data
        const allSeeds: SeedVarietyInterface[] = [
            {
                id: "1",
                crop_name: "Wheat",
                variety: "HD-2967",
                seed_type: "Certified",
                state: "Punjab",
                district: "Ludhiana",
                availability_status: "InStock",
                supplier_name: "Punjab State Seed Corp",
                price: 40,
                unit: "kg",
                certification: "StateCertified",
                expected_yield: "50-55 q/ha",
                soil_suitability: ["Loamy", "Alluvial"],
                suitability_score: 95
            },
            {
                id: "2",
                crop_name: "Rice",
                variety: "PR-126",
                seed_type: "Certified",
                state: "Punjab",
                district: "Ludhiana",
                availability_status: "InStock",
                supplier_name: "National Seeds Corp",
                price: 35,
                unit: "kg",
                certification: "NSC",
                expected_yield: "70-75 q/ha",
                soil_suitability: ["Clay", "Loamy"],
                suitability_score: 90
            },
            {
                id: "3",
                crop_name: "Cotton",
                variety: "RCH-773",
                seed_type: "Hybrid",
                state: "Punjab",
                district: "Bathinda",
                availability_status: "Limited",
                supplier_name: "Private Vendor",
                price: 800,
                unit: "packet",
                certification: "None",
                expected_yield: "25-30 q/ha",
                soil_suitability: ["Black", "Alluvial"],
                suitability_score: 85
            }
        ];

        return allSeeds.filter(seed => {
            if (criteria.state && seed.state !== criteria.state) return false;
            // if (criteria.district && seed.district !== criteria.district) return false; // Relax district filter for demo
            return true;
        });
    }
}
