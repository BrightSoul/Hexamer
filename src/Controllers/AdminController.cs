using System;
using System.Collections.Generic;
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
        private readonly AppConfig config;
        public AdminController(IExamRepository examRepository, IUserRepository userRepository, IAnswerRepository answerRepository, IAuthority authority, AppConfig config)
        {
            this.userRepository = userRepository;
            this.answerRepository = answerRepository;
            this.examRepository = examRepository;
            this.authority = authority;
            this.config = config;
        }

        [HttpPost("Impersonate")]
        public async Task<IActionResult> Impersonate([FromBody] ImpersonateRequest impersonateRequest)
        {
            var username = (impersonateRequest.Username ?? "").ToLower();
            if (string.IsNullOrEmpty(username))
                return BadRequest();
            string hash;

            using (var md5 = MD5.Create()) {
                hash = BitConverter.ToString(md5.ComputeHash(Encoding.UTF8.GetBytes(username))).Replace("-", "").ToLower();
            }
            var user = new User {
                Username = username ,
                Name = username,
                Email = username,
                ImageUrl = $"https://www.gravatar.com/avatar/{hash}"
            };

            await authority.SignIn(user, HttpContext);
            return Ok();
        }

        [HttpGet("Exams/{examId}")]
        public async Task<IActionResult> Index(string examId) {

            var language = Request.GetLanguage(config.DefaultLocalization);
            var exam = examRepository.GetById(examId, language);
            if (exam == null)
                return NotFound();

            var users = await userRepository.GetAll();
            var userScores = new List<ScoreResult>();
            foreach (var user in users) {
                var answers = await answerRepository.GetAll(user.Name, examId);
                //TODO: estrai i token
                var scoreResult = ScoreResult.FromEntities(user, exam, answers, new string[] {});
                userScores.Add(scoreResult);
            }
            return Ok(userScores);
        }
    }
}