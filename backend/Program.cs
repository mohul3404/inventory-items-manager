using System.Text.Json.Serialization;
using InventoryItemsManager.Api.Extensions;
using InventoryItemsManager.Api.Middleware;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Inventory Items Manager API",
        Version = "v1",
        Description = "A clean, production-ready API for managing inventory items."
    });
});

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .GetChildren()
    .Select(section => section.Value)
    .Where(value => !string.IsNullOrWhiteSpace(value))
    .Select(value => value!)
    .ToArray();

allowedOrigins = allowedOrigins.Length > 0
    ? allowedOrigins
    : builder.Configuration["CORS_ALLOWED_ORIGINS"]?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? builder.Configuration["FRONTEND_URL"]?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

if (builder.Environment.IsDevelopment() && allowedOrigins.Length == 0)
{
    allowedOrigins =
    [
        "http://localhost:4173",
        "https://localhost:4173",
        "http://localhost:4174",
        "https://localhost:4174",
        "http://localhost:5173",
        "https://localhost:5173"
    ];
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins);
        }
        else
        {
            policy.SetIsOriginAllowed(_ => false);
        }

        policy
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddInventoryServices();

// Add request logging
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

// Use middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Use CORS
app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Inventory API v1");
});

if (!app.Environment.IsProduction() && !string.IsNullOrWhiteSpace(builder.Configuration["HTTPS_PORT"]))
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        success = true,
        message = "Inventory Items Manager API is running successfully",
        documentation = "/swagger"
    });
});

app.Run();
