import { StatusBadge } from '../../components/StatusBadge';
import type { InventoryItem } from '../../types/inventory';

interface InventoryListProps {
  items: InventoryItem[];
}

export function InventoryList({ items }: InventoryListProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="grid grid-cols-12 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-600">
        <span className="col-span-4">Name</span>
        <span className="col-span-3">SKU</span>
        <span className="col-span-2">Quantity</span>
        <span className="col-span-3">Status</span>
      </div>
      {items.map(item => (
        <div key={item.id} className="grid grid-cols-12 gap-4 border-b border-slate-200 px-6 py-5 last:border-b-0">
          <div className="col-span-4 flex flex-col gap-1">
            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
          </div>
          <div className="col-span-3 text-sm text-slate-600">{item.sku}</div>
          <div className="col-span-2 text-sm text-slate-600">{item.quantity}</div>
          <div className="col-span-3">
            <StatusBadge status={item.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
