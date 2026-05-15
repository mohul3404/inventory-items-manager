import axios from 'axios';
import type { CreateInventoryItemPayload, InventoryItem } from '../types/inventory';

const baseClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const inventoryApi = {
  getItems: async (): Promise<InventoryItem[]> => {
    const response = await baseClient.get<InventoryItem[]>('/items');
    return response.data;
  },
  createItem: async (payload: CreateInventoryItemPayload): Promise<InventoryItem> => {
    const response = await baseClient.post<InventoryItem>('/items', payload);
    return response.data;
  }
};
