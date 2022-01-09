import axios, { AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

type Prices = {
  [coinId: string]: {
    [currency: string]: number;
  };
};

export function getPriceOfCoins(coins: string[]): Promise<AxiosResponse<Prices>> {
  return apiClient.get<Prices>(`/simple/price?vs_currencies=usd&ids=${coins.join(',')}`);
}
