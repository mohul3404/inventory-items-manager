import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastContainer';
import InventoryPage from './features/inventory/InventoryPage';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <InventoryPage />
          </main>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
