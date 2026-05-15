using InventoryItemsManager.Api.DTOs;
using InventoryItemsManager.Api.Extensions;
using InventoryItemsManager.Api.Middleware;
using InventoryItemsManager.Api.Repositories;
using InventoryItemsManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddInventoryServices();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
