import type { InventoryStatus } from '../types/inventory';

const statusStyles: Record<InventoryStatus, string> = {
  OutOfStock: 'bg-red-100 text-red-800',
  LowStock: 'bg-orange-100 text-orange-800',
  InStock: 'bg-emerald-100 text-emerald-800'
};

interface StatusBadgeProps {
  status: InventoryStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[status]}`}>
      {status.replace(/([A-Z])/g, ' $1').trim()}
    </span>
  );
}
