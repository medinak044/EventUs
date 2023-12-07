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

public class EventControllerTests
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public EventControllerTests()
    {
        _unitOfWork = A.Fake<IUnitOfWork>();
        _userManager = A.Fake<UserManager<AppUser>>();
        _mapper = A.Fake<IMapper>();
    }

    private EventController CreateNewController()
    {
        return new EventController(_unitOfWork, _userManager, _mapper);
    }

    [Fact]
    public async Task EventController_GetAllEvents_ReturnOk()
    {
        // Arrange
        var controller = CreateNewController();

        // Act
        var result = await controller.GetAllEvents();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }
    
    [Fact]
    public async Task EventController_CreateEvent_ReturnOk()
    {
        // Arrange
        var eventRequestDto = A.Fake<EventRequestDto>(); 
        var userEvent = A.Fake<Event>();
        A.CallTo(()=> _mapper.Map<Event>(eventRequestDto)).Returns(userEvent);
        A.CallTo(()=> _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.CreateEvent(eventRequestDto);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task EventController_RemoveEvent_ReturnOk()
    {
        // Arrange
        int eventId = 1; 
        var eventToDelete = A.Fake<Event>();
        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.RemoveEvent(eventId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task EventController_UpdateEvent_ReturnOk()
    {
        // Arrange
        int eventId = 1;
        var eventDto = A.Fake<EventRequestDto>();
        var eventToDelete = A.Fake<Event>();
        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.UpdateEvent(eventId, eventDto);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

}
