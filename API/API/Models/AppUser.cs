using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class AppUser: IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    [ForeignKey("AppUser")]
    public int? AddressId { get; set; }
    public Address? Address { get; set; }
    public ICollection<Event> Events { get; set; }
    // Profile image url/source, (users can upload images to Cloudinary)
    //public string RefreshToken { get; set; }
    //public DateTime TokenCreated { get; set; }
    //public DateTime TokenExpires { get; set; }
}
