import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../components/ToastContainer';
import type { AppError, CreateInventoryItemPayload } from '../../types/inventory';

interface InventoryFormProps {
  onSubmit: (payload: CreateInventoryItemPayload) => Promise<boolean>;
  isCreating?: boolean;
  initialValues?: CreateInventoryItemPayload;
  submitLabel?: string;
}

/**
 * Form for creating new inventory items
 * Includes validation, error handling, and user feedback
 */
export function InventoryForm({
  onSubmit,
  isCreating = false,
  initialValues,
  submitLabel = 'Save Item'
}: InventoryFormProps) {
  const { showError } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm<CreateInventoryItemPayload>({
    mode: 'onBlur',
    defaultValues: {
      name: initialValues?.name ?? '',
      sku: initialValues?.sku ?? '',
      quantity: initialValues?.quantity ?? 0
    }
  });

  useEffect(() => {
    reset({
      name: initialValues?.name ?? '',
      sku: initialValues?.sku ?? '',
      quantity: initialValues?.quantity ?? 0
    });
  }, [initialValues, reset]);

  const handleFormSubmit = async (payload: CreateInventoryItemPayload) => {
    try {
      const success = await onSubmit(payload);
      if (success) {
        reset();
      } else {
        showError('Failed to create item. Please try again.');
      }
      return success;
    } catch (error) {
      const appError = error as AppError;

      // Handle field-level validation errors
      if (appError.type === 'validation' && appError.details) {
        Object.entries(appError.details).forEach(([field, messages]) => {
          setError(field as keyof CreateInventoryItemPayload, {
            message: messages[0] || 'Invalid field'
          });
        });
      } else {
        showError(appError.message || 'An error occurred while creating the item');
      }

      return false;
    }
  };

  const isLoading = isSubmitting || isCreating;

  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Item Name
          <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          {...register('name', {
            required: 'Item name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
            maxLength: { value: 100, message: 'Name must not exceed 100 characters' }
          })}
          id="name"
          type="text"
          placeholder="e.g., Office Chair"
          disabled={isLoading}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* SKU Field */}
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-slate-700">
          SKU
          <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          {...register('sku', {
            required: 'SKU is required',
            minLength: { value: 2, message: 'SKU must be at least 2 characters' },
            maxLength: { value: 50, message: 'SKU must not exceed 50 characters' }
          })}
          id="sku"
          type="text"
          placeholder="e.g., CHAIR-101"
          disabled={isLoading}
          aria-invalid={!!errors.sku}
          aria-describedby={errors.sku ? 'sku-error' : undefined}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        />
        {errors.sku && (
          <p id="sku-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.sku.message}
          </p>
        )}
      </div>

      {/* Quantity Field */}
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">
          Quantity
          <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          {...register('quantity', {
            required: 'Quantity is required',
            min: { value: 0, message: 'Quantity must be zero or greater' },
            valueAsNumber: true
          })}
          id="quantity"
          type="number"
          placeholder="0"
          disabled={isLoading}
          aria-invalid={!!errors.quantity}
          aria-describedby={errors.quantity ? 'quantity-error' : undefined}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        />
        {errors.quantity && (
          <p id="quantity-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.quantity.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Saving...</span>
          </>
        ) : (
          <span>{submitLabel}</span>
        )}
      </button>
    </form>
  );
}
