using InventoryItemsManager.Api.DTOs;

namespace InventoryItemsManager.Api.Services;

public interface IInventoryService
{
    Task<IEnumerable<InventoryItemDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto createDto, CancellationToken cancellationToken = default);
}
