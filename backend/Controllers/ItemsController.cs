using InventoryItemsManager.Api.Common;
using InventoryItemsManager.Api.DTOs;
using InventoryItemsManager.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryItemsManager.Api.Controllers;

/// <summary>
/// Inventory items API controller.
/// Manages CRUD operations for inventory items.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
public sealed class ItemsController : ControllerBase
{
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<ItemsController> _logger;

    public ItemsController(IInventoryService inventoryService, ILogger<ItemsController> logger)
    {
        _inventoryService = inventoryService;
        _logger = logger;
    }

    /// <summary>
    /// Get all inventory items.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of all inventory items</returns>
    /// <response code="200">Returns the list of inventory items</response>
    [HttpGet]
    [ProducesResponseType(typeof(ApiListResponse<InventoryItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiListResponse<InventoryItemDto>>> GetAll(CancellationToken cancellationToken)
    {
        try
        {
            var items = await _inventoryService.GetAllAsync(cancellationToken);
            var itemsList = items.ToList();

            var response = new ApiListResponse<InventoryItemDto>
            {
                Data = itemsList,
                Total = itemsList.Count
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving inventory items");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred while retrieving inventory items.",
                Instance = HttpContext.Request.Path
            });
        }
    }

    /// <summary>
    /// Get a specific inventory item by ID.
    /// </summary>
    /// <param name="id">Item ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The requested inventory item</returns>
    /// <response code="200">Returns the inventory item</response>
    /// <response code="404">Item not found</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<InventoryItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<InventoryItemDto>>> GetById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _inventoryService.GetByIdAsync(id, cancellationToken);

            return result.Match(
                onSuccess: item => Ok(new ApiResponse<InventoryItemDto> { Data = item }),
                onNotFoundFailure: message => NotFound(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Not Found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = message,
                    Instance = HttpContext.Request.Path
                }),
                onValidationFailure: errors => BadRequest(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Validation Failed",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "One or more validation errors occurred.",
                    Instance = HttpContext.Request.Path,
                    Errors = errors
                }),
                onConflictFailure: message => Conflict(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Conflict",
                    Status = StatusCodes.Status409Conflict,
                    Detail = message,
                    Instance = HttpContext.Request.Path
                }),
                onUnexpectedFailure: message =>
                {
                    _logger.LogError("Unexpected error retrieving item {ItemId}: {Message}", id, message);
                    return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Internal Server Error",
                        Status = StatusCodes.Status500InternalServerError,
                        Detail = "An unexpected error occurred.",
                        Instance = HttpContext.Request.Path
                    });
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while retrieving item {ItemId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred.",
                Instance = HttpContext.Request.Path
            });
        }
    }

    /// <summary>
    /// Create a new inventory item.
    /// </summary>
    /// <param name="createDto">Item creation data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The created inventory item</returns>
    /// <response code="201">Item created successfully</response>
    /// <response code="400">Validation error or bad request</response>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<InventoryItemDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<InventoryItemDto>>> Create(
        [FromBody] CreateInventoryItemDto createDto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToArray();

            return BadRequest(new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Validation Failed",
                Status = StatusCodes.Status400BadRequest,
                Detail = "One or more validation errors occurred.",
                Instance = HttpContext.Request.Path
            });
        }

        try
        {
            var result = await _inventoryService.CreateAsync(createDto, cancellationToken);

            return result.Match(
                onSuccess: item => CreatedAtAction(
                    nameof(GetById),
                    new { id = item.Id },
                    new ApiResponse<InventoryItemDto> { Data = item, Message = "Item created successfully" }),
                onValidationFailure: errors => BadRequest(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Validation Failed",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "One or more validation errors occurred.",
                    Instance = HttpContext.Request.Path,
                    Errors = errors
                }),
                onConflictFailure: message => Conflict(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Conflict",
                    Status = StatusCodes.Status409Conflict,
                    Detail = message,
                    Instance = HttpContext.Request.Path
                }),
                onNotFoundFailure: message => NotFound(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Not Found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = message,
                    Instance = HttpContext.Request.Path
                }),
                onUnexpectedFailure: message =>
                {
                    _logger.LogError("Unexpected error creating inventory item: {Message}", message);
                    return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Internal Server Error",
                        Status = StatusCodes.Status500InternalServerError,
                        Detail = "An unexpected error occurred while creating the inventory item.",
                        Instance = HttpContext.Request.Path
                    });
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred while creating an inventory item");
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred.",
                Instance = HttpContext.Request.Path
            });
        }
    }

    /// <summary>
    /// Update an existing inventory item.
    /// </summary>
    /// <param name="id">Item ID</param>
    /// <param name="updateDto">Item update data</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>The updated inventory item</returns>
    /// <response code="200">Item updated successfully</response>
    /// <response code="400">Validation error</response>
    /// <response code="404">Item not found</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<InventoryItemDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<InventoryItemDto>>> Update(
        [FromRoute] Guid id,
        [FromBody] UpdateInventoryItemDto updateDto,
        CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Validation Failed",
                Status = StatusCodes.Status400BadRequest,
                Detail = "One or more validation errors occurred.",
                Instance = HttpContext.Request.Path
            });
        }

        try
        {
            var result = await _inventoryService.UpdateAsync(id, updateDto, cancellationToken);

            return result.Match(
                onSuccess: item => Ok(new ApiResponse<InventoryItemDto> { Data = item, Message = "Item updated successfully" }),
                onValidationFailure: errors => BadRequest(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Validation Failed",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "One or more validation errors occurred.",
                    Instance = HttpContext.Request.Path,
                    Errors = errors
                }),
                onNotFoundFailure: message => NotFound(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Not Found",
                    Status = StatusCodes.Status404NotFound,
                    Detail = message,
                    Instance = HttpContext.Request.Path
                }),
                onConflictFailure: message => Conflict(new ApiErrorResponse
                {
                    Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                    Title = "Conflict",
                    Status = StatusCodes.Status409Conflict,
                    Detail = message,
                    Instance = HttpContext.Request.Path
                }),
                onUnexpectedFailure: message =>
                {
                    _logger.LogError("Unexpected error updating item {ItemId}: {Message}", id, message);
                    return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Internal Server Error",
                        Status = StatusCodes.Status500InternalServerError,
                        Detail = "An unexpected error occurred.",
                        Instance = HttpContext.Request.Path
                    });
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating item {ItemId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred.",
                Instance = HttpContext.Request.Path
            });
        }
    }

    /// <summary>
    /// Delete an inventory item.
    /// </summary>
    /// <param name="id">Item ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>No content on success</returns>
    /// <response code="204">Item deleted successfully</response>
    /// <response code="404">Item not found</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await _inventoryService.DeleteAsync(id, cancellationToken);

            switch (result)
            {
                case Result.Success:
                    return NoContent();

                case Result.NotFoundFailure notFound:
                    return NotFound(new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Not Found",
                        Status = StatusCodes.Status404NotFound,
                        Detail = notFound.Message,
                        Instance = HttpContext.Request.Path
                    });

                case Result.ValidationFailure validation:
                    return BadRequest(new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Validation Failed",
                        Status = StatusCodes.Status400BadRequest,
                        Detail = "One or more validation errors occurred.",
                        Instance = HttpContext.Request.Path,
                        Errors = validation.Errors
                    });

                case Result.UnexpectedFailure unexpected:
                    _logger.LogError("Unexpected error deleting item {ItemId}: {Message}", id, unexpected.Message);
                    return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Internal Server Error",
                        Status = StatusCodes.Status500InternalServerError,
                        Detail = "An unexpected error occurred.",
                        Instance = HttpContext.Request.Path
                    });

                default:
                    return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
                    {
                        Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                        Title = "Internal Server Error",
                        Status = StatusCodes.Status500InternalServerError,
                        Detail = "An unexpected error occurred.",
                        Instance = HttpContext.Request.Path
                    });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting item {ItemId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new ApiErrorResponse
            {
                Type = "https://httpwg.org/specs/rfc7807.html#section-3",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An unexpected error occurred.",
                Instance = HttpContext.Request.Path
            });
        }
    }
}
