using API.DTOs;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class Attendee
{
    [Key]
    public int Id { get; set; }
    [ForeignKey("EventRole")]
    public int RoleId { get; set; }
    public EventRole? EventRole { get; set; } // "Attendee" role should be the default value
    [ForeignKey("AppUser")]
    public string? AppUserId { get; set; }
    public AppUserDto? AppUser { get; set; }
    [ForeignKey("Event")]
    public int EventId { get; set; } // One specific event
    //public Event? Event { get; set; } //(Consider removing field, it seems only the event id is needed)
    public ICollection<CheckListItem>? CheckListItems { get; set; }
}
