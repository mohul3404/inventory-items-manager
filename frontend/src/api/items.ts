import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  ApiErrorResponse,
  ApiErrorType,
  ApiListResponse,
  ApiResponse,
  AppError,
  CreateInventoryItemPayload,
  InventoryItem,
  UpdateInventoryItemPayload
} from '../types/inventory';

/**
 * Parse axios errors into app-level error types
 */
function parseError(error: unknown): AppError {
  const now = Date.now();

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Server-side validation errors
    if (axiosError.response?.status === 400) {
      const data = axiosError.response.data;
      return {
        type: 'validation',
        message: data?.detail || 'Validation error. Please check your input.',
        code: 400,
        details: data?.errors,
        timestamp: now
      };
    }

    if (axiosError.response?.status === 409) {
      return {
        type: 'validation',
        message: axiosError.response.data?.detail || 'This item conflicts with existing inventory data.',
        code: 409,
        timestamp: now
      };
    }

    // Network error
    if (!axiosError.response) {
      return {
        type: 'network',
        message: 'Unable to reach the API. Make sure the backend is running and the API URL is configured correctly.',
        timestamp: now
      };
    }

    // Server error
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return {
        type: 'server',
        message: axiosError.response.data?.detail || 'Server error. Please try again later.',
        code: axiosError.response.status,
        timestamp: now
      };
    }

    // Other HTTP errors
    return {
      type: 'server',
      message: axiosError.response?.data?.detail || axiosError.message || 'An error occurred',
      code: axiosError.response?.status,
      timestamp: now
    };
  }

  // Non-axios errors
  return {
    type: 'unknown',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    timestamp: now
  };
}

/**
 * Create and configure the API client with interceptors and error handling
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout
  });

  // Response interceptor for success logging and data transformation
  client.interceptors.response.use(
    response => {
      // Log successful requests in development
      if (import.meta.env.DEV) {
        console.debug(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
      }
      return response;
    },
    error => {
      // Log errors in development
      if (import.meta.env.DEV) {
        console.error('[API Error]', error);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

const baseClient = createApiClient();

/**
 * Inventory API client with typed responses and error handling
 */
export const inventoryApi = {
  /**
   * Fetch all inventory items
   */
  getItems: async (): Promise<{ data: InventoryItem[]; total: number }> => {
    try {
      const response = await baseClient.get<ApiListResponse<InventoryItem>>('/items');
      return {
        data: response.data.data || [],
        total: response.data.total || 0
      };
    } catch (error) {
      throw parseError(error);
    }
  },

  /**
   * Fetch a single inventory item by ID
   */
  getItemById: async (id: string): Promise<InventoryItem> => {
    try {
      const response = await baseClient.get<ApiResponse<InventoryItem>>(`/items/${id}`);

      if (!response.data.data) {
        throw new Error('No data returned from server');
      }

      return response.data.data;
    } catch (error) {
      throw parseError(error);
    }
  },

  /**
   * Create a new inventory item
   */
  createItem: async (payload: CreateInventoryItemPayload): Promise<InventoryItem> => {
    try {
      const response = await baseClient.post<ApiResponse<InventoryItem>>('/items', payload);

      if (!response.data.data) {
        throw new Error('No data returned from server');
      }

      return response.data.data;
    } catch (error) {
      throw parseError(error);
    }
  },

  /**
   * Update an existing inventory item
   */
  updateItem: async (id: string, payload: UpdateInventoryItemPayload): Promise<InventoryItem> => {
    try {
      const response = await baseClient.put<ApiResponse<InventoryItem>>(`/items/${id}`, payload);

      if (!response.data.data) {
        throw new Error('No data returned from server');
      }

      return response.data.data;
    } catch (error) {
      throw parseError(error);
    }
  },

  /**
   * Delete an inventory item
   */
  deleteItem: async (id: string): Promise<void> => {
    try {
      await baseClient.delete(`/items/${id}`);
    } catch (error) {
      throw parseError(error);
    }
  }
};

export type { AppError, ApiErrorType };
