namespace API.Configurations;

public class AuthResult: RequestResult
{
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    //public bool Success { get; set; }
    //public List<string>? Messages { get; set; }
}
