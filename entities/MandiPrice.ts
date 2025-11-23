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

export class MandiPrice {
  static async list(): Promise<MandiPriceInterface[]> {
    // Mock data
    return [
      {
        id: "1",
        state: "Punjab",
        district: "Ludhiana",
        market: "Ludhiana Mandi",
        mandi_name: "Ludhiana Mandi",
        commodity: "Rice",
        crop_name: "Rice",
        variety: "Basmati",
        min_price: 3500,
        price_min: 3500,
        max_price: 4200,
        price_max: 4200,
        modal_price: 3800,
        price_modal: 3800,
        price_date: new Date().toISOString(),
        arrival_quantity: 150
      },
      {
        id: "2",
        state: "Punjab",
        district: "Ludhiana",
        market: "Khanna Mandi",
        mandi_name: "Khanna Mandi",
        commodity: "Wheat",
        crop_name: "Wheat",
        variety: "Sharbati",
        min_price: 2100,
        price_min: 2100,
        max_price: 2300,
        price_max: 2300,
        modal_price: 2200,
        price_modal: 2200,
        price_date: new Date().toISOString(),
        arrival_quantity: 500
      },
      {
        id: "3",
        state: "Punjab",
        district: "Amritsar",
        market: "Amritsar Mandi",
        mandi_name: "Amritsar Mandi",
        commodity: "Rice",
        crop_name: "Rice",
        variety: "Permal",
        min_price: 2200,
        price_min: 2200,
        max_price: 2400,
        price_max: 2400,
        modal_price: 2300,
        price_modal: 2300,
        price_date: new Date().toISOString(),
        arrival_quantity: 300
      }
    ];
  }
}
