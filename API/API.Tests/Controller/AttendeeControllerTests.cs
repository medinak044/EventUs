using API.Controllers;
using API.DTOs;
using API.Interfaces;
using API.Models;
using AutoMapper;
using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace API.Tests.Controller;

public class AttendeeControllerTests
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public AttendeeControllerTests()
    {
        _unitOfWork = A.Fake<IUnitOfWork>();
        _userManager = A.Fake<UserManager<AppUser>>();
        _mapper = A.Fake<IMapper>();
    }

    private AttendeeController CreateNewController()
    {
        return new AttendeeController(_unitOfWork, _userManager, _mapper);
    }

    [Fact]
    public async Task AttendeeController_GetAllAttendees_ReturnOk()
    {
        // Arrange
        var controller = CreateNewController();

        // Act
        var result = await controller.GetAllAttendees();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task AttendeeController_CreateAttendee_ReturnOk()
    {
        // Arrange
        var attendeeRequestDto = A.Fake<AttendeeRequestDto>();
        var foundEvent = A.Fake<Event>();
        var foundAttendees = A.Fake<List<Attendee>>();
        var foundEventRole = A.Fake<EventRole>();
        var newAttendee = A.Fake<Attendee>();
        A.CallTo(() => _mapper.Map<Event>(attendeeRequestDto.Id)).Returns(foundEvent);
        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.CreateAttendee(attendeeRequestDto);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }
}
