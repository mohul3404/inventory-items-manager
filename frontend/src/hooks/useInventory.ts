import { useEffect, useState } from 'react';
import { inventoryApi } from '../api/items';
import type { CreateInventoryItemPayload, InventoryItem } from '../types/inventory';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}

export function useInventory() {
  const [state, setState] = useState<InventoryState>({
    items: [],
    loading: true,
    error: null
  });

  const loadItems = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const items = await inventoryApi.getItems();
      setState({ items, loading: false, error: null });
    } catch (error) {
      setState({ items: [], loading: false, error: 'Unable to load inventory. Please try again.' });
      console.error(error);
    }
  };

  const addItem = async (payload: CreateInventoryItemPayload) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const created = await inventoryApi.createItem(payload);
      setState(prev => ({ items: [created, ...prev.items], loading: false, error: null }));
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Unable to add item. Please validate and try again.' }));
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    addItem,
    refresh: loadItems
  };
}
