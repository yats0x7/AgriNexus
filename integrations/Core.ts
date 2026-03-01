export async function InvokeLLM(promptOrOptions: string | { prompt: string;[key: string]: any }): Promise<string> {
    const prompt = typeof promptOrOptions === 'string' ? promptOrOptions : promptOrOptions.prompt;
    const options: any = typeof promptOrOptions === 'object' ? promptOrOptions : {};
    console.log("Invoking LLM with prompt:", prompt.substring(0, 100) + "...");

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Extract context from prompt
    const promptLower = prompt.toLowerCase();
    const state = extractState(promptLower);
    const crop = extractCrop(promptLower);
    const season = extractSeason(promptLower);

    // Determine which page is calling based on prompt content
    const hasJsonSchema = options.response_json_schema;

    // --- FERTILIZER GUIDE ---
    // FertilizerGuide expects: { fertilizer, toxicity_level, environmental_impact, alternatives[] }
    if (promptLower.includes("toxicity") && promptLower.includes("fertilizer")) {
        const fertilizerName = extractFertilizerName(prompt);
        return JSON.stringify(getFertilizerToxicity(fertilizerName));
    }

    // --- SEED RECOMMENDATIONS ---
    // SeedsRecommendations expects: { location_analysis, soil_suitability, recommended_crops[], ai_confidence, farmer_advice }
    if (promptLower.includes("crop and seed recommendation") || promptLower.includes("agri nexus ai expert")) {
        return JSON.stringify(getSeedRecommendations(state, season, extractSoilType(promptLower)));
    }

    // --- AI DOCTOR ---
    // AiDoctor expects: { diagnosis, disease_identified, recommended_solutions[], confidence_score, severity, prevention_tips[] }
    if (promptLower.includes("agricultural pathologist") || promptLower.includes("crop images")) {
        return JSON.stringify(getCropDiagnosis(crop));
    }

    // --- WEATHER ADVICE (Weather page) ---
    if (promptLower.includes("weather") && (promptLower.includes("farming advice") || promptLower.includes("farming advisory") || promptLower.includes("agricultural"))) {
        return JSON.stringify(getWeatherAdvice(state, season));
    }

    // --- MANDI PRICE ADVICE ---
    if (promptLower.includes("price") || promptLower.includes("mandi")) {
        return JSON.stringify(getMandiAdvice(state, crop));
    }

    // --- AGRINEXUS CHATBOT (expects plain text, NOT JSON) ---
    return getConversationalResponse(prompt, state, crop, season);
}

function extractState(prompt: string): string {
    const states: Record<string, string> = {
        "punjab": "Punjab", "maharashtra": "Maharashtra", "uttar pradesh": "Uttar Pradesh",
        "karnataka": "Karnataka", "tamil nadu": "Tamil Nadu", "rajasthan": "Rajasthan",
        "gujarat": "Gujarat", "haryana": "Haryana", "west bengal": "West Bengal",
        "bihar": "Bihar", "madhya pradesh": "Madhya Pradesh", "andhra pradesh": "Andhra Pradesh",
        "telangana": "Telangana", "odisha": "Odisha", "kerala": "Kerala",
        "himachal pradesh": "Himachal Pradesh", "uttarakhand": "Uttarakhand",
        "chhattisgarh": "Chhattisgarh", "jharkhand": "Jharkhand", "assam": "Assam"
    };
    for (const [key, val] of Object.entries(states)) {
        if (prompt.includes(key)) return val;
    }
    return "General";
}

function extractCrop(prompt: string): string {
    const crops = ["wheat", "rice", "cotton", "maize", "sugarcane", "soybean", "potato",
        "onion", "mustard", "groundnut", "ragi", "bajra", "tomato", "chilli", "turmeric",
        "jute", "coconut", "banana", "grape", "orange", "mango"];
    for (const c of crops) {
        if (prompt.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1);
    }
    return "General";
}

function extractSeason(prompt: string): string {
    if (prompt.includes("kharif") || prompt.includes("monsoon")) return "Kharif";
    if (prompt.includes("rabi") || prompt.includes("winter")) return "Rabi";
    if (prompt.includes("zaid") || prompt.includes("summer")) return "Zaid";
    const month = new Date().getMonth();
    if (month >= 5 && month <= 9) return "Kharif";
    if (month >= 10 || month <= 2) return "Rabi";
    return "Zaid";
}

function extractFertilizerName(prompt: string): string {
    const match = prompt.match(/fertilizer\s+"([^"]+)"/i) || prompt.match(/fertilizer\s+(\w+)/i);
    return match ? match[1] : "Unknown";
}

function extractSoilType(prompt: string): string {
    const soils = ["loamy", "clay", "sandy", "alluvial", "black", "red", "laterite", "saline"];
    for (const s of soils) {
        if (prompt.includes(s)) return s.charAt(0).toUpperCase() + s.slice(1);
    }
    return "Loamy";
}

// ===================== FERTILIZER GUIDE RESPONSES =====================
function getFertilizerToxicity(name: string): any {
    const fertilizerData: Record<string, any> = {
        "urea": {
            fertilizer: "Urea (CO(NH₂)₂)",
            toxicity_level: "Medium",
            environmental_impact: "Excess urea leads to nitrate leaching into groundwater, causes eutrophication in water bodies, and releases nitrous oxide (a greenhouse gas 300x more potent than CO₂). Prolonged overuse degrades soil structure and kills beneficial microorganisms.",
            alternatives: [
                { name: "Neem-Coated Urea", description: "Coated with neem oil to slow nitrogen release by 10-15%, reducing leaching losses. Government-mandated coating improves efficiency significantly." },
                { name: "IFFCO Nano Urea", description: "Liquid nano fertilizer — 1 bottle (500ml) replaces 1 bag of urea. Applied as foliar spray at tillering & flowering stages. 85% less environmental impact." },
                { name: "Vermicompost + Azotobacter", description: "Organic alternative: vermicompost provides slow-release nitrogen while Azotobacter bio-fertilizer fixes atmospheric nitrogen. Builds soil health long-term." }
            ]
        },
        "dap": {
            fertilizer: "DAP (Di-Ammonium Phosphate)",
            toxicity_level: "Medium",
            environmental_impact: "DAP contributes to phosphorus runoff causing water body eutrophication. Heavy metal contamination (cadmium) is a concern in some batches. Acidifies soil over time, reducing microbial activity.",
            alternatives: [
                { name: "Single Super Phosphate (SSP)", description: "Lower concentration but provides sulfur alongside phosphorus. Less acidifying and more eco-friendly than DAP. Better for oilseed crops." },
                { name: "Rock Phosphate + PSB", description: "Natural rock phosphate with Phosphate Solubilizing Bacteria (PSB) bio-fertilizer. Slow-release, builds soil phosphorus bank naturally." },
                { name: "Bone Meal", description: "Organic phosphorus source with 20-25% P₂O₅. Slow-release, improves soil structure. Ideal for fruit trees and vegetables." }
            ]
        },
        "mop": {
            fertilizer: "MOP (Muriate of Potash / KCl)",
            toxicity_level: "Low",
            environmental_impact: "MOP contains chloride which can accumulate in soil, affecting salt-sensitive crops like tobacco, potato, and fruits. Excess use increases soil salinity in arid regions.",
            alternatives: [
                { name: "SOP (Sulphate of Potash)", description: "Chloride-free potash source. Ideal for fruits, vegetables, and salt-sensitive crops. Also provides sulfur for oilseeds." },
                { name: "Wood Ash", description: "Contains 3-7% potash plus calcium and trace minerals. Excellent organic potash source for kitchen gardens and small farms." },
                { name: "Banana Stem Compost", description: "Rich in potassium. Prepare compost from banana pseudostems after harvest. Free and sustainable source for banana-growing regions." }
            ]
        },
        "npk": {
            fertilizer: "NPK Complex (Various ratios)",
            toxicity_level: "Medium",
            environmental_impact: "Complex fertilizers can lead to nutrient imbalance if applied without soil testing. Excess nitrogen and phosphorus cause water pollution. Synthetic NPK doesn't improve soil organic matter.",
            alternatives: [
                { name: "Jeevamrutha", description: "Traditional organic liquid fertilizer made from cow dung, cow urine, jaggery, and pulse flour. Provides balanced nutrition and boosts soil microbiology." },
                { name: "Enriched Compost", description: "FYM enriched with rock phosphate, neem cake, and bio-fertilizers. Provides balanced NPK organically with additional micro-nutrients." },
                { name: "Green Manuring + Bio-fertilizers", description: "Grow dhaincha/sunhemp as green manure (fixes 60-80kg N/ha) + apply PSB & KSB bio-fertilizers for P & K. Zero chemical input approach." }
            ]
        }
    };

    const key = name.toLowerCase().trim();
    for (const [fk, data] of Object.entries(fertilizerData)) {
        if (key.includes(fk) || fk.includes(key)) return data;
    }

    // Generic fallback
    return {
        fertilizer: name,
        toxicity_level: "Medium",
        environmental_impact: `${name} may contribute to soil degradation and water pollution if used excessively. Always follow recommended dosage based on soil test results. Overuse can harm beneficial soil organisms and contaminate groundwater.`,
        alternatives: [
            { name: "Organic Compost + Bio-fertilizers", description: "Replace 25-50% of chemical fertilizer with vermicompost (5t/ha) and appropriate bio-fertilizers (Azotobacter for N, PSB for P, KSB for K)." },
            { name: "Integrated Nutrient Management (INM)", description: "Combine 50% recommended chemicals + FYM + bio-fertilizers + green manuring for sustainable, balanced nutrition." },
            { name: "Soil Health Card-based Application", description: "Get your soil tested at the nearest KVK or soil testing lab (free under Soil Health Card scheme). Apply only what your soil actually needs." }
        ]
    };
}

// ===================== SEED RECOMMENDATIONS RESPONSES =====================
function getSeedRecommendations(state: string, season: string, soilType: string): any {
    const stateRecommendations: Record<string, Record<string, any>> = {
        "Punjab": {
            "Rabi": {
                location_analysis: "Punjab's Indo-Gangetic plains have fertile alluvial soil ideal for Rabi crops. The state receives adequate winter moisture and has extensive canal irrigation infrastructure.",
                soil_suitability: `${soilType} soil in Punjab is well-suited for grain and oilseed crops. pH typically ranges 7.5-8.5. Recommended to add zinc sulphate @ 25kg/ha for better micronutrient balance.`,
                recommended_crops: [
                    { crop_name: "Wheat", variety: "HD-2967", expected_yield: "50-55 q/ha", sowing_time: "Nov 1-25", source: "PAU Ludhiana", availability_link: "https://seednet.gov.in", profitability_score: 85, market_demand: "High", government_support: "MSP ₹2,275/qtl guaranteed procurement" },
                    { crop_name: "Mustard", variety: "RH-725", expected_yield: "18-22 q/ha", sowing_time: "Oct 15-Nov 5", source: "HAU Hisar", availability_link: "https://seednet.gov.in", profitability_score: 78, market_demand: "High", government_support: "MSP ₹5,650/qtl for rapeseed-mustard" },
                    { crop_name: "Potato", variety: "Kufri Bahar", expected_yield: "250-300 q/ha", sowing_time: "Oct 15-Nov 10", source: "CPRI Shimla", availability_link: "https://seednet.gov.in", profitability_score: 82, market_demand: "Very High", government_support: "Cold storage subsidy under MIDH scheme" },
                    { crop_name: "Pea", variety: "Arkel", expected_yield: "80-100 q/ha", sowing_time: "Oct 20-Nov 15", source: "NSC", availability_link: "https://seednet.gov.in", profitability_score: 88, market_demand: "High", government_support: "PMFBY insurance available for vegetable crops" },
                ],
                ai_confidence: 0.92,
                farmer_advice: "For Rabi season in Punjab, wheat remains the safest bet with guaranteed MSP procurement. Diversify with mustard or vegetables for higher per-acre returns. Ensure first irrigation at CRI stage (21 days) for wheat. Get soil tested at your nearest KVK — it's free!"
            },
            "Kharif": {
                location_analysis: "Punjab's Kharif season benefits from southwest monsoon. However, the state government is promoting crop diversification away from paddy to reduce groundwater depletion.",
                soil_suitability: `${soilType} soil supports rice well but diversification crops like maize and cotton are highly recommended for sustainable farming.`,
                recommended_crops: [
                    { crop_name: "Rice", variety: "PR-126 (Short Duration)", expected_yield: "70-75 q/ha", sowing_time: "Jun 15 onwards (as per state directive)", source: "PAU Ludhiana", availability_link: "https://seednet.gov.in", profitability_score: 75, market_demand: "High", government_support: "MSP ₹2,203/qtl; ₹17,500/acre bonus for non-paddy crops" },
                    { crop_name: "Maize", variety: "PMH-1", expected_yield: "60-65 q/ha", sowing_time: "Jun 1-20", source: "PAU Seeds", availability_link: "https://seednet.gov.in", profitability_score: 80, market_demand: "High", government_support: "₹17,500/acre diversification incentive" },
                    { crop_name: "Cotton", variety: "RCH-773 Bt", expected_yield: "25-30 q/ha", sowing_time: "Apr 15-May 15", source: "Approved Bt seeds", availability_link: "https://seednet.gov.in", profitability_score: 78, market_demand: "Moderate", government_support: "MSP ₹7,020/qtl for medium staple" },
                    { crop_name: "Moong", variety: "SML-668", expected_yield: "10-12 q/ha", sowing_time: "Mar 20-Apr 10", source: "NSC", availability_link: "https://seednet.gov.in", profitability_score: 72, market_demand: "High", government_support: "MSP ₹8,558/qtl; NFSM support" },
                ],
                ai_confidence: 0.90,
                farmer_advice: "Consider growing PR-126 short-duration paddy to save water. Maize and cotton offer diversification incentives worth ₹17,500/acre from the Punjab government. Register on DBT portal for direct benefit transfer."
            }
        },
        "Maharashtra": {
            "Kharif": {
                location_analysis: "Maharashtra has diverse agro-climatic zones. Western Maharashtra is irrigated, Vidarbha relies on rainfed farming, and Konkan coast has heavy rainfall.",
                soil_suitability: `${soilType} soil is predominant. Black cotton soil in Vidarbha is ideal for cotton and soybean. Western Maharashtra's soil suits sugarcane and onion.`,
                recommended_crops: [
                    { crop_name: "Soybean", variety: "JS-9560", expected_yield: "25-30 q/ha", sowing_time: "Jun 15-Jul 10", source: "Mahabeej", availability_link: "https://mahabeej.com", profitability_score: 82, market_demand: "High", government_support: "MSP ₹4,600/qtl; NFSM subsidy on seeds" },
                    { crop_name: "Cotton", variety: "BGII Bollgard", expected_yield: "20-25 q/ha", sowing_time: "May 15-Jun 15", source: "Mahyco/Bayer", availability_link: "https://seednet.gov.in", profitability_score: 75, market_demand: "Moderate", government_support: "MSP ₹7,020/qtl; CCI procurement" },
                    { crop_name: "Tur (Pigeon Pea)", variety: "BDN-716", expected_yield: "15-18 q/ha", sowing_time: "Jun 15-Jul 5", source: "MPKV Rahuri", availability_link: "https://seednet.gov.in", profitability_score: 80, market_demand: "Very High", government_support: "MSP ₹7,000/qtl; NAFED procurement" },
                    { crop_name: "Maize", variety: "Rajkumar", expected_yield: "50-60 q/ha", sowing_time: "Jun 10-Jun 30", source: "Pioneer Seeds", availability_link: "https://seednet.gov.in", profitability_score: 77, market_demand: "High", government_support: "MSP ₹2,090/qtl" },
                ],
                ai_confidence: 0.89,
                farmer_advice: "Soybean-wheat rotation is highly profitable in Maharashtra. For Vidarbha, intercrop soybean + tur for risk management. Apply Rhizobium culture to soybean seeds before sowing for 15-20% higher yield through nitrogen fixation."
            }
        },
        "Rajasthan": {
            "Rabi": {
                location_analysis: "Rajasthan's arid to semi-arid climate requires drought-tolerant crops. Western Rajasthan suits cumin and mustard; eastern Rajasthan has better irrigation for wheat.",
                soil_suitability: `${soilType} soil in Rajasthan is typically sandy with low water retention. Requires water-efficient crops and drip irrigation for best results.`,
                recommended_crops: [
                    { crop_name: "Mustard", variety: "RH-749", expected_yield: "20-24 q/ha", sowing_time: "Oct 10-25", source: "RARI Jaipur", availability_link: "https://seednet.gov.in", profitability_score: 85, market_demand: "Very High", government_support: "MSP ₹5,650/qtl; oil mission subsidy" },
                    { crop_name: "Cumin", variety: "RZ-19", expected_yield: "7-9 q/ha", sowing_time: "Nov 15-Dec 5", source: "RARI Seeds", availability_link: "https://seednet.gov.in", profitability_score: 92, market_demand: "Very High", government_support: "Spice Board export support; MIDH scheme" },
                    { crop_name: "Wheat", variety: "Raj-4120", expected_yield: "40-45 q/ha", sowing_time: "Nov 5-25", source: "Rajasthan Seed Corp", availability_link: "https://seednet.gov.in", profitability_score: 78, market_demand: "High", government_support: "MSP ₹2,275/qtl" },
                    { crop_name: "Isabgol", variety: "RI-89", expected_yield: "12-15 q/ha", sowing_time: "Oct 20-Nov 10", source: "RARI", availability_link: "https://seednet.gov.in", profitability_score: 90, market_demand: "High", government_support: "APEDA export promotion" },
                ],
                ai_confidence: 0.91,
                farmer_advice: "Cumin is the most profitable Rabi crop for western Rajasthan but risky due to blight. Use RZ-19 variety which has moderate blight tolerance. Mustard is a safer choice with guaranteed MSP. Apply sulphur @ 40kg/ha for better oil content in mustard."
            }
        }
    };

    const stateData = stateRecommendations[state];
    if (stateData && stateData[season]) return stateData[season];

    // Generic fallback
    return {
        location_analysis: `Analysis for ${state} region during ${season} season. The area has moderate rainfall and suitable conditions for seasonal crops.`,
        soil_suitability: `${soilType} soil is well-suited for multiple crops. Soil testing recommended at nearest KVK for precise nutrient management.`,
        recommended_crops: [
            { crop_name: season === "Rabi" ? "Wheat" : "Rice", variety: season === "Rabi" ? "HD-2967" : "Swarna", expected_yield: season === "Rabi" ? "45-50 q/ha" : "50-55 q/ha", sowing_time: season === "Rabi" ? "Nov 1-25" : "Jun 15-Jul 10", source: "Government Seed Store", availability_link: "https://seednet.gov.in", profitability_score: 80, market_demand: "High", government_support: "MSP support available" },
            { crop_name: season === "Rabi" ? "Mustard" : "Maize", variety: season === "Rabi" ? "Pusa Bold" : "DHM-117", expected_yield: season === "Rabi" ? "18-22 q/ha" : "55-60 q/ha", sowing_time: season === "Rabi" ? "Oct 15-Nov 5" : "Jun 1-20", source: "NSC/State Seed Corp", availability_link: "https://seednet.gov.in", profitability_score: 76, market_demand: "Moderate", government_support: "NFSM support" },
            { crop_name: season === "Rabi" ? "Chickpea" : "Soybean", variety: season === "Rabi" ? "JG-14" : "JS-9560", expected_yield: season === "Rabi" ? "18-22 q/ha" : "22-28 q/ha", sowing_time: season === "Rabi" ? "Oct 20-Nov 10" : "Jun 15-Jul 5", source: "KVK/Research Station", availability_link: "https://seednet.gov.in", profitability_score: 78, market_demand: "High", government_support: "MSP + NAFED procurement" },
            { crop_name: "Vegetables (Mixed)", variety: "Local improved", expected_yield: "150-200 q/ha", sowing_time: "Year-round with seasonal planning", source: "Local nurseries", availability_link: "https://nhm.gov.in", profitability_score: 85, market_demand: "Very High", government_support: "NHM subsidy up to 50% on seeds/inputs" },
        ],
        ai_confidence: 0.82,
        farmer_advice: `For ${season} season, focus on crops with MSP support for guaranteed income. Get your soil tested (free under Soil Health Card scheme) and apply fertilizers accordingly. Register on PM-KISAN portal for ₹6,000/year support. Consider crop insurance under PMFBY — premium is only 1.5-2% for Rabi/Kharif.`
    };
}

// ===================== AI DOCTOR RESPONSES =====================
function getCropDiagnosis(crop: string): any {
    const diagnosisMap: Record<string, any> = {
        "Rice": { diagnosis: "Based on the leaf lesions and yellowing pattern, this appears to be Bacterial Leaf Blight (BLB) caused by Xanthomonas oryzae. The water-soaked lesions starting from leaf tips and wavy margins are characteristic symptoms.", disease_identified: "Bacterial Leaf Blight (BLB)", recommended_solutions: ["Drain excess water from the field immediately — BLB thrives in stagnant water", "Spray Streptocycline 0.01% + Copper oxychloride 0.25% at 10-day intervals", "Apply potash (MOP) to strengthen plant defense — 20kg/acre as foliar spray", "Use resistant varieties like PR-126 or Samba Mansuri in next season"], confidence_score: 0.87, severity: "medium", prevention_tips: ["Avoid excess nitrogen fertilization (promotes BLB spread)", "Maintain proper plant spacing for air circulation", "Use certified disease-free seeds", "Clean field equipment between fields to prevent spread"] },
        "Wheat": { diagnosis: "The yellow-orange pustules on leaves and stems indicate Yellow Rust (Stripe Rust) caused by Puccinia striiformis. Early infection can reduce yield by 40-60% if untreated.", disease_identified: "Yellow Rust (Stripe Rust)", recommended_solutions: ["Spray Propiconazole 25% EC @ 0.1% (1ml/litre water) immediately", "If severe, use Tebuconazole 250 EC @ 0.1% for curative action", "Apply second spray after 15 days if pustules still visible", "Next season, use resistant varieties like HD-2967 or WH-1105"], confidence_score: 0.91, severity: "high", prevention_tips: ["Sow wheat before November 25 to avoid late-season rust pressure", "Remove volunteer wheat plants from field borders", "Avoid excess nitrogen — it promotes lush growth susceptible to rust", "Monitor crop from January onwards for early rust detection"] },
        "Cotton": { diagnosis: "White flies on leaf undersides and upward leaf curling are symptoms of Cotton Leaf Curl Virus Disease (CLCuD). This is a viral disease transmitted by whitefly vector.", disease_identified: "Cotton Leaf Curl Virus (CLCuD)", recommended_solutions: ["There is NO cure for viral infection — manage the whitefly vector", "Spray Thiamethoxam 25 WG @ 0.2g/L to control whiteflies", "Install yellow sticky traps @ 12/acre to monitor whitefly population", "Remove and destroy severely infected plants to reduce virus reservoir"], confidence_score: 0.85, severity: "high", prevention_tips: ["Use CLCuD-tolerant Bt cotton varieties", "Avoid late sowing — sow before May 15", "Control weeds which harbor whiteflies", "Do not grow Bt cotton near okra/tomato — they are whitefly hosts"] },
        "Potato": { diagnosis: "Dark brown, water-soaked lesions on leaves with white fungal growth underneath indicate Late Blight caused by Phytophthora infestans. This is the most destructive potato disease.", disease_identified: "Late Blight (Phytophthora)", recommended_solutions: ["Apply Mancozeb 75% WP @ 2.5g/L as preventive spray immediately", "For curative action, use Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L", "Repeat spray every 7-10 days in wet/cloudy weather", "Good drainage is critical — do not let water stagnate in furrows"], confidence_score: 0.93, severity: "high", prevention_tips: ["Use disease-free certified seed potatoes from CPRI", "Avoid overhead sprinkler irrigation", "Hill up potato plants properly to prevent tuber exposure to rain splash", "Destroy all plant debris after harvest — pathogen survives in debris"] },
        "Tomato": { diagnosis: "Concentric ring-like brown lesions on lower leaves spreading upward suggest Early Blight caused by Alternaria solani. Common during warm, humid conditions.", disease_identified: "Early Blight (Alternaria)", recommended_solutions: ["Spray Chlorothalonil 75% WP @ 2g/L or Mancozeb 75% WP @ 2.5g/L", "Remove and destroy infected lower leaves to slow spread", "Apply mulch around plants to prevent soil splash onto leaves", "Stake plants to improve air circulation"], confidence_score: 0.89, severity: "medium", prevention_tips: ["Maintain proper spacing (60cm x 45cm) for air circulation", "Avoid overhead irrigation — use drip irrigation", "Rotate with non-solanaceous crops for 2-3 years", "Use resistant varieties like Arka Rakshak or Arka Samrat"] },
        "Onion": { diagnosis: "Purplish-brown lesions with concentric rings on leaves indicate Purple Blotch disease caused by Alternaria porri. Commonly occurs during high humidity.", disease_identified: "Purple Blotch (Alternaria)", recommended_solutions: ["Spray Mancozeb 75% WP @ 2.5g/L at first appearance of symptoms", "Follow up with Tricyclazole 75% + Mancozeb at 10-day intervals", "Improve drainage to reduce humidity around plants", "Avoid excess irrigation during bulb formation stage"], confidence_score: 0.88, severity: "medium", prevention_tips: ["Use disease-free planting material", "Follow 3-year crop rotation", "Apply balanced fertilization — excess nitrogen promotes disease", "Install drip irrigation for precise water management"] },
        "Soybean": { diagnosis: "Yellow mosaic pattern on leaves with crinkled margins indicates Yellow Mosaic Virus (YMV) transmitted by whiteflies. Infected plants show stunted growth and low pod set.", disease_identified: "Yellow Mosaic Virus (YMV)", recommended_solutions: ["No cure for virus — control whitefly vector immediately", "Spray Imidacloprid 17.8% SL @ 0.3ml/L or Thiamethoxam 25 WG @ 0.2g/L", "Remove and destroy infected plants immediately", "Install yellow sticky traps for whitefly monitoring"], confidence_score: 0.86, severity: "high", prevention_tips: ["Use resistant varieties like JS-9560 or JS-2069", "Sow early in the season (June 15-20) to escape peak whitefly activity", "Keep field borders weed-free to eliminate whitefly breeding grounds", "Intercrop with non-host crops like maize or sorghum"] },
    };

    return diagnosisMap[crop] || {
        diagnosis: "Based on the symptoms observed, this could be a combination of nutrient deficiency and fungal infection. The yellowing pattern suggests possible nitrogen or iron deficiency, while lesions indicate potential fungal attack. A detailed soil test and closer field examination is recommended.",
        disease_identified: "Suspected Nutrient Deficiency + Fungal Infection",
        recommended_solutions: [
            "Get soil tested at nearest KVK or soil testing lab (free under Soil Health Card scheme)",
            "Apply broad-spectrum fungicide (Mancozeb 75% WP @ 2.5g/L) as precautionary spray",
            "Check and improve drainage if waterlogging is present",
            "Apply balanced NPK fertilizer based on soil test recommendations",
            "Consult your local KVK expert with a physical sample for accurate diagnosis"
        ],
        confidence_score: 0.65,
        severity: "medium",
        prevention_tips: [
            "Regular soil testing every season",
            "Follow recommended crop rotation practices",
            "Use certified disease-free seeds for sowing",
            "Maintain proper plant spacing and field hygiene",
            "Monitor crops weekly during critical growth stages"
        ]
    };
}

// ===================== WEATHER ADVICE RESPONSES =====================
function getWeatherAdvice(state: string, season: string): any {
    const adviceMap: Record<string, any> = {
        "Punjab": {
            field_operations: `Good conditions for ${season === 'Rabi' ? 'wheat sowing and irrigation' : 'rice transplanting'}. Soil moisture is adequate.`,
            crop_protection: "Monitor for aphids in mustard/wheat. Humidity favors fungal infections — apply preventive fungicide if needed.",
            safety_measures: `${season === 'Rabi' ? 'Dense fog expected Dec-Jan. Delay spraying during fog.' : 'Avoid field work 11am-4pm in peak heat.'}`,
            best_farming_days: "Next 3-4 days are ideal for planting and field work based on current weather.",
            overall_summary: `Weather in Punjab is ${season === 'Rabi' ? 'cool and favorable for Rabi crops' : 'warm and suitable for Kharif season'}.`
        },
        "Maharashtra": {
            field_operations: `Good time for ${season === 'Kharif' ? 'soybean and cotton sowing' : 'onion and wheat cultivation'}.`,
            crop_protection: "Watch for bollworm in cotton and yellow mosaic in soybean. Regular scouting recommended.",
            safety_measures: "Western Maharashtra may experience heavy showers. Ensure proper field drainage.",
            best_farming_days: "Current week shows favorable conditions for spraying and fertilizer application.",
            overall_summary: `Maharashtra shows varied conditions. ${season === 'Kharif' ? 'Monsoon on track' : 'Post-monsoon dry spell suitable for Rabi'}.`
        },
        "Rajasthan": {
            field_operations: `${season === 'Rabi' ? 'Mustard and cumin sowing conditions are optimal' : 'Bajra and guar sowing after first rains'}.`,
            crop_protection: "Watch for locust movement in western districts. Apply insecticides if swarms spotted.",
            safety_measures: "Heat wave possible in western Rajasthan. Ensure adequate irrigation and mulching.",
            best_farming_days: "Early morning hours best for field operations.",
            overall_summary: `Arid conditions require efficient water management. ${season === 'Rabi' ? 'Good time for mustard' : 'Monitor monsoon progress'}.`
        },
    };
    return adviceMap[state] || {
        field_operations: `Current weather is ${season === 'Rabi' ? 'cool and suitable for winter crops' : 'warm with adequate moisture for Kharif crops'}.`,
        crop_protection: "Monitor crops for seasonal pests. Apply preventive sprays if conditions favor disease.",
        safety_measures: "Follow weather updates. Keep emergency supplies ready.",
        best_farming_days: "Next 3-5 days show stable weather — ideal for planting.",
        overall_summary: `Weather is generally favorable for ${season} season farming.`
    };
}

// ===================== MANDI ADVICE RESPONSES =====================
function getMandiAdvice(state: string, crop: string): any {
    const adviceMap: Record<string, any> = {
        "Punjab": { price_analysis: "Wheat stable at MSP ₹2,275/qtl. Rice showing upward trend.", best_mandi: "Khanna Mandi for wheat, Ludhiana APMC for rice.", selling_advice: "Good time to sell paddy — procurement active. Hold wheat if storage available.", farmer_tip: "Register on e-NAM for transparent price discovery." },
        "Maharashtra": { price_analysis: "Onion volatile ₹800-1,500/qtl in Nashik. Soybean stable.", best_mandi: "Pune Market Yard for vegetables, Nashik for onions.", selling_advice: "Avoid panic selling during dips. Store onions in ventilated structures.", farmer_tip: "Grade and sort produce — A/B grade fetches 30-40% premium." },
        "Rajasthan": { price_analysis: "Cumin high ₹30,000-38,000/qtl. Mustard steady at ₹5,100/qtl.", best_mandi: "Jodhpur Mandi for cumin, Kota for soybean.", selling_advice: "Cumin at seasonal high — sell 60-70% now.", farmer_tip: "Ensure 10-12% moisture in cumin before selling." },
    };
    return adviceMap[state] || {
        price_analysis: `${crop !== 'General' ? crop + ' prices' : 'Commodity prices'} showing stable trends.`,
        best_mandi: "Check local APMC rates and e-NAM marketplace.",
        selling_advice: `Good time to sell if prices near MSP. Monitor 2-3 days before committing.`,
        farmer_tip: "Check rates at multiple mandis. Factor transport costs into the decision."
    };
}

// ===================== CHATBOT CONVERSATIONAL RESPONSES =====================
function getConversationalResponse(prompt: string, state: string, crop: string, season: string): string {
    const promptLower = prompt.toLowerCase();

    // Greetings
    if (promptLower.includes("hello") || promptLower.includes("hi ") || promptLower.includes("namaste") || promptLower.includes("hi,") || promptLower.match(/^hi$/m)) {
        return "Namaste! 🙏 Welcome to AgriNexus AI. I'm your smart farming assistant.\n\nI can help you with:\n- 🌾 **Crop recommendations** based on your location & soil\n- 🌤️ **Weather-based farming advice**\n- 💰 **Mandi price analysis** & selling tips\n- 🌱 **Seed variety suggestions**\n- 🧪 **Fertilizer & soil health guidance**\n- 🏛️ **Government scheme information**\n- 🔬 **Crop disease diagnosis**\n\nPlease tell me your name and which state you're farming in, so I can give you personalized advice!";
    }

    // Thanks
    if (promptLower.includes("thank") || promptLower.includes("dhanyavaad") || promptLower.includes("shukriya")) {
        return "You're welcome! 🙏 Happy to help. Feel free to ask me anything about farming, weather, seeds, or government schemes. Wishing you a bountiful harvest! 🌾";
    }

    // Help
    if (promptLower.includes("help") || promptLower.includes("kya kar sakte")) {
        return "I'm your AgriNexus farming assistant! Here's what I can do:\n\n🌾 **Crop Advice**: Tell me your location, soil type, and season — I'll recommend the best crops.\n\n🌤️ **Weather Guidance**: Ask about weather impact on your farming operations.\n\n💰 **Market Prices**: I can share mandi price trends and selling strategies.\n\n🌱 **Seed Info**: Which seeds to buy, where to get them, and at what price.\n\n🧪 **Fertilizer Guide**: Check toxicity levels and find organic alternatives.\n\n🏛️ **Government Schemes**: PM-KISAN, PMFBY, Kisan Credit Card, and more.\n\n🔬 **Disease Help**: Describe symptoms and I'll suggest treatments.\n\nJust type your question naturally — I understand Hindi and English both!";
    }

    // Location/name context
    if (promptLower.match(/my name is|i am |main .* hoon|mera naam/)) {
        return "Welcome! 😊 Nice to meet you! To give you the best farming advice, could you tell me:\n\n1. Which **state and district** are you from?\n2. What **crop** are you currently growing or planning to grow?\n3. What's your **soil type** (if you know)?\n\nThis will help me provide personalized, location-specific recommendations!";
    }

    // Crop-specific advice
    if (crop !== "General") {
        const cropAdvice: Record<string, string> = {
            "Wheat": `Great choice with wheat! 🌾 Here are my tips for ${state !== "General" ? state : "your region"}:\n\n**Sowing**: Best window is Nov 1-25. Delay beyond Nov 30 reduces yield by 3-4% per week.\n\n**Varieties**: HD-2967 (most popular), WH-1105 (high yield), PBW-343 (drought tolerant).\n\n**First Irrigation**: Most critical at CRI stage (21 days after sowing). Gives 15-20% yield boost.\n\n**Fertilizer**: Apply 120:60:40 NPK kg/ha. Use neem-coated urea for 10-15% better efficiency.\n\n**MSP**: ₹2,275/qtl with government procurement guarantee.\n\nWould you like more specific advice about disease management, irrigation schedule, or market timing?`,
            "Rice": `Rice farming tips for ${state !== "General" ? state : "your region"} 🌾:\n\n**Transplanting**: June 15 onwards (follow state directive for water conservation).\n\n**Best Varieties**: PR-126 (short duration, saves water), Pusa-44 (high yield but water-intensive).\n\n**Water Management**: Alternate Wetting & Drying (AWD) saves 20-25% water with same yield.\n\n**Fertilizer**: 100:50:50 NPK kg/ha. Apply zinc sulphate @25kg/ha for better grain filling.\n\n**Key Disease**: Watch for BLB in humid conditions. Spray Streptocycline if symptoms appear.\n\n**MSP**: ₹2,203/qtl with active government procurement.\n\nWant details on any specific aspect?`,
            "Cotton": `Cotton farming guidance for ${state !== "General" ? state : "your region"} 🧵:\n\n**Sowing**: April 15 - May 15 is ideal. Avoid late sowing.\n\n**Bt Cotton**: Use approved varieties only. Don't save Bt seeds — buy fresh each year.\n\n**Spacing**: 90cm x 60cm for proper plant development.\n\n**Bollworm IPM**: Install pheromone traps @5/acre. Release Trichogramma @1.5 lakh/acre at 45 DAS.\n\n**Picking**: Pick only fully opened bolls. Keep different pickings separate for better grading.\n\n**MSP**: ₹7,020/qtl for medium staple cotton.\n\nNeed help with pest management or market timing?`,
        };

        if (cropAdvice[crop]) return cropAdvice[crop];

        return `Here's an overview for **${crop}** farming:\n\n✅ **Season**: Best grown during ${season} season in ${state !== "General" ? state : "most Indian states"}.\n\n🌱 **Seeds**: Get certified seeds from your nearest government seed store or KVK.\n\n💧 **Irrigation**: Follow critical stage irrigation for maximum yield.\n\n🧪 **Soil Test**: Get free soil testing under Soil Health Card scheme at your nearest KVK.\n\n💰 **Marketing**: Check today's rates on e-NAM portal before selling.\n\n🏛️ **Support**: Register for PMFBY crop insurance (premium only 1.5-2%).\n\nWant more details about ${crop} cultivation?`;
    }

    // Government schemes
    if (promptLower.includes("scheme") || promptLower.includes("yojana") || promptLower.includes("subsidy") || promptLower.includes("pm kisan") || promptLower.includes("pmfby")) {
        return `Here are key government schemes for farmers 🏛️:\n\n**1. PM-KISAN** 💰\n- ₹6,000/year in 3 installments\n- Register: pmkisan.gov.in\n\n**2. PMFBY (Crop Insurance)** 🛡️\n- Premium: 1.5% Rabi, 2% Kharif\n- Full coverage against natural calamities\n\n**3. Kisan Credit Card** 🏦\n- Loan up to ₹3 lakh at 4% interest\n- Apply at any bank branch\n\n**4. Soil Health Card** 🧪\n- Free soil testing at KVK\n- Personalized fertilizer recommendations\n\n**5. PM Fasal Bima** 📋\n- Enroll before sowing season deadline\n\n${state !== "General" ? `\n**State-specific (${state})**: Check your state agriculture portal for additional subsidies on seeds, drip irrigation, and farm machinery.` : ""}\n\nWant details on any specific scheme?`;
    }

    // Default
    return `I'm your AgriNexus AI assistant 🌾. I can help with crop-specific advice, weather-based recommendations, mandi prices, seeds, fertilizers, and government schemes.\n\n${state !== "General" ? `I see you're from ${state}. ` : ""}${crop !== "General" ? `Growing ${crop} is a great choice! ` : ""}\n\nPlease share more details about what you need help with, and I'll provide personalized guidance. You can ask me in Hindi or English!`;
}

export async function UploadFile(file: File): Promise<string> {
    console.log("Uploading file:", file.name);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return URL.createObjectURL(file);
}
