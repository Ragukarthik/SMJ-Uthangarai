import axios from 'axios';
import { LoginResponse, PriceResponse } from '@/types/api';

const BASE_URL = 'http://smjuthangarai.in/RestApi/restApiPHP.php';

export const api = {
  login: async (mobileNumber: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          option: 'LoginVerifyCustomer',
          mobileNumber,
          password,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Login failed. Please try again.');
    }
  },

  getPrices: async (): Promise<PriceResponse> => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          option: 'PriceListToday',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch prices. Please try again.');
    }
  },
};