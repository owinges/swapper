import axios, { AxiosResponse } from 'axios';

export interface Coin {
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  circulating_supply: number;
  current_price: number;
  fully_diluted_valuation: number | null;
  high_24h: number;
  id: string;
  image: string;
  last_updated: string;
  low_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  market_cap_rank: number;
  max_supply: number | null;
  name: string;
  price_change_24h: number;
  price_change_percentage_24h: number;
  roi: {
    currency: string;
    percentage: number;
    times: number;
  } | null;
  symbol: string;
  total_supply: number;
  total_volume: number;
}

const apiClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

type Prices = {
  [coinId: string]: {
    [currency: string]: number;
  };
};

export const CoinGeckoService = {
  getCoins(): Promise<AxiosResponse<Coin[]>> {
    return apiClient.get<Coin[]>('/coins/markets?vs_currency=usd');
  },
  getCoinList(): Promise<AxiosResponse<any[]>> {
    return apiClient.get<any[]>('/coins/list');
  },
  // getPriceOfCoin(coin: string): Promise<AxiosResponse<any[]>> {
  //   return apiClient.get<any[]>(`/simple/price?vs_currencies=usd&ids=${coin}`);
  // },
  getPriceOfCoins(coins: string[]): Promise<AxiosResponse<Prices>> {
    console.log(coins);
    return apiClient.get<Prices>(`/simple/price?vs_currencies=usd&ids=${coins.join(',')}`);
  },
};
