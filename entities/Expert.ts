export interface ExpertInterface {
    id: string;
    name: string;
    qualification: string;
    specialization: string[];
    location: string;
    contact_number: string;
    profile_image?: string;
}

export class Expert {
    static async list(): Promise<ExpertInterface[]> {
        return [
            {
                id: "1",
                name: "Dr. Ramesh Gupta",
                qualification: "M.Sc. Agriculture",
                specialization: ["Crop Protection", "Soil Health"],
                location: "Ludhiana, Punjab",
                contact_number: "+91-9876543210"
            },
            {
                id: "2",
                name: "Ms. Anita Singh",
                qualification: "Ph.D. Agronomy",
                specialization: ["Organic Farming", "Seed Technology"],
                location: "Amritsar, Punjab",
                contact_number: "+91-9876543211"
            },
            {
                id: "3",
                name: "Mr. Suresh Kumar",
                qualification: "B.Sc. Agriculture",
                specialization: ["Irrigation Management"],
                location: "Bathinda, Punjab",
                contact_number: "+91-9876543212"
            }
        ];
    }
}
