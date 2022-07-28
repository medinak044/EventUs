using API.Configurations;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventRoleController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public EventRoleController(
        IUnitOfWork unitOfWork,
        IMapper mapper
        )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }


    [HttpGet("GetAllEventRoles")]
    public async Task<ActionResult> GetAllEventRoles()
    {
        var result = await _unitOfWork.EventRoles.GetAllAsync();
        return Ok(result);
    }

    [HttpPost("CreateEventRole")]
    public async Task<ActionResult> CreateEventRole([FromBody] EventRole eventRole)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Make sure name of the role doesn't already exist
        var anyMatchingRole = _unitOfWork.EventRoles
            .GetSome(r => r.Role.Trim().ToUpper() == eventRole.Role.Trim().ToUpper())
            .FirstOrDefault();
        if (anyMatchingRole != null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Role already exists" }
            });
        }


        await _unitOfWork.EventRoles.AddAsync(eventRole);
        if (await _unitOfWork.SaveAsync() == false)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok($"{eventRole.Role} role created");
    }

    [HttpPut("UpdateEventRole/{eventRoleId}")]
    public async Task<ActionResult> UpdateEventRole([FromRoute] int eventRoleId, [FromBody] EventRole updatedEventRole)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        // Check if exists in db
        if (await _unitOfWork.EventRoles.ExistsAsync(e => e.Role == updatedEventRole.Role) == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Event role not found" }
            });

        }

        // Include the id
        updatedEventRole.Id = eventRoleId;

        await _unitOfWork.EventRoles.UpdateAsync(updatedEventRole);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Something went wrong while updating" }
            });
        }

        return Ok(updatedEventRole);
    }


    [HttpDelete("RemoveEventRole/{eventRoleId}")]
    public async Task<ActionResult> RemoveEventRole([FromRoute] int eventRoleId)
    {
        var eventRoleToDelete = await _unitOfWork.EventRoles.GetByIdAsync(eventRoleId);
        if (eventRoleToDelete == null)
            return NotFound();

        await _unitOfWork.EventRoles.RemoveAsync(eventRoleToDelete);
        if (await _unitOfWork.SaveAsync() == false)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(eventRoleToDelete);
    }

}
