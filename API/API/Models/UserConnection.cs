using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class UserConnection
{
    [Key]
    public int Id { get; set; }
    [Required]
    public string AddedById { get; set; }
    [Required]
    public string SavedUserId { get; set; }
}
