import { useState } from 'react';
import { InventoryForm } from './InventoryForm';
import { InventoryList } from './InventoryList';
import { Modal } from '../../components/Modal';
import { useInventory } from '../../hooks/useInventory';

export default function InventoryPage() {
  const { items, loading, error, addItem, refresh } = useInventory();
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Inventory Manager</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Manage inventory with confidence</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Add inventory items, view stock status, and keep the list up to date with a modern frontend and a clean API contract.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add item
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Inventory list</h2>
            <p className="mt-1 text-sm text-slate-500">Live inventory information with stock indicators and fast refresh.</p>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-soft">Loading inventory…</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-10 text-center text-red-700 shadow-soft">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft">
            <p className="text-lg font-semibold text-slate-900">No inventory items yet</p>
            <p className="mt-2 text-sm">Click &ldquo;Add item&rdquo; to create the first inventory record.</p>
          </div>
        ) : (
          <InventoryList items={items} />
        )}
      </div>

      <Modal open={showModal} title="Add inventory item" onClose={() => setShowModal(false)}>
        <InventoryForm
          onSubmit={async payload => {
            const success = await addItem(payload);
            if (success) {
              setShowModal(false);
            }
            return success;
          }}
        />
      </Modal>
    </section>
  );
}
