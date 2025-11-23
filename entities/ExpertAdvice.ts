export interface ExpertAdviceInterface {
    id: string;
    title: string;
    content: string;
    category: string;
    source: string;
    publish_date: string;
    crop_relevance: string[];
}

export class ExpertAdvice {
    static async list(): Promise<ExpertAdviceInterface[]> {
        return [
            {
                id: "1",
                title: "Pest Alert: Fall Armyworm in Maize",
                content: "Farmers are advised to monitor their maize fields for Fall Armyworm infestation. Look for egg masses and young larvae.",
                category: "Pest Control",
                source: "KVK Ludhiana",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Maize"]
            },
            {
                id: "2",
                title: "Wheat Irrigation Schedule",
                content: "First irrigation for wheat should be applied at CRI stage (21 days after sowing). Delay can reduce yield.",
                category: "Irrigation",
                source: "PAU Ludhiana",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Wheat"]
            }
        ];
    }
}
