export type InventoryStatus = 'OutOfStock' | 'LowStock' | 'InStock';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  status: InventoryStatus;
}

export interface CreateInventoryItemPayload {
  name: string;
  sku: string;
  quantity: number;
}
