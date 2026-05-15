using System.Net;
using System.Text.Json;

namespace InventoryItemsManager.Api.Middleware;

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
        catch (ArgumentException exception)
        {
            _logger.LogWarning(exception, "Validation failure.");
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await WriteProblemAsync(context, exception.Message);
        }
        catch (ArgumentOutOfRangeException exception)
        {
            _logger.LogWarning(exception, "Invalid range.");
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await WriteProblemAsync(context, exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled exception.");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            await WriteProblemAsync(context, "An unexpected error occurred.");
        }
    }

    private static Task WriteProblemAsync(HttpContext context, string detail)
    {
        context.Response.ContentType = "application/problem+json";
        var payload = JsonSerializer.Serialize(new
        {
            title = "Request failed",
            status = context.Response.StatusCode,
            detail
        });

        return context.Response.WriteAsync(payload);
    }
}
