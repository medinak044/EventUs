using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class UserConnection
{
    [Key]
    public int Id { get; set; }

    //(Don't forget to establish DbSet in DataContext)

    //Find out how to do friend request system
    // Then connect this to AppUser
}
