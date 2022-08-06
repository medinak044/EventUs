using API.Configurations;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AttendeeController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public AttendeeController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager,
        IMapper mapper
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _mapper = mapper;
    }


    [HttpGet("GetAllAttendees")]
    public async Task<ActionResult> GetAllAttendees()
    {
        var result = await _unitOfWork.Attendees.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetEventAttendees/{eventId}")]
    public async Task<ActionResult> GetEventAttendees([FromRoute] int eventId)
    {
        // Search for any attendees with the matching eventId
        var attendees = _unitOfWork.Attendees.GetSome(a => a.EventId == eventId);

        var resultList = new List<Attendee>();

        // Populate each attendee object with data based on each foreign key
        foreach (var attendee in attendees)
        {
            // Event role
            attendee.EventRole = await _unitOfWork.EventRoles.GetByIdAsync(attendee.RoleId);
            // AppUserDto
            attendee.AppUser = _mapper.Map<AppUser>(await _userManager.FindByIdAsync(attendee.AppUserId));
            // Event (Just the id, don't include event data)
            //attendee.Event = await _unitOfWork.Events.GetByIdAsync(attendee.EventId);
            // CheckListItems
            attendee.CheckListItems = _unitOfWork.CheckListItems.GetSome(c => c.AttendeeId == attendee.Id).ToList();

            resultList.Add(attendee);
        }

        return Ok(resultList);
    }


    [HttpPost("CreateAttendee")] // Used when inviting users to an event
    public async Task<ActionResult> CreateAttendee([FromBody] AttendeeRequestDto attendeeRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if event exists
        var foundEvent = await _unitOfWork.Events.GetByIdAsync(attendeeRequestDto.EventId);
        if (foundEvent == null)
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Event not found" }
            });
        }
        // Make sure Attendee doesn't already attends the specified event
        var foundAttendees = _unitOfWork.Attendees.GetSome(a => a.AppUserId == attendeeRequestDto.AppUserId).ToList();
        foreach (var attendee in foundAttendees)
        {
            if (attendee.EventId == attendeeRequestDto.EventId)
            {
                return BadRequest(new RequestResult()
                {
                    Success = false,
                    Messages = new List<string>() { "Attendee already attends this event" }
                });
            }
        }
        // Check if event role exists
        var foundEventRole = await _unitOfWork.EventRoles.GetByIdAsync(attendeeRequestDto.RoleId);
        if (foundEventRole == null)
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "EventRole not found" }
            });
        }

        // Create new Attendee object to be saved to db
        var newAttendee = new Attendee()
        {
            RoleId = attendeeRequestDto.RoleId,
            AppUserId = attendeeRequestDto.AppUserId,
            EventId = attendeeRequestDto.EventId
        };

        // Save to db
        await _unitOfWork.Attendees.UpdateAsync(newAttendee);
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
            Messages = new List<string>() { "Attendee created" }
        });
    }

    [HttpPut("UpdateAttendee/{attendeeId}")] // (Not user id)
    public async Task<ActionResult> UpdateAttendee([FromRoute] int attendeeId, [FromBody] AttendeeRequestDto attendeeRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check if exists in db
        if (await _unitOfWork.Attendees.ExistsAsync(a => a.Id == attendeeId) == null)
        {
            return NotFound(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Event not found" }
            });

        }

        var mappedAttendee = _mapper.Map<Attendee>(attendeeRequestDto);
        // Include the id
        mappedAttendee.Id = attendeeId;

        await _unitOfWork.Attendees.UpdateAsync(mappedAttendee);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while updating" }
            });
        }


        return Ok(mappedAttendee);
    }

    [HttpDelete("RemoveAttendee/{attendeeId}")]
    public async Task<ActionResult> RemoveAttendee(int attendeeId)
    {
        var attendeeToDelete = await _unitOfWork.Attendees.GetByIdAsync(attendeeId);

        if (attendeeToDelete == null)
            return NotFound();

        await _unitOfWork.Attendees.RemoveAsync(attendeeToDelete);
        if (await _unitOfWork.SaveAsync() == false)
        {
            return BadRequest(new RequestResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        return Ok(attendeeToDelete);
    }

}
