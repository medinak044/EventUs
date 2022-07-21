using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace API.Models;

public class EventRole
{
    // Use enum for roles?
    [Key]
    public int Id { get; set; }
    public string Role { get; set; } // Owner, Organizer, Attendee 
}
