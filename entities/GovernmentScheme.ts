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
            {
                id: "1",
                scheme_name: "PM-KISAN",
                description: "Pradhan Mantri Kisan Samman Nidhi scheme provides income support to all landholding farmer families.",
                benefits: ["₹6000 per year in 3 installments", "Direct Benefit Transfer"],
                category: "subsidy",
                state: "All India",
                official_website: "https://pmkisan.gov.in"
            },
            {
                id: "2",
                scheme_name: "Kisan Credit Card (KCC)",
                description: "Provides adequate and timely credit support from the banking system under a single window.",
                benefits: ["Low interest rate", "Flexible repayment", "Insurance coverage"],
                category: "loan",
                state: "All India",
                official_website: "https://www.myscheme.gov.in/schemes/kcc"
            },
            {
                id: "3",
                scheme_name: "Pradhan Mantri Fasal Bima Yojana",
                description: "Crop insurance scheme to provide financial support to farmers suffering crop loss/damage.",
                benefits: ["Risk coverage", "Stabilize income", "Encourage modern practices"],
                category: "insurance",
                state: "All India",
                official_website: "https://pmfby.gov.in"
            }
        ];
    }
}
