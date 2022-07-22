using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AccountRoleDto
{
    [Required]
    [EmailAddress]
    public string? Email { get; set; }
    [Required]
    public string? RoleName { get; set; }
}
