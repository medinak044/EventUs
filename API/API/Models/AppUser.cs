using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class AppUser: IdentityUser
{
    // Already includes (string) Id field
    public string? DisplayName { get; set; } // Username already provided
    //public string RefreshToken { get; set; }
    //public DateTime TokenCreated { get; set; }
    //public DateTime TokenExpires { get; set; }

    // Profile image url/source
    //[ForeignKey("AppUser")]
    //public int AddressId { get; set; }
    //public Address Address { get; set; }
}
