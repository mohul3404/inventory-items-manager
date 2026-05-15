using InventoryItemsManager.Api.Common;
using InventoryItemsManager.Api.DTOs;

namespace InventoryItemsManager.Api.Services;

public interface IInventoryService
{
    Task<IEnumerable<InventoryItemDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<InventoryItemDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<InventoryItemDto>> CreateAsync(CreateInventoryItemDto createDto, CancellationToken cancellationToken = default);
    Task<Result<InventoryItemDto>> UpdateAsync(Guid id, UpdateInventoryItemDto updateDto, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
