using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class LogoutController : Controller
    {
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            await HttpContext.Authentication.SignOutAsync("CookieAuth");
            return Redirect("/");
        }
    }
}