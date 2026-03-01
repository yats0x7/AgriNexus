export interface ExpertInterface {
    id: string;
    name: string;
    qualification: string;
    specialization: string[];
    location: string;
    state: string;
    district: string;
    contact_number: string;
    profile_image?: string;
    experience_years?: number;
    languages?: string[];
}

const allExperts: ExpertInterface[] = [
    // Punjab
    { id: "1", name: "Dr. Ramesh Gupta", qualification: "M.Sc. Agriculture, Ph.D. Entomology", specialization: ["Crop Protection", "Soil Health", "Wheat"], location: "Ludhiana, Punjab", state: "Punjab", district: "Ludhiana", contact_number: "+91-9876543210", experience_years: 22, languages: ["Hindi", "Punjabi", "English"] },
    { id: "2", name: "Ms. Anita Singh", qualification: "Ph.D. Agronomy", specialization: ["Organic Farming", "Seed Technology", "Rice"], location: "Amritsar, Punjab", state: "Punjab", district: "Amritsar", contact_number: "+91-9876543211", experience_years: 15, languages: ["Hindi", "Punjabi"] },
    { id: "3", name: "Mr. Suresh Kumar", qualification: "B.Sc. Agriculture", specialization: ["Irrigation Management", "Cotton"], location: "Bathinda, Punjab", state: "Punjab", district: "Bathinda", contact_number: "+91-9876543212", experience_years: 10, languages: ["Hindi", "Punjabi"] },

    // Maharashtra
    { id: "4", name: "Dr. Priya Deshmukh", qualification: "Ph.D. Plant Pathology", specialization: ["Soybean Diseases", "Grape Cultivation", "Organic Farming"], location: "Pune, Maharashtra", state: "Maharashtra", district: "Pune", contact_number: "+91-9823456789", experience_years: 18, languages: ["Hindi", "Marathi", "English"] },
    { id: "5", name: "Mr. Rajendra Patil", qualification: "M.Sc. Horticulture", specialization: ["Onion Cultivation", "Pomegranate", "Post-Harvest"], location: "Nashik, Maharashtra", state: "Maharashtra", district: "Nashik", contact_number: "+91-9823456790", experience_years: 14, languages: ["Marathi", "Hindi"] },
    { id: "6", name: "Dr. Vijay Kadam", qualification: "Ph.D. Soil Science", specialization: ["Soil Health", "Sugarcane", "Water Management"], location: "Nagpur, Maharashtra", state: "Maharashtra", district: "Nagpur", contact_number: "+91-9823456791", experience_years: 20, languages: ["Marathi", "Hindi", "English"] },

    // Uttar Pradesh
    { id: "7", name: "Dr. Anil Sharma", qualification: "Ph.D. Genetics & Plant Breeding", specialization: ["Wheat Varieties", "Seed Production", "Crop Improvement"], location: "Lucknow, UP", state: "Uttar Pradesh", district: "Lucknow", contact_number: "+91-9415123456", experience_years: 25, languages: ["Hindi", "English"] },
    { id: "8", name: "Mr. Dinesh Yadav", qualification: "M.Sc. Agriculture Extension", specialization: ["Potato Farming", "Vegetable Cultivation"], location: "Agra, UP", state: "Uttar Pradesh", district: "Agra", contact_number: "+91-9415123457", experience_years: 12, languages: ["Hindi"] },

    // Karnataka
    { id: "9", name: "Dr. Lakshmi Narayana", qualification: "Ph.D. Agricultural Economics", specialization: ["Ragi Cultivation", "Farm Economics", "Market Linkage"], location: "Bangalore, Karnataka", state: "Karnataka", district: "Bangalore Urban", contact_number: "+91-9845678901", experience_years: 16, languages: ["Kannada", "Hindi", "English"] },
    { id: "10", name: "Mr. Basavaraj Hiremath", qualification: "M.Sc. Soil Science", specialization: ["Soil Testing", "Precision Farming", "Drip Irrigation"], location: "Dharwad, Karnataka", state: "Karnataka", district: "Dharwad", contact_number: "+91-9845678902", experience_years: 11, languages: ["Kannada", "Hindi"] },

    // Gujarat
    { id: "11", name: "Dr. Hemant Patel", qualification: "Ph.D. Agronomy", specialization: ["Groundnut", "Cotton", "Water Harvesting"], location: "Rajkot, Gujarat", state: "Gujarat", district: "Rajkot", contact_number: "+91-9825678901", experience_years: 19, languages: ["Gujarati", "Hindi", "English"] },

    // Rajasthan
    { id: "12", name: "Dr. Mohan Lal Meena", qualification: "Ph.D. Arid Agriculture", specialization: ["Desert Farming", "Cumin", "Mustard", "Water Conservation"], location: "Jodhpur, Rajasthan", state: "Rajasthan", district: "Jodhpur", contact_number: "+91-9829123456", experience_years: 21, languages: ["Hindi", "Rajasthani", "English"] },

    // Tamil Nadu
    { id: "13", name: "Dr. Kavitha Rajan", qualification: "Ph.D. Agricultural Entomology", specialization: ["Rice Pest Management", "Coconut", "Precision Agriculture"], location: "Coimbatore, TN", state: "Tamil Nadu", district: "Coimbatore", contact_number: "+91-9842567890", experience_years: 17, languages: ["Tamil", "English", "Hindi"] },

    // West Bengal
    { id: "14", name: "Dr. Suman Ghosh", qualification: "Ph.D. Rice Science", specialization: ["Rice Cultivation", "Jute", "Fish Farming"], location: "Kolkata, WB", state: "West Bengal", district: "Kolkata", contact_number: "+91-9831234567", experience_years: 23, languages: ["Bengali", "Hindi", "English"] },

    // Haryana
    { id: "15", name: "Dr. Sandeep Malik", qualification: "Ph.D. Plant Breeding", specialization: ["Wheat", "Mustard", "Fodder Crops"], location: "Karnal, Haryana", state: "Haryana", district: "Karnal", contact_number: "+91-9416789012", experience_years: 13, languages: ["Hindi", "English"] },

    // Madhya Pradesh
    { id: "16", name: "Dr. Rekha Verma", qualification: "Ph.D. Agronomy", specialization: ["Soybean", "Wheat", "Organic Certification"], location: "Indore, MP", state: "Madhya Pradesh", district: "Indore", contact_number: "+91-9425678901", experience_years: 15, languages: ["Hindi", "English"] },
];

export class Expert {
    static async list(criteria?: { state?: string; district?: string }): Promise<ExpertInterface[]> {
        if (!criteria) return allExperts;
        return allExperts.filter(expert => {
            if (criteria.state && expert.state !== criteria.state) return false;
            if (criteria.district && expert.district !== criteria.district) return false;
            return true;
        });
    }
}
