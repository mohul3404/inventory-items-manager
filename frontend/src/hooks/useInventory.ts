import { useCallback, useEffect, useState } from 'react';
import { inventoryApi, type AppError } from '../api/items';
import type { CreateInventoryItemPayload, InventoryItem, UpdateInventoryItemPayload } from '../types/inventory';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: AppError | null;
  isRefreshing: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  deletingId: string | null;
}

interface InventoryActions {
  items: InventoryItem[];
  loading: boolean;
  error: AppError | null;
  isRefreshing: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  deletingId: string | null;
  addItem: (payload: CreateInventoryItemPayload) => Promise<boolean>;
  updateItem: (id: string, payload: UpdateInventoryItemPayload) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  clearError: () => void;
  retry: () => Promise<void>;
}

/**
 * Hook for managing inventory state and API interactions
 * Provides comprehensive error handling and loading states
 */
export function useInventory(): InventoryActions {
  const [state, setState] = useState<InventoryState>({
    items: [],
    loading: true,
    error: null,
    isRefreshing: false,
    isCreating: false,
    isUpdating: false,
    deletingId: null
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const loadItems = useCallback(async (isRefresh = false) => {
    setState(prev => ({
      ...prev,
      ...(isRefresh ? { isRefreshing: true } : { loading: true }),
      error: null
    }));

    try {
      const { data } = await inventoryApi.getItems();
      setState(prev => ({
        ...prev,
        items: data,
        loading: false,
        isRefreshing: false,
        error: null
      }));
    } catch (error) {
      const appError = error as AppError;
      setState(prev => ({
        ...prev,
        items: [],
        loading: false,
        isRefreshing: false,
        error: appError
      }));

      // Don't throw - let the UI handle the error
      console.error('[useInventory] Load error:', appError);
    }
  }, []);

  const addItem = useCallback(
    async (payload: CreateInventoryItemPayload): Promise<boolean> => {
      setState(prev => ({ ...prev, isCreating: true, error: null }));

      try {
        const created = await inventoryApi.createItem(payload);
        setState(prev => ({
          ...prev,
          items: [created, ...prev.items],
          isCreating: false,
          error: null
        }));
        return true;
      } catch (error) {
        const appError = error as AppError;
        setState(prev => ({
          ...prev,
          isCreating: false,
          error: appError
        }));

        console.error('[useInventory] Add item error:', appError);
        return false;
      }
    },
    []
  );

  const updateItem = useCallback(
    async (id: string, payload: UpdateInventoryItemPayload): Promise<boolean> => {
      setState(prev => ({ ...prev, isUpdating: true, error: null }));

      try {
        const updated = await inventoryApi.updateItem(id, payload);
        setState(prev => ({
          ...prev,
          items: prev.items.map(item => (item.id === id ? updated : item)),
          isUpdating: false,
          error: null
        }));
        return true;
      } catch (error) {
        const appError = error as AppError;
        setState(prev => ({
          ...prev,
          isUpdating: false,
          error: appError
        }));

        console.error('[useInventory] Update item error:', appError);
        return false;
      }
    },
    []
  );

  const deleteItem = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, deletingId: id, error: null }));

    try {
      await inventoryApi.deleteItem(id);
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id),
        deletingId: null,
        error: null
      }));
      return true;
    } catch (error) {
      const appError = error as AppError;
      setState(prev => ({
        ...prev,
        deletingId: null,
        error: appError
      }));

      console.error('[useInventory] Delete item error:', appError);
      return false;
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadItems(true);
  }, [loadItems]);

  const retry = useCallback(async () => {
    clearError();
    await loadItems();
  }, [loadItems, clearError]);

  // Load items on mount
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    isRefreshing: state.isRefreshing,
    isCreating: state.isCreating,
    isUpdating: state.isUpdating,
    deletingId: state.deletingId,
    addItem,
    updateItem,
    deleteItem,
    refresh,
    clearError,
    retry
  };
}
