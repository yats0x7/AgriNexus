export interface SeedVendorInterface {
    id: string;
    vendor_name: string;
    location: string;
    state: string;
    district: string;
    rating: number;
    certification_status: string;
    crops_available: string[];
    delivery_available: boolean;
    delivery_radius: number;
    email: string;
    contact_number: string;
}

const allVendors: SeedVendorInterface[] = [
    // Punjab
    { id: "1", vendor_name: "Punjab Agro Seeds", location: "Ludhiana, Punjab", state: "Punjab", district: "Ludhiana", rating: 4.5, certification_status: "certified", crops_available: ["Wheat", "Rice", "Maize"], delivery_available: true, delivery_radius: 50, email: "contact@punjabagro.com", contact_number: "+919876543210" },
    { id: "2", vendor_name: "Kisan Sewa Kendra", location: "Bathinda, Punjab", state: "Punjab", district: "Bathinda", rating: 4.2, certification_status: "certified", crops_available: ["Cotton", "Mustard", "Wheat"], delivery_available: false, delivery_radius: 0, email: "kisansewa@gmail.com", contact_number: "+919876543211" },
    { id: "3", vendor_name: "Green Fields Suppliers", location: "Amritsar, Punjab", state: "Punjab", district: "Amritsar", rating: 4.0, certification_status: "pending", crops_available: ["Vegetables", "Flowers", "Maize"], delivery_available: true, delivery_radius: 20, email: "greenfields@yahoo.com", contact_number: "+919876543212" },

    // Maharashtra
    { id: "4", vendor_name: "Mahabeej Centre", location: "Pune, Maharashtra", state: "Maharashtra", district: "Pune", rating: 4.7, certification_status: "certified", crops_available: ["Soybean", "Onion", "Sugarcane"], delivery_available: true, delivery_radius: 60, email: "mahabeej@pune.com", contact_number: "+919823456789" },
    { id: "5", vendor_name: "Nashik Seeds Hub", location: "Nashik, Maharashtra", state: "Maharashtra", district: "Nashik", rating: 4.3, certification_status: "certified", crops_available: ["Onion", "Grape", "Tomato"], delivery_available: true, delivery_radius: 40, email: "nashikseeds@gmail.com", contact_number: "+919823456790" },
    { id: "6", vendor_name: "Vidarbha Krishi Kendra", location: "Nagpur, Maharashtra", state: "Maharashtra", district: "Nagpur", rating: 4.1, certification_status: "certified", crops_available: ["Cotton", "Soybean", "Orange"], delivery_available: false, delivery_radius: 0, email: "vidarbhakrishi@gmail.com", contact_number: "+919823456791" },

    // Uttar Pradesh
    { id: "7", vendor_name: "UP Seeds Corporation", location: "Lucknow, UP", state: "Uttar Pradesh", district: "Lucknow", rating: 4.4, certification_status: "certified", crops_available: ["Wheat", "Rice", "Sugarcane"], delivery_available: true, delivery_radius: 80, email: "upseedcorp@gov.in", contact_number: "+919415123456" },
    { id: "8", vendor_name: "Kisan Beej Bhandar", location: "Varanasi, UP", state: "Uttar Pradesh", district: "Varanasi", rating: 4.0, certification_status: "pending", crops_available: ["Rice", "Potato", "Vegetables"], delivery_available: true, delivery_radius: 30, email: "kisanbeej@gmail.com", contact_number: "+919415123457" },

    // Karnataka
    { id: "9", vendor_name: "Karnataka Seed Corp", location: "Bangalore, Karnataka", state: "Karnataka", district: "Bangalore Urban", rating: 4.6, certification_status: "certified", crops_available: ["Ragi", "Maize", "Rice", "Flowers"], delivery_available: true, delivery_radius: 100, email: "kssca@karnataka.gov.in", contact_number: "+919845678901" },
    { id: "10", vendor_name: "Mysore Agri Traders", location: "Mysore, Karnataka", state: "Karnataka", district: "Mysore", rating: 4.2, certification_status: "certified", crops_available: ["Ragi", "Sugarcane", "Vegetables"], delivery_available: true, delivery_radius: 25, email: "mysoreagri@gmail.com", contact_number: "+919845678902" },

    // Gujarat
    { id: "11", vendor_name: "Gujarat Seed Centre", location: "Ahmedabad, Gujarat", state: "Gujarat", district: "Ahmedabad", rating: 4.5, certification_status: "certified", crops_available: ["Cotton", "Groundnut", "Cumin"], delivery_available: true, delivery_radius: 70, email: "gujaratseed@gov.in", contact_number: "+919825678901" },
    { id: "12", vendor_name: "Saurashtra Beej Ltd", location: "Rajkot, Gujarat", state: "Gujarat", district: "Rajkot", rating: 4.3, certification_status: "certified", crops_available: ["Groundnut", "Cotton", "Sesame"], delivery_available: true, delivery_radius: 50, email: "saurashtrabeej@gmail.com", contact_number: "+919825678902" },

    // Rajasthan
    { id: "13", vendor_name: "Rajasthan Seed Corp", location: "Jaipur, Rajasthan", state: "Rajasthan", district: "Jaipur", rating: 4.4, certification_status: "certified", crops_available: ["Mustard", "Wheat", "Bajra"], delivery_available: true, delivery_radius: 90, email: "rajseel@rajasthan.gov.in", contact_number: "+919829123456" },
    { id: "14", vendor_name: "Desert Agri Seeds", location: "Jodhpur, Rajasthan", state: "Rajasthan", district: "Jodhpur", rating: 4.0, certification_status: "pending", crops_available: ["Cumin", "Bajra", "Moth Bean"], delivery_available: false, delivery_radius: 0, email: "desertagri@gmail.com", contact_number: "+919829123457" },

    // Tamil Nadu
    { id: "15", vendor_name: "TNAU Seeds Unit", location: "Coimbatore, TN", state: "Tamil Nadu", district: "Coimbatore", rating: 4.8, certification_status: "certified", crops_available: ["Rice", "Groundnut", "Coconut", "Banana"], delivery_available: true, delivery_radius: 120, email: "seeds@tnau.ac.in", contact_number: "+919842567890" },

    // West Bengal
    { id: "16", vendor_name: "Bengal Seeds Ltd", location: "Kolkata, WB", state: "West Bengal", district: "Kolkata", rating: 4.3, certification_status: "certified", crops_available: ["Rice", "Jute", "Vegetables", "Potato"], delivery_available: true, delivery_radius: 60, email: "bengalseeds@gmail.com", contact_number: "+919831234567" },

    // Haryana
    { id: "17", vendor_name: "Haryana Seed Dev Corp", location: "Karnal, Haryana", state: "Haryana", district: "Karnal", rating: 4.5, certification_status: "certified", crops_available: ["Wheat", "Rice", "Mustard"], delivery_available: true, delivery_radius: 80, email: "hsdc@haryana.gov.in", contact_number: "+919416789012" },
];

export class SeedVendor {
    static async filter(criteria: any): Promise<SeedVendorInterface[]> {
        return allVendors.filter(vendor => {
            if (criteria.state && vendor.state !== criteria.state) return false;
            if (criteria.district && vendor.district !== criteria.district) return false;
            return true;
        });
    }
}
