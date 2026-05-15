import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/ToastContainer';
import { useInventory } from '../../hooks/useInventory';
import { useSearchAndFilter } from '../../hooks/useSearchAndFilter';
import type { CreateInventoryItemPayload, InventoryItem, InventoryStatus } from '../../types/inventory';
import { InventoryForm } from './InventoryForm';
import { InventoryList } from './InventoryList';

const statusOptions: Array<{ label: string; value: InventoryStatus }> = [
  { label: 'In stock', value: 'InStock' },
  { label: 'Low stock', value: 'LowStock' },
  { label: 'Out of stock', value: 'OutOfStock' }
];

export default function InventoryPage() {
  const {
    items,
    loading,
    error,
    isRefreshing,
    isCreating,
    isUpdating,
    deletingId,
    addItem,
    updateItem,
    deleteItem,
    refresh,
    retry
  } = useInventory();
  const { showSuccess, showError } = useToast();
  const { searchTerm, setSearchTerm, filters, setFilters, filteredItems, clearFilters, isFiltered, resultCount } =
    useSearchAndFilter(items);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleAddItem = async (payload: CreateInventoryItemPayload) => {
    const success = await addItem(payload);
    if (success) {
      showSuccess('Item created successfully.');
      setIsAddModalOpen(false);
    } else {
      showError('Could not create the item. Please review the form and try again.');
    }
    return success;
  };

  const handleUpdateItem = async (payload: CreateInventoryItemPayload) => {
    if (!editingItem) return false;

    const success = await updateItem(editingItem.id, payload);
    if (success) {
      showSuccess('Item updated successfully.');
      setEditingItem(null);
    } else {
      showError('Could not update the item. Please try again.');
    }
    return success;
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    const confirmed = window.confirm(`Delete "${item.name}" from inventory?`);
    if (!confirmed) return;

    const success = await deleteItem(item.id);
    if (success) {
      showSuccess('Item deleted successfully.');
    } else {
      showError('Could not delete the item. Please try again.');
    }
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Inventory Manager</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Manage inventory with confidence</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Track items, SKUs, quantities, and stock health through a clean React interface backed by a typed ASP.NET Core API.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new inventory item"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Inventory Items</h2>
              <p className="mt-1 text-sm text-slate-600">
                {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} in inventory` : 'No items yet'}
                {isFiltered ? `, ${resultCount} shown` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              disabled={isRefreshing}
              aria-label="Refresh inventory list"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {items.length > 0 && (
            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_auto]">
              <label className="block">
                <span className="sr-only">Search inventory</span>
                <input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder="Search by item name or SKU"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />
              </label>
              <label className="block">
                <span className="sr-only">Filter by stock status</span>
                <select
                  value={filters.status ?? ''}
                  onChange={event =>
                    setFilters(prev => ({
                      ...prev,
                      status: event.target.value ? (event.target.value as InventoryStatus) : undefined
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">All stock statuses</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={clearFilters}
                disabled={!isFiltered}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-12 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3">
              <svg className="h-8 w-8 animate-spin text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-sm text-slate-600">Loading inventory...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
            <h3 className="font-semibold text-red-900">Failed to load inventory</h3>
            <p className="mt-1 text-sm text-red-800">{error.message}</p>
            {error.type === 'network' && (
              <p className="mt-2 text-xs text-red-700">
                Start the backend API and confirm `VITE_API_URL` points to its `/api/v1` base URL.
              </p>
            )}
            <button
              type="button"
              onClick={retry}
              className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No inventory items yet</h3>
            <p className="mt-2 text-sm text-slate-600">Add the first item to start tracking stock status.</p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add First Item
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">No matching items</h3>
            <p className="mt-2 text-sm text-slate-600">Adjust the search or clear filters to see all inventory items.</p>
          </div>
        )}

        {!loading && !error && filteredItems.length > 0 && (
          <InventoryList items={filteredItems} onEdit={setEditingItem} onDelete={handleDeleteItem} deletingId={deletingId} />
        )}
      </div>

      <Modal open={isAddModalOpen} title="Add New Inventory Item" onClose={() => setIsAddModalOpen(false)}>
        <InventoryForm onSubmit={handleAddItem} isCreating={isCreating} submitLabel="Create Item" />
      </Modal>

      <Modal open={!!editingItem} title="Edit Inventory Item" onClose={() => setEditingItem(null)}>
        <InventoryForm
          onSubmit={handleUpdateItem}
          isCreating={isUpdating}
          initialValues={editingItem ?? undefined}
          submitLabel="Update Item"
        />
      </Modal>
    </section>
  );
}
