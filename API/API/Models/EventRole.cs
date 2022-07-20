using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace API.Models;

public class EventRole
{
    [Key]
    public int Id { get; set; }
    public string Role { get; set; } // Owner, Organizer, Attendee 
}
