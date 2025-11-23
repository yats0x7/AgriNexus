export async function InvokeLLM(promptOrOptions: string | { prompt: string;[key: string]: any }): Promise<string> {
    const prompt = typeof promptOrOptions === 'string' ? promptOrOptions : promptOrOptions.prompt;
    const options: any = typeof promptOrOptions === 'object' ? promptOrOptions : {};
    console.log("Invoking LLM with prompt:", prompt);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if JSON schema is requested
    const needsJSON = options.response_json_schema || prompt.toLowerCase().includes('json');

    // Mock responses based on keywords - return JSON when schema is provided
    if (prompt.toLowerCase().includes("weather") && prompt.toLowerCase().includes("advice")) {
        return JSON.stringify({
            field_operations: "Good conditions for sowing and irrigation. Soil moisture is adequate.",
            crop_protection: "Monitor for pests due to favorable weather. Apply preventive sprays if needed.",
            safety_measures: "No severe weather expected. Safe to conduct field operations.",
            best_farming_days: "Next 3-5 days are ideal for planting and field work.",
            overall_summary: "Weather conditions are favorable for farming activities. Make use of the good weather window."
        });
    }
    if (prompt.toLowerCase().includes("price") || prompt.toLowerCase().includes("mandi")) {
        return JSON.stringify({
            price_analysis: "Prices are currently stable with slight upward trend due to good demand.",
            best_mandi: "Ludhiana Mandi offers the best prices for wheat at ₹2150/quintal.",
            selling_advice: "Good time to sell as prices are favorable. Consider selling within next week.",
            farmer_tip: "Transport costs are low this week. Bulk selling recommended for better margins."
        });
    }
    if (prompt.toLowerCase().includes("disease") || prompt.toLowerCase().includes("diagnosis")) {
        return JSON.stringify({
            diagnosis: "Leaf Rust",
            recommended_solutions: ["Apply fungicide", "Improve drainage"],
            confidence: 0.9
        });
    }
    if (prompt.toLowerCase().includes("recommendation") || prompt.toLowerCase().includes("crop")) {
        return JSON.stringify({
            recommended_crops: ["Wheat", "Mustard"],
            ai_confidence: 0.85
        });
    }
    if (prompt.toLowerCase().includes("fertilizer")) {
        return JSON.stringify({
            soil_health: "Good",
            npk_ratio: "Balanced NPK recommended",
            organic_alternatives: ["Compost", "Vermicompost"],
            toxicity_level: "Low",
            application_timing: "Apply before monsoon",
            alternatives: [
                { name: "Organic Compost", benefit: "Improves soil structure" },
                { name: "Vermicompost", benefit: "Rich in nutrients" }
            ]
        });
    }

    return "I am an AI assistant for agriculture. How can I help you today?";
}


export async function UploadFile(file: File): Promise<string> {
    console.log("Uploading file:", file.name);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a fake URL
    return URL.createObjectURL(file);
}
