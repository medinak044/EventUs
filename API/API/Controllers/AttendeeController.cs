using API.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AttendeeController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AttendeeController(
                IUnitOfWork unitOfWork,
        IMapper mapper
        )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }


    [HttpGet("GetAllAttendees")]
    public async Task<ActionResult> GetAllAttendees()
    {
        var result = await _unitOfWork.Attendees.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("GetEventAttendees")]
    public async Task<ActionResult> GetEventAttendees(int eventId)
    {
        // Search for any attendees with the matching eventId
        var attendees = _unitOfWork.Attendees.GetSome(a => a.EventId == eventId);

        // Populate each attendee object with data based on each foreign key
        foreach (var attendee in attendees)
        {
            // Event role

            // AppUserDto

            // Event

            // CheckListItems

        }

        return Ok(attendees);
    }


    //[HttpPost("CreateAttendee")] // Used when creating an event, or inviting users to an event
    //public async Task<ActionResult> CreateAttendee(int eventId)
    //{

    //}

}
