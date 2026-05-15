export type InventoryStatus = 'OutOfStock' | 'LowStock' | 'InStock';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  status: InventoryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryItemPayload {
  name: string;
  sku: string;
  quantity: number;
}

export type UpdateInventoryItemPayload = CreateInventoryItemPayload;

// API Response Types
export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: Record<string, string[]>;
  timestamp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: number;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  timestamp: number;
}

// Error types
export type ApiErrorType = 'validation' | 'network' | 'server' | 'unknown';

export interface AppError {
  type: ApiErrorType;
  message: string;
  code?: number;
  details?: Record<string, string[]>;
  timestamp: number;
}
