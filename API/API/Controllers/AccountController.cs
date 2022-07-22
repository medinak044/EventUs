﻿using API.Configurations;
using API.Data;
using API.DTOs;
using API.Helpers;
using API.Models;
using API.Repository;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly DataContext _context;
    //private readonly UnitOfWork _unitOfWork;

    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _appSettings;
    private readonly TokenValidationParameters _tokenValidationParams;
    private readonly IMapper _mapper;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        //UnitOfWork unitOfWork, // unitofwork wont work here
        DataContext context,
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration appSettings, // (Access app settings data for Jwt token)
        TokenValidationParameters tokenValidationParams, // (Jwt token)
        IMapper mapper,
        ILogger<AccountController> logger
        )
    {
        _context = context;
        //_unitOfWork = unitOfWork;
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _appSettings = appSettings;
        _tokenValidationParams = tokenValidationParams;
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

    // (Example of a route that requires user authorization)
    [HttpGet("GetUserProfile")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "AppUser")]
    public async Task<ActionResult> GetUserProfile()
    {
        // Extract the user's Id from the token(claims)
        string userId = User.Claims.First(c => c.Type == "Id").Value;
        if (userId == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { $"userId is null: {userId}" }
            });
        }
        var user = _mapper.Map<AppUserDto>(await _userManager.FindByIdAsync(userId));
        if (user == null)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "User is not found" }
            });
        }

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

        // Add user to a default role
        await _userManager.AddToRoleAsync(newUser, RoleNames.RoleTypeEnum.AppUser.ToString());

        // Generate the token
        AuthResult? jwtToken = await GenerateJwtTokenAsync(newUser);

        return Ok(jwtToken); // Return the token (Inside AuthResult object)
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

        // Give token to user (to be stored in browser local storage)
        AuthResult? jwtToken = await GenerateJwtTokenAsync(existingUser);

        return Ok(jwtToken);
    }

    //[HttpGet("Logout")]
    //public async Task<ActionResult> Logout()
    //{
    //    await _signInManager.SignOutAsync();
    //    return Ok();
    //}


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

    [HttpPost("RefreshToken")]
    public async Task<ActionResult> RefreshToken([FromBody] TokenRequest tokenRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Invalid payload" }
            });
        }

        AuthResult? result = await VerifyAndGenerateToken(tokenRequest);
        if (result == null) // In case something goes wrong in the middle of the process
        {
            return BadRequest(new AuthResult()
            {
                Success = false,
                Errors = new List<string>() { "Invalid token" }
            });
        }
        return Ok(result);
    }

    #region Jwt Token logic
    private async Task<AuthResult> GenerateJwtTokenAsync(AppUser user)
    {

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.GetSection("JwtConfig:Secret").Value));
        var currentDate = DateTime.UtcNow;
        var claims = await GetAllValidClaimsAsync(user);

        // Token descriptor
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            //Expires = currentDate.AddSeconds(10), // Temp: For refresh token demo purposes
            Expires = currentDate.AddMinutes(10),
            NotBefore = currentDate,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var jwtTokenHandler = new JwtSecurityTokenHandler();

        var token = jwtTokenHandler.CreateToken(tokenDescriptor);
        var jwtToken = jwtTokenHandler.WriteToken(token);

        var refreshToken = new RefreshToken()
        {
            JwtId = token.Id,
            IsUsed = false,
            IsRevoked = false,
            UserId = user.Id,
            AddedDate = currentDate,
            ExpiryDate = currentDate.AddMonths(6),
            Token = RandomString(35) + Guid.NewGuid(),
        };

        await _context.RefreshTokens.AddAsync(refreshToken); // Add changes to memory
        await _context.SaveChangesAsync(); // Save changes to db

        return new AuthResult()
        {
            Token = jwtToken,
            RefreshToken = refreshToken.Token,
            Success = true,
        };
    }

    private async Task<List<Claim>> GetAllValidClaimsAsync(AppUser user)
    {
        var claims = new List<Claim>
        {
            new Claim("Id", user.Id), // There is no ClaimTypes.Id
            new Claim(ClaimTypes.NameIdentifier, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // For "JwtId"
            // new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
            // (The role claim will be added here)
        };

        // Getting the claims that we have assigned to the user
        var userClaims = await _userManager.GetClaimsAsync(user);
        claims.AddRange(userClaims);

        // Get the user role, convert it, and add it to the claims
        var userRoles = await _userManager.GetRolesAsync(user);
        foreach (var userRole in userRoles)
        {
            var role = await _roleManager.FindByNameAsync(userRole);

            if (role != null)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole));

                var roleClaims = await _roleManager.GetClaimsAsync(role);
                foreach (var roleClaim in roleClaims)
                { claims.Add(roleClaim); }
            }
        }

        return claims;
    }

    //
    private async Task<AuthResult> VerifyAndGenerateToken(TokenRequest tokenRequest)
    {
        var jwtTokenHandler = new JwtSecurityTokenHandler();

        try // Run the token request through validations
        {
            // Check that the string is actually in jwt token format
            // (The token validation parameters were defined in the Program.cs class)
            var tokenInVerification = jwtTokenHandler.ValidateToken(tokenRequest.Token,
                _tokenValidationParams, out var validatedToken);

            // Check if the encryption algorithm matches
            if (validatedToken is JwtSecurityToken jwtSecurityToken)
            {
                bool result = jwtSecurityToken.Header.Alg
                    .Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCulture);

                if (result == false)
                    return null;
            }

            // Check if token has expired (don't generate new token if current token is still usable)
            // "long" was used because of the long utc time string
            var utcExpiryDate = long.Parse(tokenInVerification.Claims
                .FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

            // Convert into a usable date type
            var expiryDate = UnixTimeStampToDateTime(utcExpiryDate);

            if (expiryDate > DateTime.UtcNow)
            {
                return new AuthResult()
                {
                    Success = false,
                    Errors = new List<string>() { "Token has not yet expired" }
                };
            }

            // Check if token exists in db
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(x => x.Token == tokenRequest.RefreshToken);

            if (storedToken == null)
            {
                return new AuthResult()
                {
                    Success = false,
                    Errors = new List<string>() { "Token does not exist" }
                };
            }

            // Check if token is already used
            if (storedToken.IsUsed)
            {
                return new AuthResult()
                {
                    Success = false,
                    Errors = new List<string>() { "Token has been used" }
                };
            }

            // Check if token has been revoked
            if (storedToken.IsRevoked)
            {
                return new AuthResult()
                {
                    Success = false,
                    Errors = new List<string>() { "Token has been revoked" }
                };
            }

            // Check if jti matches the id of the refresh token that exists in our db (validate the id)
            var jti = tokenInVerification.Claims
                .FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti).Value;

            if (storedToken.JwtId != jti)
            {
                return new AuthResult()
                {
                    Success = false,
                    Errors = new List<string>() { "Token does not match" }
                };
            }

            // First, update current token
            storedToken.IsUsed = true; // Prevent the current token from being used in the future
            _context.RefreshTokens.Update(storedToken);
            await _context.SaveChangesAsync(); // Save changes

            // Then, generate a new jwt token, then assign it to the user
            var dbUser = await _userManager.FindByIdAsync(storedToken.UserId); // Find the AppUser by the user id on the current token
            return await GenerateJwtTokenAsync(dbUser);
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    // Converts date data to DateTime
    private DateTime UnixTimeStampToDateTime(long unixTimeStamp)
    {
        var dateTimeVal = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
        dateTimeVal = dateTimeVal.AddSeconds(unixTimeStamp).ToUniversalTime();
        return dateTimeVal;
    }

    private string RandomString(int length)
    {
        var random = new Random();
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return new string(Enumerable.Repeat(chars, length)
            .Select(x => x[random.Next(x.Length)]).ToArray());
    }

    #endregion
}
