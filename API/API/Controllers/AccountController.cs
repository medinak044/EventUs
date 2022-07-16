using API.Configurations;
using API.DTOs;
using API.Models;
using API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    //private readonly UnitOfWork _unitOfWork;
    private readonly UserManager<AppUser> _userManager;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        //UnitOfWork unitOfWork,
        UserManager<AppUser> userManager,
        //RoleManager<IdentityRole> roleManager,
        //IConfiguration configuration // (Jwt token)
        //TokenValidationParameters tokenValidationParams, // (Jwt token)
        ILogger<AccountController> logger
        )
    {
        //_unitOfWork = unitOfWork;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet("GetAllUsers")]
    public async Task<ActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        return Ok(users);
    }

    [HttpPost("Register")]
    public async Task<ActionResult> Register(UserRegistrationRequestDto requestDto)
    {
        if (!ModelState.IsValid) 
            return BadRequest();

        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(requestDto.Email);
        if (existingUser == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "This email address is already in use" }
            });
        }

        var newUser = new AppUser()
        {
            Email = requestDto.Email,
            UserName = requestDto.Email
        };

        var newUserIsCreated = await _userManager.CreateAsync(newUser, requestDto.Password);
        if (!newUserIsCreated.Succeeded)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Server error" }
            });
        }

        //// Add user to a default role
        //await _userManager.AddToRoleAsync(newUser, RolesString.RoleTypeEnum.AppUser.ToString());

        //// Generate the token
        //var jwtToken = await GenerateJwtTokenAsync(newUser);

        //return Ok(jwtToken); // Return the token

        return Ok("New user successfully created");
    }

    [HttpPost("Login")]
    public async Task<ActionResult> Login(UserLoginRequestDto loginRequest)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        // Check if user exists
        var existingUser = await _userManager.FindByEmailAsync(loginRequest.Email);
        if (existingUser == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Email doesn't exist" }
            });
        }

        // Verify password
        var isCorrect = await _userManager.CheckPasswordAsync(existingUser, loginRequest.Password);
        if (!isCorrect)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Invalid credentials" }
            });
        }

        //var jwtToken = await GenerateJwtTokenAsync_1(existingUser);

        //return Ok(jwtToken);
        return Ok("Login successful");
    }

}
