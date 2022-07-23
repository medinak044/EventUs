using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class TokenRequestDto
{
    [Required]
    public string Token { get; set; }
    [Required]
    public string RefreshToken { get; set; }
}
