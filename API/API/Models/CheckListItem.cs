using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class CheckListItem // Associated with one Attendee (exclusive to an event)
{
    [Key]
    public int Id { get; set; }
    public bool IsChecked { get; set; }
    public string? Description { get; set; }

    [ForeignKey("Attendee")]
    public int AttendeeId { get; set; }
}
