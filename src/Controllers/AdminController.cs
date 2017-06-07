using System;
using System.Collections.Generic;
using System.Linq;
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

        [HttpPost("Impersonate")]
        public async Task<IActionResult> Impersonate([FromBody] ImpersonateRequest request)
        {
            var username = (request.Username ?? "").ToLower();
            if (string.IsNullOrEmpty(username))
                return BadRequest();

            await SignIn(username);
            
            return Ok();
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