using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class City
{
    [Key]
    public int Id { get; set; }
    public string? Name { get; set; }
    [ForeignKey("State")]
    public int? StateId { get; set; }
    public State? State { get; set; }
}
