using AutoMapper;
using API.DTOs;
using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        // Map IdentityUser properties?
        CreateMap<UserRegistrationRequestDto, IdentityUser>(); // Email, Username
    }
}
