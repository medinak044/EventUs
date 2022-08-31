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

public class CheckListItemControllerTests
{
    private readonly IUnitOfWork _unitOfWork;

    public CheckListItemControllerTests()
    {
        _unitOfWork = A.Fake<IUnitOfWork>();
    }

    private CheckListItemController CreateNewController()
    {
        return new CheckListItemController(_unitOfWork);
    }

    [Fact]
    public async Task CheckListItemController_GetAllCheckListItems_ReturnOk()
    {
        // Arrange
        var controller = CreateNewController();

        // Act
        var result = await controller.GetAllCheckListItems();

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task CheckListItemController_CreateCheckListItem_ReturnOk()
    {
        // Arrange
        var newCheckListItem = A.Fake<CheckListItem>();
        var foundAttendee = A.Fake<Attendee>();
        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.CreateCheckListItem(newCheckListItem);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task CheckListItemController_UpdateCheckListItem_ReturnOk()
    {
        // Arrange
        int checkListItemId = 1;
        var updatedCheckListItem = A.Fake<CheckListItem>();
        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.UpdateCheckListItem(checkListItemId, updatedCheckListItem);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }

    [Fact]
    public async Task CheckListItemController_RemoveCheckListItem_ReturnOk()
    {
        // Arrange
        int checkListItemId = 1;
        var checkListItemToDelete = A.Fake<CheckListItem>();
        A.CallTo(() => _unitOfWork.SaveAsync()).Returns(true);
        var controller = CreateNewController();

        // Act
        var result = await controller.RemoveCheckListItem(checkListItemId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType(typeof(OkObjectResult));
    }
}
