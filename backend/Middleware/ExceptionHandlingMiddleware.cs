using System.Net;
using System.Text.Json;
using InventoryItemsManager.Api.Common;

namespace InventoryItemsManager.Api.Middleware;

/// <summary>
/// Global exception handling middleware.
/// Catches unhandled exceptions and returns structured error responses.
/// </summary>
public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Request was cancelled.");
            context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
            await WriteErrorResponseAsync(context, "Request Timeout", "The request was cancelled or timed out.");
        }
        catch (ArgumentOutOfRangeException ex)
        {
            _logger.LogWarning("Range validation error: {Message}", ex.Message);
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await WriteErrorResponseAsync(context, "Validation Error", ex.Message);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Validation error: {Message}", ex.Message);
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await WriteErrorResponseAsync(context, "Validation Error", ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning("Invalid operation: {Message}", ex.Message);
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await WriteErrorResponseAsync(context, "Invalid Operation", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred.");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await WriteErrorResponseAsync(context, "Internal Server Error", "An unexpected error occurred. Please try again later.");
        }
    }

    private static Task WriteErrorResponseAsync(HttpContext context, string title, string detail)
    {
        context.Response.ContentType = "application/problem+json";

        var errorResponse = new ApiErrorResponse
        {
            Type = "https://httpwg.org/specs/rfc7807.html#section-3",
            Title = title,
            Status = context.Response.StatusCode,
            Detail = detail,
            Instance = context.Request.Path
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(errorResponse, options);

        return context.Response.WriteAsync(json);
    }
}
