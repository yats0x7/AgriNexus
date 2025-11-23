export interface CropDiagnosisInterface {
    id?: string;
    farmer_name: string;
    crop_type: string;
    problem_description: string;
    location: string;
    image_urls: string[];
    ai_diagnosis: string;
    recommended_solution: string[];
    confidence_score: number;
    severity: string;
    status: string;
}

export class CropDiagnosis {
    static async create(data: CropDiagnosisInterface): Promise<CropDiagnosisInterface> {
        return {
            ...data,
            id: Math.random().toString(36).substr(2, 9)
        };
    }
}
