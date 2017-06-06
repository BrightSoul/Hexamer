using System.Threading.Tasks;
using Hexamer.Model;
using Microsoft.AspNetCore.Mvc;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class LogoutController : Controller
    {
        private readonly AppConfig config;

        public LogoutController(AppConfig config)
        {
            this.config = config;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            await HttpContext.Authentication.SignOutAsync(config.AuthenticationScheme);
            return Redirect("/");
        }
    }
}