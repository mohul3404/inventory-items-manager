import { useForm } from 'react-hook-form';
import type { CreateInventoryItemPayload } from '../../types/inventory';

interface InventoryFormProps {
  onSubmit: (payload: CreateInventoryItemPayload) => Promise<boolean>;
}

export function InventoryForm({ onSubmit }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateInventoryItemPayload>({
    defaultValues: {
      name: '',
      sku: '',
      quantity: 0
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          {...register('name', { required: 'Item name is required', minLength: { value: 2, message: 'Name must contain at least 2 characters' } })}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
          placeholder="Example: Office Chair"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">SKU</label>
        <input
          {...register('sku', { required: 'SKU is required', minLength: { value: 2, message: 'SKU must contain at least 2 characters' } })}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
          placeholder="Example: CHAIR-101"
        />
        {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Quantity</label>
        <input
          type="number"
          {...register('quantity', { required: 'Quantity is required', min: { value: 0, message: 'Quantity must be zero or greater' } })}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
          placeholder="0"
        />
        {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? 'Saving...' : 'Save item'}
      </button>
    </form>
  );
}
