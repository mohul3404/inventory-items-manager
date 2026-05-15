using InventoryItemsManager.Api.DTOs;
using InventoryItemsManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryItemsManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ItemsController : ControllerBase
{
    private readonly IInventoryService _inventoryService;

    public ItemsController(IInventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryItemDto>>> GetAll(CancellationToken cancellationToken)
    {
        var items = await _inventoryService.GetAllAsync(cancellationToken);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<InventoryItemDto>> Create([FromBody] CreateInventoryItemDto createDto, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var result = await _inventoryService.CreateAsync(createDto, cancellationToken);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }
}
