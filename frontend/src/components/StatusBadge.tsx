import type { InventoryStatus } from '../types/inventory';

const statusConfig: Record<InventoryStatus, { styles: string; label: string }> = {
  OutOfStock: {
    styles: 'bg-red-100 text-red-800 border border-red-300',
    label: 'Out of Stock'
  },
  LowStock: {
    styles: 'bg-amber-100 text-amber-800 border border-amber-300',
    label: 'Low Stock'
  },
  InStock: {
    styles: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    label: 'In Stock'
  }
};

interface StatusBadgeProps {
  status: InventoryStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${config.styles}`}
      title={`Status: ${config.label}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
