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
    public DateTime StartDate { get; set; } 
    public DateTime EndDate { get; set; } 
    public string? Image { get; set; }
    [ForeignKey("AppUser")]
    public string? OwnerId { get; set; }
    //public AppUser? Owner { get; set; }
    public ICollection<Attendee> Attendees { get; set; }
}
