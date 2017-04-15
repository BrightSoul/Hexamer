using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Hexamer.Model.Results;
using Microsoft.AspNetCore.Mvc;
using Scacchi.Model.Results;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class SlackController : Controller
    {
        [HttpGet("AuthorizeUrl")]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(SlackAuthorizeUrlResult))]
        public IActionResult GetAuthorizeUrl() {
            return Ok(new SlackAuthorizeUrlResult { SlackAuthorizeUrl = "https://slack.com/oauth/authorize?&client_id=156912263664.169770148578&scope=identity.avatar,identity.basic,identity.email,identity.team&redirect_url=" + WebUtility.UrlEncode("http://localhost:5000/api/Slack/Redirect") });
        }

        [HttpGet("Redirect")]
        public async Task<IActionResult> Get(){
            return Ok("hey");
        }   

        [HttpPost]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(LoginResult))]
        [SwaggerResponse((int) HttpStatusCode.BadRequest, typeof(LoginResult))]
        public async Task<IActionResult> Post()
        {
            return Ok(new LoginResult { Token = "aabbcc"});
        }
    }
}
