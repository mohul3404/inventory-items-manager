using InventoryItemsManager.Api.Models;

namespace InventoryItemsManager.Api.Repositories;

public sealed class InMemoryInventoryRepository : IInventoryRepository
{
    private readonly object _syncRoot = new();
    private readonly List<InventoryItem> _items = new()
    {
        new InventoryItem { Name = "Office Chair", Sku = "CHAIR-101", Quantity = 2 },
        new InventoryItem { Name = "Packing Tape", Sku = "TAPE-022", Quantity = 0 },
        new InventoryItem { Name = "Wireless Mouse", Sku = "MOUSE-500", Quantity = 12 }
    };

    public Task<IEnumerable<InventoryItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            return Task.FromResult<IEnumerable<InventoryItem>>(_items.OrderByDescending(item => item.UpdatedAt).ToList());
        }
    }

    public Task<InventoryItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            var item = _items.FirstOrDefault(i => i.Id == id);
            return Task.FromResult(item);
        }
    }

    public Task<InventoryItem?> GetBySkuAsync(string sku, CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            var item = _items.FirstOrDefault(i => string.Equals(i.Sku, sku, StringComparison.OrdinalIgnoreCase));
            return Task.FromResult(item);
        }
    }

    public Task CreateAsync(InventoryItem item, CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            _items.Add(item);
        }

        return Task.CompletedTask;
    }

    public Task UpdateAsync(InventoryItem item, CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            var existingItem = _items.FirstOrDefault(i => i.Id == item.Id);
            if (existingItem != null)
            {
                existingItem.Name = item.Name;
                existingItem.Sku = item.Sku;
                existingItem.Quantity = item.Quantity;
                existingItem.UpdatedAt = DateTime.UtcNow;
            }
        }

        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (_syncRoot)
        {
            var item = _items.FirstOrDefault(i => i.Id == id);
            if (item != null)
            {
                _items.Remove(item);
                return Task.FromResult(true);
            }
        }

        return Task.FromResult(false);
    }
}
