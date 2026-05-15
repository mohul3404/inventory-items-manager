using InventoryItemsManager.Api.DTOs;
using InventoryItemsManager.Api.Models;
using InventoryItemsManager.Api.Repositories;

namespace InventoryItemsManager.Api.Services;

public sealed class InventoryService : IInventoryService
{
    private readonly IInventoryRepository _repository;

    public InventoryService(IInventoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<InventoryItemDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var items = await _repository.GetAllAsync(cancellationToken);
        return items.Select(MapToDto);
    }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto createDto, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(createDto.Name))
        {
            throw new ArgumentException("Name is required.", nameof(createDto.Name));
        }

        if (string.IsNullOrWhiteSpace(createDto.Sku))
        {
            throw new ArgumentException("SKU is required.", nameof(createDto.Sku));
        }

        if (createDto.Quantity < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(createDto.Quantity), "Quantity must be zero or greater.");
        }

        var item = new InventoryItem
        {
            Name = createDto.Name.Trim(),
            Sku = createDto.Sku.Trim(),
            Quantity = createDto.Quantity
        };

        await _repository.CreateAsync(item, cancellationToken);
        return MapToDto(item);
    }

    private static InventoryItemDto MapToDto(InventoryItem item)
    {
        return new InventoryItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Sku = item.Sku,
            Quantity = item.Quantity,
            Status = item.Status.ToString()
        };
    }
}
