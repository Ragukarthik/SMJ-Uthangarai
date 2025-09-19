export interface LoginResponse {
  status: string;
  message: string;
  data?: any;
}

export interface PriceData {
  gold_1g?: string;
  gold_8g?: string;
  silver_1g?: string;
  date?: string;
}

export interface PriceResponse {
  status: string;
  data: PriceData;
}