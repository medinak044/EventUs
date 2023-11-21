using API.Models;

namespace API.DTOs;

public class AppUserDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public DateTime DateAdded { get; set; } // Field used for helping to convert date value to string
    public string DateAddedStr { get; set; }
    //public Address? Address { get; set; }

}
