using System.Collections.Generic;
using System.Threading.Tasks;
using Hexamer.Extensions;
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
        public AdminController(IExamRepository examRepository, IUserRepository userRepository, IAnswerRepository answerRepository)
        {
            this.userRepository = userRepository;
            this.answerRepository = answerRepository;
            this.examRepository = examRepository;
        }

        [HttpGet("Exams/{examId}")]
        public async Task<IActionResult> Index(string examId) {

            var language = Request.GetLanguage();
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