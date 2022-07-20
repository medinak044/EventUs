using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Connection
{
    [Key]
    public int Id { get; set; }

    //Find out how to do friend request system
    // Then connect this to AppUser
}
