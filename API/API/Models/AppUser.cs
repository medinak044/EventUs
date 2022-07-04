using Microsoft.AspNetCore.Identity;

namespace API.Models;

public class AppUser: IdentityUser // Already includes (string) Id field
{
    //public int Id { get; set; }
    public string DisplayName { get; set; }
    public string Address { get; set; }
}
