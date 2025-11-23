export interface SeedVendorInterface {
    id: string;
    vendor_name: string;
    location: string;
    rating: number;
    certification_status: string;
    crops_available: string[];
    delivery_available: boolean;
    delivery_radius: number;
    email: string;
    contact_number: string;
}

export class SeedVendor {
    static async filter(criteria: any): Promise<SeedVendorInterface[]> {
        // Mock data
        return [
            {
                id: "1",
                vendor_name: "Punjab Agro Seeds",
                location: "Ludhiana, Punjab",
                rating: 4.5,
                certification_status: "certified",
                crops_available: ["Wheat", "Rice", "Maize"],
                delivery_available: true,
                delivery_radius: 50,
                email: "contact@punjabagro.com",
                contact_number: "+919876543210"
            },
            {
                id: "2",
                vendor_name: "Kisan Sewa Kendra",
                location: "Bathinda, Punjab",
                rating: 4.2,
                certification_status: "certified",
                crops_available: ["Cotton", "Mustard"],
                delivery_available: false,
                delivery_radius: 0,
                email: "kisansewa@gmail.com",
                contact_number: "+919876543211"
            },
            {
                id: "3",
                vendor_name: "Green Fields Suppliers",
                location: "Amritsar, Punjab",
                rating: 4.0,
                certification_status: "pending",
                crops_available: ["Vegetables", "Flowers"],
                delivery_available: true,
                delivery_radius: 20,
                email: "greenfields@yahoo.com",
                contact_number: "+919876543212"
            }
        ];
    }
}
