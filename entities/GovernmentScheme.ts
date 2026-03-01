export interface GovernmentSchemeInterface {
    id: string;
    scheme_name: string;
    description: string;
    benefits: string[];
    category: string;
    state: string;
    official_website: string;
    deadline?: string;
}

export class GovernmentScheme {
    static async list(): Promise<GovernmentSchemeInterface[]> {
        return [
            // Central Government Schemes (All India)
            {
                id: "1",
                scheme_name: "PM-KISAN",
                description: "Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6000/year to small and marginal farmer families.",
                benefits: ["₹6000 per year in 3 installments", "Direct Benefit Transfer to bank account", "No intermediaries"],
                category: "subsidy",
                state: "All India",
                official_website: "https://pmkisan.gov.in"
            },
            {
                id: "2",
                scheme_name: "Kisan Credit Card (KCC)",
                description: "Provides short-term credit for cultivation, post-harvest expenses, and working capital for maintenance of farm assets.",
                benefits: ["4% interest rate (with prompt repayment)", "Flexible repayment schedule", "Personal accident insurance cover of ₹50,000", "Credit limit up to ₹3 lakh"],
                category: "loan",
                state: "All India",
                official_website: "https://www.myscheme.gov.in/schemes/kcc"
            },
            {
                id: "3",
                scheme_name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                description: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss from natural calamities, pests & diseases.",
                benefits: ["Premium: 2% for Kharif, 1.5% for Rabi", "Full insured amount coverage", "Quick claim settlement via technology", "Covers all food & oilseed crops"],
                category: "insurance",
                state: "All India",
                official_website: "https://pmfby.gov.in"
            },
            {
                id: "4",
                scheme_name: "Soil Health Card Scheme",
                description: "Government provides soil health cards to farmers containing crop-wise recommendations for nutrients and fertilizers.",
                benefits: ["Free soil testing", "Crop-specific nutrient recommendations", "Improves productivity by 10-15%", "Reduces fertilizer costs"],
                category: "subsidy",
                state: "All India",
                official_website: "https://soilhealth.dac.gov.in"
            },
            {
                id: "5",
                scheme_name: "PM Kisan Maandhan Yojana",
                description: "Pension scheme for small and marginal farmers aged 18-40 years, providing ₹3000/month pension after age 60.",
                benefits: ["₹3000 monthly pension after 60", "Monthly contribution ₹55-200", "Equal government contribution", "Voluntary and contributory"],
                category: "insurance",
                state: "All India",
                official_website: "https://maandhan.in"
            },
            {
                id: "6",
                scheme_name: "National Mission on Sustainable Agriculture (NMSA)",
                description: "Promotes sustainable agriculture through climate change adaptation, water use efficiency, and soil health management.",
                benefits: ["Subsidized micro-irrigation", "Organic farming support", "Climate-resilient crop varieties", "Training programs"],
                category: "training",
                state: "All India",
                official_website: "https://nmsa.dac.gov.in"
            },
            {
                id: "7",
                scheme_name: "Sub-Mission on Agricultural Mechanization (SMAM)",
                description: "Promotes farm mechanization to increase productivity and reduce drudgery for small & marginal farmers.",
                benefits: ["40-50% subsidy on farm equipment", "Custom hiring centers", "Farm machinery banks", "Training on equipment use"],
                category: "equipment",
                state: "All India",
                official_website: "https://agrimachinery.nic.in"
            },
            {
                id: "8",
                scheme_name: "National Mission on Oilseeds and Oil Palm (NMOOP)",
                description: "Aims to increase production of oilseeds and oil palm to reduce import dependency.",
                benefits: ["Seed subsidy for oilseed crops", "Drip irrigation support", "INR 29,000/ha for oil palm planting", "Processing equipment subsidy"],
                category: "seeds",
                state: "All India",
                official_website: "https://nmoop.gov.in"
            },
            // State-Specific Schemes
            {
                id: "9",
                scheme_name: "Rythu Bandhu (Telangana)",
                description: "Investment support scheme providing ₹10,000/acre per year to all landowner farmers for agriculture purposes.",
                benefits: ["₹10,000 per acre per year", "₹5,000 per season (Kharif & Rabi)", "No repayment required", "Covers all landholders"],
                category: "subsidy",
                state: "Telangana",
                official_website: "https://treasury.telangana.gov.in"
            },
            {
                id: "10",
                scheme_name: "YSR Rythu Bharosa (Andhra Pradesh)",
                description: "Financial assistance of ₹13,500 per year to all farmer families for investment on agriculture and allied sectors.",
                benefits: ["₹13,500 per year in installments", "Covers tenant farmers too", "Direct bank transfer", "Free crop insurance"],
                category: "subsidy",
                state: "Andhra Pradesh",
                official_website: "https://ysrrythubharosa.ap.gov.in"
            },
            {
                id: "11",
                scheme_name: "KALIA Scheme (Odisha)",
                description: "Krushak Assistance for Livelihood and Income Augmentation provides financial support for cultivation.",
                benefits: ["₹25,000 per family for cultivation", "₹12,500 per season", "Life insurance coverage", "Interest-free crop loans"],
                category: "subsidy",
                state: "Odisha",
                official_website: "https://kalia.odisha.gov.in"
            },
            {
                id: "12",
                scheme_name: "Mukhyamantri Kisan Sahay Yojana (Gujarat)",
                description: "Crop damage compensation scheme for farmers affected by drought, excess rainfall, or unseasonal rains.",
                benefits: ["Up to ₹25,000/hectare compensation", "Covers natural calamities", "No premium payment needed", "Max 4 hectares per farmer"],
                category: "insurance",
                state: "Gujarat",
                official_website: "https://ikisan.gujarat.gov.in"
            },
            {
                id: "13",
                scheme_name: "Mahatma Jyotirao Phule Shetkari Karj Mukti Yojana (Maharashtra)",
                description: "Farm loan waiver scheme for small and marginal farmers in Maharashtra with outstanding crop loans.",
                benefits: ["Loan waiver up to ₹2 lakh", "Covers cooperative & nationalized bank loans", "Benefit to over 30 lakh farmers"],
                category: "loan",
                state: "Maharashtra",
                official_website: "https://mjpsky.maharashtra.gov.in"
            },
            {
                id: "14",
                scheme_name: "Punjab Kisan Credit Card Scheme",
                description: "State-enhanced KCC with additional benefits for Punjab farmers, including crop-specific credit limits.",
                benefits: ["Enhanced credit limit", "2% interest subvention", "Insurance coverage included", "Easy renewal process"],
                category: "loan",
                state: "Punjab",
                official_website: "https://punjab.gov.in"
            },
            {
                id: "15",
                scheme_name: "Mukhyamantri Krishi Ashirvad Yojana (Jharkhand)",
                description: "Provides ₹5,000 per acre per year to small and marginal farmers for two crop seasons.",
                benefits: ["₹5,000 per acre per year", "Maximum 5 acres", "Direct bank transfer", "For registered farmers"],
                category: "subsidy",
                state: "Jharkhand",
                official_website: "https://mmkay.jharkhand.gov.in"
            },
            {
                id: "16",
                scheme_name: "Tamil Nadu Mission on Nano Fertilizers",
                description: "Subsidizes nano fertilizers for sustainable agriculture and promotes efficient nutrient management.",
                benefits: ["50% subsidy on nano fertilizers", "Free technical training", "Soil testing support", "Higher crop yields"],
                category: "fertilizer",
                state: "Tamil Nadu",
                official_website: "https://www.tn.gov.in/scheme/agriculture"
            },
            {
                id: "17",
                scheme_name: "Krishi Input Subsidy Scheme (Bihar)",
                description: "Provides input subsidy to farmers whose crops are damaged due to floods, drought, or hailstorm.",
                benefits: ["₹6,800/hectare for irrigated", "₹13,500/hectare for perennial crops", "Quick disbursement", "Covers up to 2 hectares"],
                category: "subsidy",
                state: "Bihar",
                official_website: "https://dbtagriculture.bihar.gov.in"
            },
            {
                id: "18",
                scheme_name: "Rajasthan Mukhyamantri Krishak Sathi Yojana",
                description: "Financial assistance to farmers/agricultural laborers who suffer accidental death or permanent disability.",
                benefits: ["₹2 lakh for accidental death", "₹50,000 for partial disability", "Covers agricultural workers too", "No premium required"],
                category: "insurance",
                state: "Rajasthan",
                official_website: "https://rajkisan.rajasthan.gov.in"
            },
            {
                id: "19",
                scheme_name: "Karnataka Raitha Siri Scheme",
                description: "Promotes organic farming practices among farmers in Karnataka through financial support and training.",
                benefits: ["₹3,000/acre for organic farming", "Free organic certification", "Training workshops", "Market linkage support"],
                category: "training",
                state: "Karnataka",
                official_website: "https://raitamitra.karnataka.gov.in"
            },
            {
                id: "20",
                scheme_name: "Uttar Pradesh Kisan Uday Yojana",
                description: "Free electricity scheme for irrigation pumpsets and free solar pumps for farmers in remote areas.",
                benefits: ["Free electricity for irrigation", "Solar pump distribution", "Energy-efficient pump replacement", "Reduced farming costs"],
                category: "equipment",
                state: "Uttar Pradesh",
                official_website: "https://upagripardarshi.gov.in"
            },
            {
                id: "21",
                scheme_name: "West Bengal Krishak Bandhu Scheme",
                description: "Provides ₹10,000/year to farmers and ₹2 lakh death benefit to farming families.",
                benefits: ["₹10,000 per year in 2 installments", "₹2 lakh death benefit", "Covers sharecroppers", "No minimum land requirement"],
                category: "subsidy",
                state: "West Bengal",
                official_website: "https://krishakbandhu.net"
            },
            {
                id: "22",
                scheme_name: "MP Mukhyamantri Kisan Kalyan Yojana",
                description: "Additional ₹4,000/year over PM-KISAN to registered farmers in Madhya Pradesh.",
                benefits: ["₹4,000 extra over PM-KISAN", "Total ₹10,000/year combined", "Two installments of ₹2,000", "Direct bank transfer"],
                category: "subsidy",
                state: "Madhya Pradesh",
                official_website: "https://mpeuparjan.nic.in"
            },
            {
                id: "23",
                scheme_name: "Haryana Meri Fasal Mera Byora",
                description: "Crop registration portal providing MSP procurement, natural calamity compensation, and subsidy distribution.",
                benefits: ["Guaranteed MSP procurement", "Crop insurance linkage", "Natural calamity compensation", "Subsidy directly to account"],
                category: "subsidy",
                state: "Haryana",
                official_website: "https://fasal.haryana.gov.in"
            }
        ];
    }
}
