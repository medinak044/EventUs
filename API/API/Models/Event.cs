using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Event
{
    [Key]
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Location { get; set; } // Online, specified address
    public string? Description { get; set; }
    // Time, date
    public string? Image { get; set; }
    //[ForeignKey("Address")]
    //public int? AddressId { get; set; }
    //public Address? Address { get; set; }

    [ForeignKey("AppUser")]
    public string? OwnerId { get; set; }
    public AppUser? Owner { get; set; }
    public ICollection<Attendee> Attendees { get; set; }
}
