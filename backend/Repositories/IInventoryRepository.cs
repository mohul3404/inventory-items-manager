using InventoryItemsManager.Api.Models;

namespace InventoryItemsManager.Api.Repositories;

public interface IInventoryRepository
{
    Task<IEnumerable<InventoryItem>> GetAllAsync(CancellationToken cancellationToken = default);
    Task CreateAsync(InventoryItem item, CancellationToken cancellationToken = default);
}
