import type { InventoryStatus } from '../types/inventory';

export function getStockLabel(status: InventoryStatus) {
  switch (status) {
    case 'OutOfStock':
      return 'Out of Stock';
    case 'LowStock':
      return 'Low Stock';
    case 'InStock':
      return 'In Stock';
  }
}
