namespace API.Configurations;

// For sending response objects back to client
public class RequestResult
{
    public object DataObject { get; set; }
    public bool Success { get; set; }
    public List<string>? Messages { get; set; }

}
