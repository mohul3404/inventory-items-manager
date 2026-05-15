using InventoryItemsManager.Api.Repositories;
using InventoryItemsManager.Api.Services;

namespace InventoryItemsManager.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInventoryServices(this IServiceCollection services)
    {
        services.AddSingleton<IInventoryRepository, InMemoryInventoryRepository>();
        services.AddScoped<IInventoryService, InventoryService>();
        return services;
    }
}
