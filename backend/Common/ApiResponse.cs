namespace InventoryItemsManager.Api.Common;

/// <summary>
/// RFC 7807 Problem Details response for errors.
/// Provides structured, machine-readable error information.
/// </summary>
public record ApiErrorResponse
{
    public string Type { get; init; } = "about:blank";
    public string Title { get; init; } = "Error";
    public int Status { get; init; }
    public string Detail { get; init; } = string.Empty;
    public string Instance { get; init; } = string.Empty;
    public Dictionary<string, string[]>? Errors { get; init; }
    public long Timestamp { get; init; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
}

/// <summary>
/// Standard API response wrapper for successful operations.
/// </summary>
public record ApiResponse<T>
{
    public bool Success { get; init; } = true;
    public T? Data { get; init; }
    public string? Message { get; init; }
    public long Timestamp { get; init; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
}

/// <summary>
/// API response for list operations with pagination support.
/// </summary>
public record ApiListResponse<T>
{
    public bool Success { get; init; } = true;
    public IEnumerable<T> Data { get; init; } = [];
    public int Total { get; init; }
    public long Timestamp { get; init; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
}
