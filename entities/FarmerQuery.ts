export interface FarmerQueryInterface {
    id?: string;
    farmer_name: string;
    location: string;
    crop_type: string;
    query_text: string;
    status?: string;
    created_date?: string;
}

export class FarmerQuery {
    static async list(sort?: string, limit?: number): Promise<FarmerQueryInterface[]> {
        return [
            {
                id: "1",
                farmer_name: "Ram Singh",
                location: "Pune, Maharashtra",
                crop_type: "Rice",
                query_text: "What is the best time to apply urea?",
                status: "answered",
                created_date: new Date().toISOString()
            },
            {
                id: "2",
                farmer_name: "Shyam Lal",
                location: "Ludhiana, Punjab",
                crop_type: "Wheat",
                query_text: "Leaves are turning yellow, what to do?",
                status: "pending",
                created_date: new Date().toISOString()
            }
        ];
    }

    static async create(data: FarmerQueryInterface): Promise<FarmerQueryInterface> {
        return {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            status: "pending",
            created_date: new Date().toISOString()
        };
    }
}
