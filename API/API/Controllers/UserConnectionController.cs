using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using API.Models;
using API.Repository;
using API.Data;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using API.Configurations;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserConnectionController : ControllerBase
{
    //private readonly UnitOfWork _unitOfWork;
    private readonly DataContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly IMapper _mapper;

    public UserConnectionController(
        //UnitOfWork unitOfWork,
        DataContext context,
        UserManager<AppUser> userManager,
        IMapper mapper
        )
    {
        //_unitOfWork = unitOfWork;
        _context = context;
        _userManager = userManager;
        _mapper = mapper;
    }

    [HttpGet("GetAddedUsers/{userId}")] // Get a list of all users added by user
    public async Task<ActionResult> GetAddedUsers(string userId)
    {
        //var allAddedUsers = _unitOfWork.UserConnectionRepository.GetSome(c => c.AddedById == userId);
        var userConnections = _context.UserConnections.Where(c => c.AddedById == userId);

        var resultList = new List<UserConnectionResponseDto>();
        // Foreach added user id, get their user info and store it in a list
        foreach (var userConnection in userConnections)
        {
            // Find respective user by id, then map user values to a dto
            var dto = _mapper.Map<UserConnectionResponseDto>(await _userManager.FindByIdAsync(userConnection.SavedUserId));
            // Add userConnection id as well
            dto.UserConnectionId = userConnection.Id;
            // Add dto to the list
            resultList.Add(dto);
        }

        return Ok(resultList);
    }

    [HttpGet("CreateUserConnection/{savedUserId}")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "AppUser")]
    public async Task<ActionResult> CreateUserConnection(string savedUserId)
    {
        // Extract the user's Id from the token(claims)
        string addedById = User.Claims.FirstOrDefault(c => c.Type == "Id").Value;
        if (addedById == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { $"addedById is null: {addedById}" }
            });
        }
        if (addedById == savedUserId)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Cannot add yourself as a saved user" }
            });
        }

        // Create a return object
        var userConnection = new UserConnection()
        {
            AddedById = addedById,
            SavedUserId = savedUserId
        };

        await _context.UserConnections.AddAsync(userConnection);
        if (await _context.SaveChangesAsync() <= 0)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Something went wrong while saving" }
            });
        } 

        return Ok("Successfully created a user connection");
    }

    [HttpDelete("RemoveUserConnection/{userConnectionId}")]
    public async Task<ActionResult> RemoveUserConnection(int userConnectionId)
    {
        var userConnectionToDelete = await _context.UserConnections.FindAsync(userConnectionId);

        if (userConnectionToDelete == null)
            return NotFound();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _context.UserConnections.Remove(userConnectionToDelete);
        _context.SaveChanges();

        return Ok("Successfully deleted a user connection");
    }
}
