using API.Configurations;
using API.DTOs;
using API.Models;
using API.Repository;
using AutoMapper;
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
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IMapper _mapper;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        //UnitOfWork unitOfWork, // unitofwork wont work here
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        //RoleManager<IdentityRole> roleManager,
        //IConfiguration configuration // (Jwt token)
        //TokenValidationParameters tokenValidationParams, // (Jwt token)
        IMapper mapper,
        ILogger<AccountController> logger
        )
    {
        //_unitOfWork = unitOfWork;
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet("GetAllUsers")]
    public async Task<ActionResult> GetAllUsers()
    {
        var users = _mapper.Map<List<AppUserDto>>(await _userManager.Users.ToListAsync());
        return Ok(users);
    }

    [HttpGet("GetUserById/{userId}")]
    public async Task<ActionResult> GetUserById(string userId)
    {
        var user = _mapper.Map<AppUserDto>(await _userManager.FindByIdAsync(userId));
        return Ok(user);
    }


    [HttpPost("Register")]
    public async Task<ActionResult> Register(AppUserRegistrationDto requestDto)
    {
        if (!ModelState.IsValid) 
            return BadRequest();

        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(requestDto.Email);
        if (existingUser != null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "This email address is already in use" }
            });
        }

        var newUser = _mapper.Map<AppUser>(requestDto);

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
    public async Task<ActionResult> Login(AppUserLoginDto loginRequest)
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
        var passwordIsCorrect = await _userManager.CheckPasswordAsync(existingUser, loginRequest.Password);
        if (!passwordIsCorrect)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Invalid credentials" }
            });
        }

        // Password is verified, log the user in

        //var jwtToken = await GenerateJwtTokenAsync_1(existingUser);

        //return Ok(jwtToken);
        return Ok("Login successful");
    }

    [HttpPost("UpdateUser")]
    public async Task<ActionResult> UpdateUser(AppUserDto updatedUserDto)
    {
        if (!ModelState.IsValid)
            return BadRequest();

        // Reference user
        var existingUser = await _userManager.FindByIdAsync(updatedUserDto.Id);
        if (existingUser == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Email doesn't exist" }
            });
        }

        // Map values
        existingUser = _mapper.Map<AppUserDto, AppUser>(updatedUserDto, existingUser);

        // Save updated values to db
        await _userManager.UpdateAsync(existingUser);

        //return Ok("User successfully updated");
        return Ok(existingUser);
    }


    [HttpDelete("DeleteUser/{userId}")]
    public async Task<ActionResult> DeleteUser (string userId)
    {
        // Reference user by id
        var existingUser = await _userManager.FindByIdAsync(userId);
        if (existingUser == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "User doesn't exist" }
            });
        }

        // Delete user from db
        await _userManager.DeleteAsync(existingUser);

        return Ok("User successfully deleted");
    }
}
