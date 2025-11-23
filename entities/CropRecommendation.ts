export interface CropRecommendationInterface {
    id?: string;
    farmer_location: string;
    soil_type: string;
    season: string;
    recommended_crops: any[];
    ai_confidence: number;
    recommendation_date: string;
}

export class CropRecommendation {
    static async create(data: CropRecommendationInterface): Promise<CropRecommendationInterface> {
        // Mock create
        return {
            ...data,
            id: Math.random().toString(36).substr(2, 9)
        };
    }
}
