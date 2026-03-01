export interface WeatherAlertInterface {
    id: string;
    type: string;
    message: string;
    severity: 'low' | 'moderate' | 'high' | 'extreme';
    advisory: string[];
    region?: string;
    state?: string;
}

// Region-based weather alerts that change based on location
const regionAlerts: Record<string, WeatherAlertInterface[]> = {
    // Coastal regions
    "coastal": [
        { id: "c1", type: "Cyclone Watch", message: "Low pressure forming over Bay of Bengal. Coastal areas advised to stay alert.", severity: "high", advisory: ["Secure farm equipment", "Harvest mature crops immediately", "Prepare drainage channels", "Keep emergency supplies ready"] },
        { id: "c2", type: "High Tide Warning", message: "High tides expected along coastal areas. Saltwater intrusion risk for coastal farms.", severity: "moderate", advisory: ["Check bund integrity", "Move livestock to higher ground", "Avoid coastal grazing", "Monitor soil salinity after event"] },
    ],
    // Arid regions
    "arid": [
        { id: "a1", type: "Heat Wave", message: "Temperatures exceeding 45°C expected. Extreme heat stress on crops and livestock.", severity: "extreme", advisory: ["Irrigate crops during early morning/late evening", "Provide shade and extra water for livestock", "Avoid field work during peak hours (11am-4pm)", "Apply mulch to conserve soil moisture"] },
        { id: "a2", type: "Dust Storm Warning", message: "Dust storms likely in western regions. May damage standing crops.", severity: "high", advisory: ["Secure plastic mulch and shade nets", "Cover nursery plants", "Park farm machinery in sheltered areas", "Avoid spraying pesticides today"] },
    ],
    // Northern plains
    "northern": [
        { id: "n1", type: "Cold Wave", message: "Minimum temperatures dropping below 4°C. Frost likely in open areas.", severity: "high", advisory: ["Light irrigation in evening to protect from frost", "Cover nursery with polythene sheets", "Delay sowing of summer vegetables", "Apply smoke screens for frost protection"] },
        { id: "n2", type: "Dense Fog", message: "Dense fog expected for next 3-4 days. Visibility below 50 meters.", severity: "moderate", advisory: ["Delay pesticide spraying", "Increased risk of fungal diseases — monitor crops", "Use markers for driving on rural roads", "Good time for manual weeding operations"] },
    ],
    // Eastern/monsoon regions
    "eastern": [
        { id: "e1", type: "Heavy Rainfall Alert", message: "Heavy to very heavy rainfall expected. Waterlogging risk in low-lying areas.", severity: "high", advisory: ["Clear drainage channels immediately", "Harvest mature crops before rain", "Delay fertilizer application", "Prepare for possible flood situation"] },
        { id: "e2", type: "Flood Warning", message: "River levels rising. Low-lying agricultural areas may get inundated.", severity: "extreme", advisory: ["Move livestock to elevated areas", "Secure important documents and seeds", "Contact local disaster management", "Do not attempt to cross flooded roads"] },
    ],
    // Southern peninsular  
    "southern": [
        { id: "s1", type: "Dry Spell Advisory", message: "Extended dry spell expected. Rainfall deficit of 30% in current season.", severity: "moderate", advisory: ["Use drip irrigation to conserve water", "Apply mulch around crops", "Prioritize water for high-value crops", "Consider short-duration varieties for late sowing"] },
        { id: "s2", type: "Northeast Monsoon Alert", message: "Heavy rainfall from northeast monsoon expected in next 48 hours.", severity: "high", advisory: ["Complete harvesting of standing rice crops", "Ensure proper drainage in fields", "Secure stored produce from moisture", "Delay sowing operations by a week"] },
    ],
    // Default
    "default": [
        { id: "d1", type: "Weather Advisory", message: "Normal weather conditions. Good period for farming activities.", severity: "low", advisory: ["Continue regular farming operations", "Monitor weather forecast daily", "Plan ahead for seasonal changes", "Good time for field preparation"] },
    ],
};

// Map states to their climate region
const stateRegionMap: Record<string, string> = {
    "Andhra Pradesh": "coastal", "Goa": "coastal", "Kerala": "coastal",
    "Odisha": "coastal", "Tamil Nadu": "southern",
    "Rajasthan": "arid", "Gujarat": "arid",
    "Punjab": "northern", "Haryana": "northern", "Uttar Pradesh": "northern",
    "Uttarakhand": "northern", "Himachal Pradesh": "northern",
    "Bihar": "eastern", "Jharkhand": "eastern", "West Bengal": "eastern",
    "Assam": "eastern", "Meghalaya": "eastern", "Tripura": "eastern",
    "Karnataka": "southern", "Telangana": "southern",
    "Madhya Pradesh": "northern", "Chhattisgarh": "eastern",
    "Maharashtra": "southern",
};

export class WeatherAlert {
    static async filter(criteria?: { state?: string }): Promise<WeatherAlertInterface[]> {
        if (!criteria?.state) return regionAlerts["default"];

        const region = stateRegionMap[criteria.state] || "default";
        const alerts = regionAlerts[region] || regionAlerts["default"];

        // Add state info to alerts
        return alerts.map(alert => ({ ...alert, state: criteria.state, region }));
    }
}
