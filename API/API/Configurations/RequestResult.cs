﻿namespace API.Configurations;

// For sending response objects back to client
public class RequestResult
{
    public object DataObject { get; set; }
    public bool Success { get; set; }
    //(Return a response status code as well?)
    public List<string>? Messages { get; set; }
    public void PrintMessages()
    {
        Console.WriteLine("--------------- Request Result messages:");
        foreach (string m in Messages)
        {
            Console.WriteLine(m);
        }
    }

}
