using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        //[Authorize]
        //[AllowAnonymous] for publicly accessable routes
        // Users with certain roles can access routes
        // Register users
        // (See Teddy Smith's app for controller example)
    }
}
