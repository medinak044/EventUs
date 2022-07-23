using AutoMapper;
using API.DTOs;
using API.Models;
using API.Configurations;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AppUser, AppUserDto>(); // Data from api to client
        CreateMap<AppUserDto, AppUser>(); // When updating existing user info from a dto
        CreateMap<AppUserRegistrationDto, AppUser>(); // When registering new user
        CreateMap<AppUser, AppUserLoggedInDto>(); // When logging user in, gives user info
        CreateMap<AuthResult, AppUserLoggedInDto>(); // When logging user in, gives token for the client
    }
}
