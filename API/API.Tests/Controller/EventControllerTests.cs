using API.Controllers;
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

    [Fact]
    public async Task EventController_GetAllEvents_ReturnOk()
    {
        // Arrange
        var controller = new EventController(_unitOfWork, _userManager, _mapper);

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
        // EventRequestDto
        var controller = new EventController(_unitOfWork, _userManager, _mapper);

        // Act
        //var result = await controller.CreateEvent();

        // Assert
        //result.Should().NotBeNull();
        //result.Should().BeOfType(typeof(OkObjectResult));
    }


}
