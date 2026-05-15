import { StatusBadge } from '../../components/StatusBadge';
import type { InventoryItem } from '../../types/inventory';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  deletingId?: string | null;
}

/**
 * Inventory list component displaying all items in a table format
 * Includes responsive design and accessibility features
 */
export function InventoryList({ items, onEdit, onDelete, deletingId }: InventoryListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Desktop Table View */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Item Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map(item => (
              <tr key={item.id} className="transition hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-slate-900">{item.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="rounded bg-slate-100 px-2 py-1 font-mono text-sm text-slate-700">{item.sku}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-900">{item.quantity}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      disabled={deletingId === item.id}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-4 p-4 md:hidden">
        {items.map(item => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{item.name}</h3>
              <StatusBadge status={item.status} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">SKU:</span>
                <code className="font-mono text-slate-900">{item.sku}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Quantity:</span>
                <span className="font-medium text-slate-900">{item.quantity}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                disabled={deletingId === item.id}
                className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === item.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
