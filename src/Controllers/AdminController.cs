using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Hexamer.Extensions;
using Hexamer.Model;
using Hexamer.Model.Requests;
using Hexamer.Model.Results;
using Hexamer.Results;
using Hexamer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Policy = "Administrator")]
    public class AdminController : Controller
    {
        private readonly IUserRepository userRepository;
        private readonly IAnswerRepository answerRepository;
        private readonly IExamRepository examRepository;
        private readonly IAuthority authority;
        private readonly IStatistics statistics;
        private readonly AppConfig config;
        
        public AdminController(IExamRepository examRepository, IUserRepository userRepository, IAnswerRepository answerRepository, IAuthority authority, IStatistics statistics, AppConfig config)
        {
            this.userRepository = userRepository;
            this.answerRepository = answerRepository;
            this.examRepository = examRepository;
            this.authority = authority;
            this.statistics = statistics;
            this.config = config;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] AdminLoginRequest request) {
            var password = config?.AdministratorPassword ?? string.Empty;
            var username = request?.Username ?? string.Empty;
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password) || !password.Equals(request?.Password, StringComparison.OrdinalIgnoreCase))
                return BadRequest();

            await SignIn(username);
            
            return Ok();
        }

        [HttpGet("Impersonate")]
        [AllowAnonymous]
        public async Task<IActionResult> Impersonate(string token) {
            if (string.IsNullOrWhiteSpace(token))
                return BadRequest();

            var key = Guid.Parse(config.SymmetricKey).ToByteArray();
            var signingKey = new SymmetricSecurityKey(key);
                
            var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ValidateAudience = false,
                    ValidateIssuer = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = signingKey,
                    ValidIssuer = "Hexamer",
                    ClockSkew = TimeSpan.Zero
                };
            SecurityToken securityToken;
            try
            {
                
                var principal = tokenHandler.ValidateToken(token, validationParameters, out securityToken);
                var name = principal.Identity.Name;
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest();

                await SignIn(principal.Identity.Name);
                return Redirect("/");
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("Impersonate")]
        public async Task<IActionResult> Impersonate([FromBody] ImpersonateRequest request)
        {
            var username = (request.Username ?? "").ToLower();
            if (string.IsNullOrEmpty(username))
                return BadRequest();

            await SignIn(username);
            
            return Ok();
        }

        [HttpPost("ImpersonateLink")]
        public IActionResult ImpersonateLink([FromBody] ImpersonateRequest request)
        {
            var username = (request.Username ?? "").ToLower();
            if (string.IsNullOrEmpty(username))
                return BadRequest();

            var identity = new ClaimsIdentity();
            identity.AddClaim(new Claim(identity.NameClaimType, username));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Guid.Parse(config.SymmetricKey).ToByteArray();
            var signingKey = new SymmetricSecurityKey(key);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddMinutes(20),
                Issuer = "Hexamer",
                //Lifetime = new Lifetime(DateTime.Now, DateTime.Now.Add(scadenza)),
                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256),
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var encodedToken = tokenHandler.WriteToken(token);

            var url = $"{Request.Scheme}://{Request.Host}/api/Admin/Impersonate?token=" + WebUtility.UrlEncode(encodedToken);
            
            return Ok(url);
        }

        private async Task SignIn(string username) {
            string hash;

            using (var md5 = MD5.Create()) {
                hash = BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(username))).Replace("-", "").ToLower();
            }
            var user = new User {
                Username = username,
                Name = username,
                Email = username,
                ImageUrl = $"https://www.gravatar.com/avatar/{hash}"
            };

            await authority.SignIn(user, HttpContext);
        }

        [HttpGet("Exams/{examId}")]
        public async Task<IActionResult> Index(string examId) {

            var language = Request.GetLanguage(config.DefaultLocalization);
            var exam = examRepository.GetById(examId, language);
            if (exam == null)
                return NotFound();

            var users = await userRepository.GetAll();
            var userScores = new List<ScoreResult>();
            IEnumerable<UserStatistics> stats = null;
            try {
                stats = statistics.GetStatistics(examId);
            } catch {

            }

             stats = stats ?? Enumerable.Empty<UserStatistics>();
            foreach (var user in users) {
                var answers = await answerRepository.GetAll(user.Name, examId);
                var stat = stats.FirstOrDefault(s => user.Name.Equals(s.Username, StringComparison.OrdinalIgnoreCase));
                string[] tokens = null;
                if (stat != null){
                    tokens = stat.Tokens.Select(pair => $"[{pair.Value.ToString("yyyyMMdd.HHmmss.fff")}]{pair.Key}").ToArray();
                }
                var scoreResult = ScoreResult.FromEntities(user, exam, answers, tokens ?? new string[0]);
                userScores.Add(scoreResult);
            }
            return Ok(userScores);
        }
    }
}