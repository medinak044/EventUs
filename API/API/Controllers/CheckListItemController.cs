using API.Configurations;
using API.Interfaces;
using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CheckListItemController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CheckListItemController(
        IUnitOfWork unitOfWork
        )
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet("GetAllCheckListItems")]
    public async Task<ActionResult> GetAllCheckListItems()
    {
        var result = await _unitOfWork.CheckListItems.GetAllAsync();
        //return Ok(result);
        return Ok(new RequestResult()
        {
            DataObject = result,
            Success = true,
            Messages = new List<string>() { "Successfully retrieved all CheckListItems" }
        });
    }

    [HttpGet("GetAttendeeCheckListItems/{attendeeId}")]
    public async Task<ActionResult> GetAttendeeCheckListItems([FromRoute] int attendeeId)
    {
        // Get check list items based on the attendee object id
        var result = _unitOfWork.CheckListItems.GetSome(c => c.AttendeeId == attendeeId);
        return Ok(result);
    }

    [HttpPost("CreateCheckListItem")] // Used when inviting users to an event
    public async Task<ActionResult> CreateCheckListItem([FromBody] CheckListItem updatedCheckListItem)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if attendee exists
        var foundAttendee = await _unitOfWork.Attendees.GetByIdAsync(updatedCheckListItem.AttendeeId);
        if (foundAttendee == null)
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Attendee not found" }
            });
        }

        // Make sure "IsChecked" is false by default
        updatedCheckListItem.IsChecked = false;

        // Save to db
        await _unitOfWork.CheckListItems.UpdateAsync(updatedCheckListItem);
        if (await _unitOfWork.SaveAsync() == false)
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }


        return Ok(new RequestResult()
        {
            Success = true,
            Messages = new List<string>() { "CheckListItem created" }
        });
    }


    [HttpPut("UpdateCheckListItem/{checkListItemId}")]
    public async Task<ActionResult> UpdateCheckListItem(
        [FromRoute] int checkListItemId, [FromBody] CheckListItem updatedCheckListItem)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        if (await _unitOfWork.CheckListItems.ExistsAsync(c => c.Id == checkListItemId) == null)
        {
            return NotFound(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "CheckListItem not found" }
            });

        }

        // Include the id
        updatedCheckListItem.Id = checkListItemId;

        await _unitOfWork.CheckListItems.UpdateAsync(updatedCheckListItem);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while updating" }
            });
        }

        return Ok(updatedCheckListItem);
    }

    [HttpDelete("RemoveCheckListItem/{checkListItemId}")]
    public async Task<ActionResult> RemoveCheckListItem([FromRoute] int checkListItemId)
    {
        var checkListItemToDelete = await _unitOfWork.CheckListItems.GetByIdAsync(checkListItemId);

        if (checkListItemToDelete == null)
            return NotFound();

        await _unitOfWork.CheckListItems.RemoveAsync(checkListItemToDelete);
        if (await _unitOfWork.SaveAsync() == false)
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(checkListItemToDelete);
    }

}
