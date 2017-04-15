using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Scacchi.Model.Results;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        [HttpPost]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(LoginResult))]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, typeof(LoginResult))]
        public async Task<IActionResult> Post()
        {
            return Ok(new LoginResult { Token = "aabbcc"});
        }
    }
}
