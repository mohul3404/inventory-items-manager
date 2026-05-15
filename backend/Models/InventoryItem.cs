namespace InventoryItemsManager.Api.Models;

public enum StockStatus
{
    OutOfStock,
    LowStock,
    InStock
}

public sealed class InventoryItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public StockStatus Status => Quantity switch
    {
        0 => StockStatus.OutOfStock,
        < 10 => StockStatus.LowStock,
        _ => StockStatus.InStock
    };
}
