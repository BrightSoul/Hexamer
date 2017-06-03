using System.Collections.Generic;
using System.Threading.Tasks;
using Hexamer.Extensions;
using Hexamer.Model;
using Hexamer.Model.Results;
using Hexamer.Results;
using Hexamer.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly IUserRepository userRepository;
        private readonly IAnswerRepository answerRepository;
        private readonly IExamRepository examRepository;
        private readonly AppConfig config;
        public AdminController(IExamRepository examRepository, IUserRepository userRepository, IAnswerRepository answerRepository, AppConfig config)
        {
            this.userRepository = userRepository;
            this.answerRepository = answerRepository;
            this.examRepository = examRepository;
            this.config = config;
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
                var scoreResult = ScoreResult.FromEntities(user, exam, answers);
                userScores.Add(scoreResult);
            }
            return Ok(userScores);
        }
    }
}