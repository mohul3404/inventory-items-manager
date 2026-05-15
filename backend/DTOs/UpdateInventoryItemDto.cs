using System.ComponentModel.DataAnnotations;

namespace InventoryItemsManager.Api.DTOs;

public sealed class UpdateInventoryItemDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string Sku { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }
}
