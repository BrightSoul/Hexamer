using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Hexamer.Model;
using Hexamer.Model.Results;
using Hexamer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Scacchi.Model.Results;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Hexamer.Controllers
{
    [AllowAnonymous, Route("api/[controller]")]
    public class SlackController : Controller
    {
        private readonly AppConfig config;
        private readonly IUserRepository userRepository;
        private readonly IAuthority authority;
        public SlackController(AppConfig config, IUserRepository userRepository, IAuthority authority)
        {
            this.config = config;
            this.userRepository = userRepository;
            this.authority = authority;
        }

        [HttpGet("AuthorizationUrl")]
        [SwaggerResponse((int) HttpStatusCode.OK, typeof(SlackAuthorizationUrlResult))]
        public IActionResult GetAuthorizationUrl() {
            return Ok(new SlackAuthorizationUrlResult { SlackAuthorizationUrl = $"https://slack.com/oauth/authorize?&client_id={config.SlackClientId}&team=&scope={config.SlackScope}&redirect_uri={GetRedirectUrl()}" });
        }
        private string GetRedirectUrl() {
            return WebUtility.UrlEncode($"{Request.Scheme}://{Request.Host}/api/Slack/Redirect");
        }

        [HttpGet("Redirect")]
        public async Task<IActionResult> GetRedirect(string code) {

            using (var httpClient = new HttpClient()) {
                string accessUrl = $"https://slack.com/api/oauth.access?client_id={config.SlackClientId}&client_secret={config.SlackSecret}&code={code}&redirect_uri={GetRedirectUrl()}";
                var response = await httpClient.GetAsync(accessUrl);
                response.EnsureSuccessStatusCode();
                var resultBody = await response.Content.ReadAsStringAsync();
                var result = DeserializeResultBody(resultBody);
                if (!result.Ok)
                    throw new InvalidOperationException();

                var principal = await authority.SignIn(result.User, HttpContext);
                
                await userRepository.CreateUserIfNotExists(principal);
                

                return Redirect("/");
            }
        }

        private SlackAuthorizationResult DeserializeResultBody(string resultBody) {
            return JsonConvert.DeserializeObject<SlackAuthorizationResult>(resultBody);
        }
    }
}
