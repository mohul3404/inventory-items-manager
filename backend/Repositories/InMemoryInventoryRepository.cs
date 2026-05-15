using InventoryItemsManager.Api.Models;

namespace InventoryItemsManager.Api.Repositories;

public sealed class InMemoryInventoryRepository : IInventoryRepository
{
    private readonly List<InventoryItem> _items = new()
    {
        new InventoryItem { Name = "Office Chair", Sku = "CHAIR-101", Quantity = 2 },
        new InventoryItem { Name = "Packing Tape", Sku = "TAPE-022", Quantity = 0 },
        new InventoryItem { Name = "Wireless Mouse", Sku = "MOUSE-500", Quantity = 12 }
    };

    public Task<IEnumerable<InventoryItem>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult<IEnumerable<InventoryItem>>(_items.OrderBy(item => item.Name).ToList());
    }

    public Task CreateAsync(InventoryItem item, CancellationToken cancellationToken = default)
    {
        _items.Add(item);
        return Task.CompletedTask;
    }
}
