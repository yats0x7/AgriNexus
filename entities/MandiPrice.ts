export interface MandiPriceInterface {
  id: string;
  state: string;
  district: string;
  market: string;
  mandi_name: string;
  commodity: string;
  crop_name: string;
  variety: string;
  min_price: number;
  price_min: number;
  max_price: number;
  price_max: number;
  modal_price: number;
  price_modal: number;
  price_date: string;
  arrival_quantity: number;
}

// Comprehensive mandi price data across multiple states
const allMandiPrices: MandiPriceInterface[] = [
  // Punjab
  { id: "1", state: "Punjab", district: "Ludhiana", market: "Ludhiana Mandi", mandi_name: "Ludhiana Mandi", commodity: "Rice", crop_name: "Rice", variety: "Basmati 1121", min_price: 3500, price_min: 3500, max_price: 4200, price_max: 4200, modal_price: 3800, price_modal: 3800, price_date: new Date().toISOString(), arrival_quantity: 150 },
  { id: "2", state: "Punjab", district: "Ludhiana", market: "Khanna Mandi", mandi_name: "Khanna Mandi", commodity: "Wheat", crop_name: "Wheat", variety: "Sharbati", min_price: 2100, price_min: 2100, max_price: 2350, price_max: 2350, modal_price: 2200, price_modal: 2200, price_date: new Date().toISOString(), arrival_quantity: 500 },
  { id: "3", state: "Punjab", district: "Amritsar", market: "Amritsar Mandi", mandi_name: "Amritsar Mandi", commodity: "Rice", crop_name: "Rice", variety: "PR-126", min_price: 2200, price_min: 2200, max_price: 2500, price_max: 2500, modal_price: 2350, price_modal: 2350, price_date: new Date().toISOString(), arrival_quantity: 300 },
  { id: "4", state: "Punjab", district: "Bathinda", market: "Bathinda Mandi", mandi_name: "Bathinda Mandi", commodity: "Cotton", crop_name: "Cotton", variety: "American", min_price: 6200, price_min: 6200, max_price: 6800, price_max: 6800, modal_price: 6500, price_modal: 6500, price_date: new Date().toISOString(), arrival_quantity: 80 },

  // Maharashtra
  { id: "5", state: "Maharashtra", district: "Pune", market: "Pune Market Yard", mandi_name: "Pune Market Yard", commodity: "Onion", crop_name: "Onion", variety: "Red", min_price: 800, price_min: 800, max_price: 1500, price_max: 1500, modal_price: 1100, price_modal: 1100, price_date: new Date().toISOString(), arrival_quantity: 2000 },
  { id: "6", state: "Maharashtra", district: "Nashik", market: "Nashik APMC", mandi_name: "Nashik APMC", commodity: "Grape", crop_name: "Grape", variety: "Thompson Seedless", min_price: 3000, price_min: 3000, max_price: 5500, price_max: 5500, modal_price: 4200, price_modal: 4200, price_date: new Date().toISOString(), arrival_quantity: 400 },
  { id: "7", state: "Maharashtra", district: "Nagpur", market: "Nagpur Mandi", mandi_name: "Nagpur Mandi", commodity: "Orange", crop_name: "Orange", variety: "Nagpuri", min_price: 2500, price_min: 2500, max_price: 4000, price_max: 4000, modal_price: 3200, price_modal: 3200, price_date: new Date().toISOString(), arrival_quantity: 600 },
  { id: "8", state: "Maharashtra", district: "Solapur", market: "Solapur APMC", mandi_name: "Solapur APMC", commodity: "Sugarcane", crop_name: "Sugarcane", variety: "Co-86032", min_price: 2800, price_min: 2800, max_price: 3200, price_max: 3200, modal_price: 3000, price_modal: 3000, price_date: new Date().toISOString(), arrival_quantity: 1500 },

  // Uttar Pradesh
  { id: "9", state: "Uttar Pradesh", district: "Lucknow", market: "Lucknow Mandi", mandi_name: "Lucknow Mandi", commodity: "Wheat", crop_name: "Wheat", variety: "PBW-343", min_price: 2000, price_min: 2000, max_price: 2275, price_max: 2275, modal_price: 2150, price_modal: 2150, price_date: new Date().toISOString(), arrival_quantity: 800 },
  { id: "10", state: "Uttar Pradesh", district: "Agra", market: "Agra Mandi", mandi_name: "Agra Mandi", commodity: "Potato", crop_name: "Potato", variety: "Kufri Bahar", min_price: 400, price_min: 400, max_price: 800, price_max: 800, modal_price: 600, price_modal: 600, price_date: new Date().toISOString(), arrival_quantity: 3000 },
  { id: "11", state: "Uttar Pradesh", district: "Varanasi", market: "Varanasi Mandi", mandi_name: "Varanasi Mandi", commodity: "Rice", crop_name: "Rice", variety: "Sona Masuri", min_price: 2800, price_min: 2800, max_price: 3200, price_max: 3200, modal_price: 3000, price_modal: 3000, price_date: new Date().toISOString(), arrival_quantity: 250 },
  { id: "12", state: "Uttar Pradesh", district: "Muzaffarnagar", market: "Muzaffarnagar Mandi", mandi_name: "Muzaffarnagar Mandi", commodity: "Sugarcane", crop_name: "Sugarcane", variety: "CoS-8436", min_price: 3100, price_min: 3100, max_price: 3500, price_max: 3500, modal_price: 3300, price_modal: 3300, price_date: new Date().toISOString(), arrival_quantity: 2000 },

  // Karnataka
  { id: "13", state: "Karnataka", district: "Bangalore Urban", market: "APMC Yeshwanthpur", mandi_name: "APMC Yeshwanthpur", commodity: "Tomato", crop_name: "Tomato", variety: "Hybrid", min_price: 500, price_min: 500, max_price: 1200, price_max: 1200, modal_price: 800, price_modal: 800, price_date: new Date().toISOString(), arrival_quantity: 1500 },
  { id: "14", state: "Karnataka", district: "Mysore", market: "Mysore APMC", mandi_name: "Mysore APMC", commodity: "Ragi", crop_name: "Ragi", variety: "GPU-28", min_price: 3200, price_min: 3200, max_price: 3600, price_max: 3600, modal_price: 3400, price_modal: 3400, price_date: new Date().toISOString(), arrival_quantity: 200 },
  { id: "15", state: "Karnataka", district: "Shimoga", market: "Shimoga APMC", mandi_name: "Shimoga APMC", commodity: "Arecanut", crop_name: "Arecanut", variety: "Mangala", min_price: 40000, price_min: 40000, max_price: 48000, price_max: 48000, modal_price: 44000, price_modal: 44000, price_date: new Date().toISOString(), arrival_quantity: 50 },

  // Rajasthan
  { id: "16", state: "Rajasthan", district: "Jaipur", market: "Jaipur Mandi", mandi_name: "Jaipur Mandi", commodity: "Mustard", crop_name: "Mustard", variety: "RH-725", min_price: 4800, price_min: 4800, max_price: 5400, price_max: 5400, modal_price: 5100, price_modal: 5100, price_date: new Date().toISOString(), arrival_quantity: 350 },
  { id: "17", state: "Rajasthan", district: "Jodhpur", market: "Jodhpur Mandi", mandi_name: "Jodhpur Mandi", commodity: "Cumin", crop_name: "Cumin", variety: "RZ-19", min_price: 30000, price_min: 30000, max_price: 38000, price_max: 38000, modal_price: 34000, price_modal: 34000, price_date: new Date().toISOString(), arrival_quantity: 100 },
  { id: "18", state: "Rajasthan", district: "Kota", market: "Kota Mandi", mandi_name: "Kota Mandi", commodity: "Soybean", crop_name: "Soybean", variety: "JS-335", min_price: 4000, price_min: 4000, max_price: 4600, price_max: 4600, modal_price: 4300, price_modal: 4300, price_date: new Date().toISOString(), arrival_quantity: 400 },

  // Gujarat
  { id: "19", state: "Gujarat", district: "Rajkot", market: "Rajkot APMC", mandi_name: "Rajkot APMC", commodity: "Groundnut", crop_name: "Groundnut", variety: "GG-20", min_price: 5000, price_min: 5000, max_price: 5800, price_max: 5800, modal_price: 5400, price_modal: 5400, price_date: new Date().toISOString(), arrival_quantity: 450 },
  { id: "20", state: "Gujarat", district: "Ahmedabad", market: "Ahmedabad APMC", mandi_name: "Ahmedabad APMC", commodity: "Cotton", crop_name: "Cotton", variety: "BT Cotton", min_price: 6000, price_min: 6000, max_price: 6600, price_max: 6600, modal_price: 6300, price_modal: 6300, price_date: new Date().toISOString(), arrival_quantity: 200 },
  { id: "21", state: "Gujarat", district: "Junagadh", market: "Junagadh APMC", mandi_name: "Junagadh APMC", commodity: "Groundnut", crop_name: "Groundnut", variety: "TG-37A", min_price: 4800, price_min: 4800, max_price: 5500, price_max: 5500, modal_price: 5200, price_modal: 5200, price_date: new Date().toISOString(), arrival_quantity: 600 },

  // Madhya Pradesh
  { id: "22", state: "Madhya Pradesh", district: "Indore", market: "Indore Mandi", mandi_name: "Indore Mandi", commodity: "Soybean", crop_name: "Soybean", variety: "JS-9560", min_price: 4200, price_min: 4200, max_price: 4800, price_max: 4800, modal_price: 4500, price_modal: 4500, price_date: new Date().toISOString(), arrival_quantity: 700 },
  { id: "23", state: "Madhya Pradesh", district: "Bhopal", market: "Bhopal Mandi", mandi_name: "Bhopal Mandi", commodity: "Wheat", crop_name: "Wheat", variety: "Lokwan", min_price: 2050, price_min: 2050, max_price: 2300, price_max: 2300, modal_price: 2175, price_modal: 2175, price_date: new Date().toISOString(), arrival_quantity: 900 },

  // Tamil Nadu
  { id: "24", state: "Tamil Nadu", district: "Coimbatore", market: "Coimbatore APMC", mandi_name: "Coimbatore APMC", commodity: "Coconut", crop_name: "Coconut", variety: "Tall", min_price: 8000, price_min: 8000, max_price: 12000, price_max: 12000, modal_price: 10000, price_modal: 10000, price_date: new Date().toISOString(), arrival_quantity: 5000 },
  { id: "25", state: "Tamil Nadu", district: "Thanjavur", market: "Thanjavur APMC", mandi_name: "Thanjavur APMC", commodity: "Rice", crop_name: "Rice", variety: "Ponni", min_price: 2600, price_min: 2600, max_price: 3000, price_max: 3000, modal_price: 2800, price_modal: 2800, price_date: new Date().toISOString(), arrival_quantity: 350 },
  { id: "26", state: "Tamil Nadu", district: "Madurai", market: "Madurai APMC", mandi_name: "Madurai APMC", commodity: "Banana", crop_name: "Banana", variety: "Nendran", min_price: 1200, price_min: 1200, max_price: 2000, price_max: 2000, modal_price: 1600, price_modal: 1600, price_date: new Date().toISOString(), arrival_quantity: 800 },

  // Haryana
  { id: "27", state: "Haryana", district: "Karnal", market: "Karnal Mandi", mandi_name: "Karnal Mandi", commodity: "Rice", crop_name: "Rice", variety: "Basmati 1509", min_price: 3200, price_min: 3200, max_price: 3800, price_max: 3800, modal_price: 3500, price_modal: 3500, price_date: new Date().toISOString(), arrival_quantity: 400 },
  { id: "28", state: "Haryana", district: "Hisar", market: "Hisar Mandi", mandi_name: "Hisar Mandi", commodity: "Mustard", crop_name: "Mustard", variety: "RH-749", min_price: 4900, price_min: 4900, max_price: 5500, price_max: 5500, modal_price: 5200, price_modal: 5200, price_date: new Date().toISOString(), arrival_quantity: 280 },

  // West Bengal
  { id: "29", state: "West Bengal", district: "Kolkata", market: "Koley Market", mandi_name: "Koley Market", commodity: "Rice", crop_name: "Rice", variety: "Gobindobhog", min_price: 3500, price_min: 3500, max_price: 4500, price_max: 4500, modal_price: 4000, price_modal: 4000, price_date: new Date().toISOString(), arrival_quantity: 150 },
  { id: "30", state: "West Bengal", district: "Bardhaman", market: "Bardhaman Mandi", mandi_name: "Bardhaman Mandi", commodity: "Rice", crop_name: "Rice", variety: "Swarna", min_price: 1800, price_min: 1800, max_price: 2200, price_max: 2200, modal_price: 2000, price_modal: 2000, price_date: new Date().toISOString(), arrival_quantity: 600 },

  // Bihar
  { id: "31", state: "Bihar", district: "Patna", market: "Patna APMC", mandi_name: "Patna APMC", commodity: "Wheat", crop_name: "Wheat", variety: "HD-2967", min_price: 1950, price_min: 1950, max_price: 2200, price_max: 2200, modal_price: 2075, price_modal: 2075, price_date: new Date().toISOString(), arrival_quantity: 500 },
  { id: "32", state: "Bihar", district: "Muzaffarpur", market: "Muzaffarpur Mandi", mandi_name: "Muzaffarpur Mandi", commodity: "Litchi", crop_name: "Litchi", variety: "Shahi", min_price: 5000, price_min: 5000, max_price: 8000, price_max: 8000, modal_price: 6500, price_modal: 6500, price_date: new Date().toISOString(), arrival_quantity: 200 },

  // Andhra Pradesh
  { id: "33", state: "Andhra Pradesh", district: "Guntur", market: "Guntur Mirchi Yard", mandi_name: "Guntur Mirchi Yard", commodity: "Chilli", crop_name: "Chilli", variety: "Teja", min_price: 12000, price_min: 12000, max_price: 18000, price_max: 18000, modal_price: 15000, price_modal: 15000, price_date: new Date().toISOString(), arrival_quantity: 300 },
  { id: "34", state: "Andhra Pradesh", district: "Krishna", market: "Vijayawada APMC", mandi_name: "Vijayawada APMC", commodity: "Rice", crop_name: "Rice", variety: "BPT 5204", min_price: 2400, price_min: 2400, max_price: 2800, price_max: 2800, modal_price: 2600, price_modal: 2600, price_date: new Date().toISOString(), arrival_quantity: 450 },

  // Telangana
  { id: "35", state: "Telangana", district: "Hyderabad", market: "Bowenpally Market", mandi_name: "Bowenpally Market", commodity: "Turmeric", crop_name: "Turmeric", variety: "Duggirala", min_price: 8000, price_min: 8000, max_price: 12000, price_max: 12000, modal_price: 10000, price_modal: 10000, price_date: new Date().toISOString(), arrival_quantity: 100 },
  { id: "36", state: "Telangana", district: "Karimnagar", market: "Karimnagar Mandi", mandi_name: "Karimnagar Mandi", commodity: "Cotton", crop_name: "Cotton", variety: "DCH-32", min_price: 5800, price_min: 5800, max_price: 6400, price_max: 6400, modal_price: 6100, price_modal: 6100, price_date: new Date().toISOString(), arrival_quantity: 180 },
];

export class MandiPrice {
  static async list(): Promise<MandiPriceInterface[]> {
    return allMandiPrices;
  }

  static async filter(criteria: { state?: string; district?: string; crop?: string }): Promise<MandiPriceInterface[]> {
    return allMandiPrices.filter(price => {
      if (criteria.state && price.state !== criteria.state) return false;
      if (criteria.district && price.district !== criteria.district) return false;
      if (criteria.crop && price.crop_name !== criteria.crop) return false;
      return true;
    });
  }
}
