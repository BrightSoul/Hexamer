using System.Linq;
using System.Net;
using System.Security.Claims;
using Hexamer.Model;
using Hexamer.Results;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        [HttpGet]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(UserResult))]
        public IActionResult Get() {
            var identity = User;
            if (!identity.Identity.IsAuthenticated)
                return Ok(new UserResult { IsAuthenticated = false });

            return Ok(new UserResult {
                IsAuthenticated = true,
                User = new User {
                    Name = identity.Identity.Name,
                    ImageUrl = identity.Identities.First().Claims.Where(c => c.Type == ClaimTypes.Uri).Select(c => c.Value).FirstOrDefault(),
                }
            });
        }
    }
}