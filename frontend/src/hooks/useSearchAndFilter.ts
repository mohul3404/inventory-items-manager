import { useMemo, useState } from 'react';
import type { InventoryItem, InventoryStatus } from '../types/inventory';

interface FilterOptions {
  status?: InventoryStatus;
  minQuantity?: number;
  maxQuantity?: number;
}

interface SearchAndFilterOptions {
  searchTerm: string;
  filters: FilterOptions;
}

/**
 * Hook for searching and filtering inventory items
 * Provides debounced search and multiple filter options
 */
export function useSearchAndFilter(items: InventoryItem[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  // Memoized filtered results
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply search
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(lowerSearch) || item.sku.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(item => item.status === filters.status);
    }

    // Apply quantity filters
    if (filters.minQuantity !== undefined) {
      result = result.filter(item => item.quantity >= filters.minQuantity!);
    }

    if (filters.maxQuantity !== undefined) {
      result = result.filter(item => item.quantity <= filters.maxQuantity!);
    }

    return result;
  }, [items, searchTerm, filters]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
  };

  const isFiltered = searchTerm.trim() !== '' || Object.keys(filters).length > 0;

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredItems,
    clearFilters,
    isFiltered,
    resultCount: filteredItems.length
  };
}
