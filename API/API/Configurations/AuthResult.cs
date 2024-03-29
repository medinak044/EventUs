﻿namespace API.Configurations;

public class AuthResult: RequestResult
{
    public string? Token { get; set; }
    public string? RefreshToken { get; set; }
    //public bool Success { get; set; }
    //public List<string>? Messages { get; set; }
    public void PrintMessages()
    {
        Console.WriteLine("--------------- Auth Result messages:");
        foreach (string m in Messages)
        {
            Console.WriteLine(m);
        }
    }
}
