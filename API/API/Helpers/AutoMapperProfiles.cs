using AutoMapper;
using API.DTOs;
using API.Models;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, AppUserDto>(); // Data from api to client
        CreateMap<AppUserDto, AppUser>(); // When updating existing user info from a dto
        CreateMap<AppUserRegistrationDto, AppUser>(); // When registering new user
    }
}
