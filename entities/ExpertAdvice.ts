export interface ExpertAdviceInterface {
    id: string;
    title: string;
    content: string;
    category: string;
    source: string;
    publish_date: string;
    crop_relevance: string[];
    state?: string;
    season?: string;
}

export class ExpertAdvice {
    static async list(): Promise<ExpertAdviceInterface[]> {
        return [
            {
                id: "1",
                title: "Pest Alert: Fall Armyworm in Maize",
                content: "Farmers are advised to monitor maize fields for Fall Armyworm. Look for egg masses on leaf undersides and young larvae in whorls. Apply Emamectin Benzoate 5% SG @ 0.4g/L or Chlorantraniliprole 18.5% SC @ 0.4ml/L at early infestation stage.",
                category: "Pest Control",
                source: "KVK Ludhiana",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Maize", "Sorghum"],
                state: "Punjab",
                season: "Kharif"
            },
            {
                id: "2",
                title: "Wheat Irrigation Schedule — Crown Root Initiation",
                content: "First irrigation for wheat must be at CRI stage (21 days after sowing). Delay beyond 25 days causes 20-30% yield loss. Apply 6cm water. Skip irrigation if rainfall > 25mm occurs within ±3 days of scheduled irrigation.",
                category: "Irrigation",
                source: "PAU Ludhiana",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Wheat"],
                state: "Punjab",
                season: "Rabi"
            },
            {
                id: "3",
                title: "Late Blight Alert for Potato — Preventive Spray",
                content: "Late blight conditions are favorable with high humidity and temperatures between 15-20°C. Apply Mancozeb 75% WP @ 2.5g/L as preventive spray. For curative treatment, use Metalaxyl + Mancozeb. Repeat every 7-10 days in wet weather.",
                category: "Disease Management",
                source: "CPRI Shimla",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Potato", "Tomato"],
                state: "Uttar Pradesh",
                season: "Rabi"
            },
            {
                id: "4",
                title: "Onion Thrips Management — Nashik Region",
                content: "Thrips population increasing on Rabi onion. Install blue sticky traps @ 12/acre. Spray Fipronil 5% SC @ 1.5ml/L or Spinetoram 11.7% SC @ 0.5ml/L. Avoid excess nitrogen fertilizer as it promotes thrips buildup.",
                category: "Pest Control",
                source: "NHRDF Nashik",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Onion"],
                state: "Maharashtra",
                season: "Rabi"
            },
            {
                id: "5",
                title: "Groundnut — Pre-Monsoon Land Preparation",
                content: "Complete summer ploughing before monsoon. Apply FYM @ 5 tonnes/hectare and mix well. Treat seed with Trichoderma viride @ 4g/kg before sowing. Maintain row spacing of 30cm x 10cm for bunch and 45cm x 15cm for spreading varieties.",
                category: "Cultivation Practice",
                source: "JAU Junagadh",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Groundnut"],
                state: "Gujarat",
                season: "Kharif"
            },
            {
                id: "6",
                title: "Rice Blast Disease — Early Warning for Kharif",
                content: "With high humidity and moderate temperatures, rice blast can appear. Symptoms: diamond-shaped lesions on leaves. Spray Tricyclazole 75% WP @ 0.6g/L or Isoprothiolane 40% EC @ 1.5ml/L. Use resistant varieties like CO-51 and ADT-43.",
                category: "Disease Management",
                source: "TNAU Coimbatore",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Rice"],
                state: "Tamil Nadu",
                season: "Kharif"
            },
            {
                id: "7",
                title: "Mustard — Aphid Management in Rabi Season",
                content: "Aphid population peaks in January in mustard. If 50+ aphids per plant found, spray Dimethoate 30% EC @ 1ml/L or Imidacloprid 17.8% SL @ 0.3ml/L. Cultural control: sow early (Oct 15-25), use variety RH-725/749 which has moderate tolerance.",
                category: "Pest Control",
                source: "RARI Jaipur",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Mustard", "Rapeseed"],
                state: "Rajasthan",
                season: "Rabi"
            },
            {
                id: "8",
                title: "Soybean — Yellow Mosaic Virus Prevention",
                content: "Yellow Mosaic Virus transmitted by whiteflies is a major threat. Use JS-9560 or JS-2069 resistant varieties. Apply Thiamethoxam 25% WG @ 0.2g/L at 25 DAS. Remove infected plants immediately. Maintain weed-free field edges to eliminate whitefly breeding grounds.",
                category: "Disease Management",
                source: "JNKVV Jabalpur",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Soybean"],
                state: "Madhya Pradesh",
                season: "Kharif"
            },
            {
                id: "9",
                title: "Cotton — Bollworm Integrated Pest Management",
                content: "Install pheromone traps for Helicoverpa @ 5/acre. Release Trichogramma egg parasitoid @ 1.5 lakh/acre at 45 DAS. If bollworm infestation > 10%, apply HaNPV @ 250 LE/acre + jaggery 0.5%. Avoid broad-spectrum insecticides to protect natural enemies.",
                category: "Pest Control",
                source: "CCI Nagpur",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Cotton"],
                state: "Maharashtra",
                season: "Kharif"
            },
            {
                id: "10",
                title: "Rice Stubble Management — Avoid Burning",
                content: "Do NOT burn rice stubble. Use Happy Seeder for direct wheat sowing in standing stubble. Government subsidy of 50% available on crop residue management machinery. In-situ decomposition with Pusa Bio-Decomposer @ 4 capsules/acre significantly improves soil organic carbon.",
                category: "Crop Residue",
                source: "IARI New Delhi",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Rice", "Wheat"],
                season: "Rabi"
            },
            {
                id: "11",
                title: "Water Harvesting for Drought-Prone Areas",
                content: "Construct farm ponds of size 20m x 20m x 3m for 1 hectare farms. Line with HDPE sheet to reduce seepage losses. Collect runoff during monsoon for supplemental irrigation. Government provides 50-75% subsidy under PMKSY for farm pond construction.",
                category: "Water Management",
                source: "CRIDA Hyderabad",
                publish_date: new Date().toISOString(),
                crop_relevance: ["All Crops"],
                state: "Rajasthan",
                season: "Kharif"
            },
            {
                id: "12",
                title: "Sugarcane — Ratoon Management for Higher Yields",
                content: "After harvesting, manage ratoon crop: stubble shave at ground level, apply 20% extra nitrogen (80kg/acre), irrigate within 7 days of harvest. Gap filling with fresh setts where mortality is high. Ratoon management yields 80% of plant crop if done properly.",
                category: "Cultivation Practice",
                source: "IISR Lucknow",
                publish_date: new Date().toISOString(),
                crop_relevance: ["Sugarcane"],
                state: "Uttar Pradesh",
                season: "Zaid"
            }
        ];
    }
}
