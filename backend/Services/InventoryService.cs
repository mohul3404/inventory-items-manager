using InventoryItemsManager.Api.Common;
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

    public async Task<Result<InventoryItemDto>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
        {
            return new Result<InventoryItemDto>.ValidationFailure(
                new Dictionary<string, string[]> { { "id", new[] { "Item ID is required." } } });
        }

        try
        {
            var item = await _repository.GetByIdAsync(id, cancellationToken);
            if (item == null)
            {
                return new Result<InventoryItemDto>.NotFoundFailure($"Item with ID '{id}' not found.");
            }

            return new Result<InventoryItemDto>.Success(MapToDto(item));
        }
        catch (Exception ex)
        {
            return new Result<InventoryItemDto>.UnexpectedFailure($"Failed to retrieve item: {ex.Message}");
        }
    }

    public async Task<Result<InventoryItemDto>> CreateAsync(CreateInventoryItemDto createDto, CancellationToken cancellationToken = default)
    {
        // Validate input
        var validationErrors = ValidateCreateDto(createDto);
        if (validationErrors.Count > 0)
        {
            return new Result<InventoryItemDto>.ValidationFailure(validationErrors);
        }

        try
        {
            var existingSku = await _repository.GetBySkuAsync(createDto.Sku.Trim(), cancellationToken);
            if (existingSku != null)
            {
                return new Result<InventoryItemDto>.ConflictFailure($"An item with SKU '{createDto.Sku.Trim()}' already exists.");
            }

            var item = new InventoryItem
            {
                Name = createDto.Name.Trim(),
                Sku = createDto.Sku.Trim(),
                Quantity = createDto.Quantity
            };

            await _repository.CreateAsync(item, cancellationToken);
            return new Result<InventoryItemDto>.Success(MapToDto(item));
        }
        catch (Exception ex)
        {
            return new Result<InventoryItemDto>.UnexpectedFailure($"Failed to create inventory item: {ex.Message}");
        }
    }

    public async Task<Result<InventoryItemDto>> UpdateAsync(Guid id, UpdateInventoryItemDto updateDto, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
        {
            return new Result<InventoryItemDto>.ValidationFailure(
                new Dictionary<string, string[]> { { "id", new[] { "Item ID is required." } } });
        }

        // Validate input
        var validationErrors = ValidateUpdateDto(updateDto);
        if (validationErrors.Count > 0)
        {
            return new Result<InventoryItemDto>.ValidationFailure(validationErrors);
        }

        try
        {
            var item = await _repository.GetByIdAsync(id, cancellationToken);
            if (item == null)
            {
                return new Result<InventoryItemDto>.NotFoundFailure($"Item with ID '{id}' not found.");
            }

            var existingSku = await _repository.GetBySkuAsync(updateDto.Sku.Trim(), cancellationToken);
            if (existingSku != null && existingSku.Id != id)
            {
                return new Result<InventoryItemDto>.ConflictFailure($"An item with SKU '{updateDto.Sku.Trim()}' already exists.");
            }

            item.Name = updateDto.Name.Trim();
            item.Sku = updateDto.Sku.Trim();
            item.Quantity = updateDto.Quantity;

            await _repository.UpdateAsync(item, cancellationToken);
            return new Result<InventoryItemDto>.Success(MapToDto(item));
        }
        catch (Exception ex)
        {
            return new Result<InventoryItemDto>.UnexpectedFailure($"Failed to update inventory item: {ex.Message}");
        }
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (id == Guid.Empty)
        {
            return new Result.ValidationFailure(
                new Dictionary<string, string[]> { { "id", new[] { "Item ID is required." } } });
        }

        try
        {
            var deleted = await _repository.DeleteAsync(id, cancellationToken);
            if (!deleted)
            {
                return new Result.NotFoundFailure($"Item with ID '{id}' not found.");
            }

            return new Result.Success();
        }
        catch (Exception ex)
        {
            return new Result.UnexpectedFailure($"Failed to delete inventory item: {ex.Message}");
        }
    }

    private static Dictionary<string, string[]> ValidateCreateDto(CreateInventoryItemDto dto)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            errors["name"] = new[] { "Item name is required." };
        }
        else if (dto.Name.Length < 2 || dto.Name.Length > 100)
        {
            errors["name"] = new[] { "Item name must be between 2 and 100 characters." };
        }

        if (string.IsNullOrWhiteSpace(dto.Sku))
        {
            errors["sku"] = new[] { "SKU is required." };
        }
        else if (dto.Sku.Length < 2 || dto.Sku.Length > 50)
        {
            errors["sku"] = new[] { "SKU must be between 2 and 50 characters." };
        }

        if (dto.Quantity < 0)
        {
            errors["quantity"] = new[] { "Quantity must be zero or greater." };
        }

        return errors;
    }

    private static Dictionary<string, string[]> ValidateUpdateDto(UpdateInventoryItemDto dto)
    {
        return ValidateCreateDto(new CreateInventoryItemDto { Name = dto.Name, Sku = dto.Sku, Quantity = dto.Quantity });
    }

    private static InventoryItemDto MapToDto(InventoryItem item)
    {
        return new InventoryItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Sku = item.Sku,
            Quantity = item.Quantity,
            Status = item.Status.ToString(),
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }
}
