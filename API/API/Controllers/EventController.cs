using API.Configurations;
using API.Data;
using API.DTOs;
using API.Interfaces;
using API.Models;
using API.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public EventController(
        IUnitOfWork unitOfWork,
        UserManager<AppUser> userManager,
        IMapper mapper
        )
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _mapper = mapper;
    }

    [HttpGet("GetAllEvents")]
    public async Task<ActionResult> GetAllEvents()
    {
        var result = await _unitOfWork.Events.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetInvitedEventsByUserId/{userId}")]
    public async Task<ActionResult> GetInvitedEventsByUserId(string userId)
    {
        // Get all Attendees that have matching userId
        var attendees = _unitOfWork.Attendees.GetSome(a => a.AppUserId == userId);
        // Add every unique event id to a collection
        var eventIds = new List<int>();
        foreach (var attendee in attendees)
        {
            if (!eventIds.Contains(attendee.EventId))
                eventIds.Add(attendee.EventId);
        }
        // Get event data
        var invitedEvents = new List<EventResponseDto>();
        foreach (var eventId in eventIds)
        {
            invitedEvents.Add(_mapper.Map<EventResponseDto>(await _unitOfWork.Events.GetByIdAsync(eventId)));
        }

        return Ok(invitedEvents);
    }


    [HttpGet("GetUserEvents")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "AppUser")]
    public async Task<ActionResult> GetUserEvents()
    {
        // Extract the user's Id from the token(claims)
        string loggedInUserId = User.Claims.FirstOrDefault(c => c.Type == "Id").Value;
        //string ownerId = "81702d33-3eef-4221-8690-f9c07f686eb1"; // (Test user)
        if (loggedInUserId == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "User id is null" }
            });
        }
        
        var resultList = new List<EventResponseDto>();

        #region User's owned events
        var userEvents = await _unitOfWork.Events.GetAllAsync(); // Get entire list of events from db
        foreach (var userEvent in userEvents)
        {
            // Add all events that have a matching owner id
            if (userEvent.OwnerId == loggedInUserId)
            {
                var resultEvent = _mapper.Map<EventResponseDto>(userEvent);
                // Add attendee data using event id
                resultEvent.Attendees = _unitOfWork.Attendees.GetSome(a => a.EventId == resultEvent.Id).ToList();
                // Add owner data as well (based on owner id)
                resultEvent.Owner = _mapper.Map<AppUserDto>(await _userManager.FindByIdAsync(resultEvent.OwnerId));
                resultList.Add(resultEvent); 
            } 
        }
        #endregion

        #region Events user is invited to
        // Get all Attendees that have matching userId
        var attendees = _unitOfWork.Attendees.GetSome(a => a.AppUserId == loggedInUserId);
        // Add every unique event id to a collection
        var eventIds = new List<int>();
        foreach (var attendee in attendees)
        {
            if (!eventIds.Contains(attendee.EventId))
                eventIds.Add(attendee.EventId);
        }
        // Get event data
        foreach (var eventId in eventIds)
        {
            var foundEvent = _mapper.Map<EventResponseDto>(await _unitOfWork.Events.GetByIdAsync(eventId));
            // Add owner data as well (based on owner id)
            foundEvent.Owner = _mapper.Map<AppUserDto>(await _userManager.FindByIdAsync(foundEvent.OwnerId));
            resultList.Add(foundEvent);
        }
        #endregion


        return Ok(resultList);
    }

    [HttpPost("CreateEvent")]
    public async Task<ActionResult> CreateEvent(EventRequestDto eventRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Map dto to event
        var userEvent = _mapper.Map<Event>(eventRequestDto);

        // Save Event to db
        await _unitOfWork.Events.AddAsync(userEvent);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        // Get the newly generated id from db attach it to response object

        // (Client-side): Add the owner as an Attendee by default, with the "Owner" role

        return Ok(userEvent);
    }

    [HttpPut("UpdateEvent/{eventId}")]
    public async Task<ActionResult> UpdateEvent([FromRoute] int eventId, [FromBody] EventRequestDto eventRequestDto)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        // Check if exists in db
        if (await _unitOfWork.Events.ExistsAsync(e => e.Id == eventId) == null)
        {
            return NotFound(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Event not found" }
            });

        }


        //var existingEvent = await _unitOfWork.Events.GetByIdAsync(eventId);
        var mappedEvent = _mapper.Map<Event>(eventRequestDto);
        // Include the id
        mappedEvent.Id = eventId;

        await _unitOfWork.Events.UpdateAsync(mappedEvent);
        if (!await _unitOfWork.SaveAsync())
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while updating" }
            });
        }

        return Ok(mappedEvent);
    }


    [HttpDelete("RemoveEvent/{eventId}")]
    public async Task<ActionResult> RemoveEvent(int eventId)
    {
        var eventToDelete = await _unitOfWork.Events.GetByIdAsync(eventId);

        if (eventToDelete == null)
            return NotFound();


        await _unitOfWork.Events.RemoveAsync(eventToDelete);
        if (await _unitOfWork.SaveAsync() == false)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Messages = new List<string>() { "Something went wrong while saving" }
            });
        }

        // (Client-side): Remove all Attendees associated with the event (by event id)
        return Ok(eventToDelete);
    }

}
