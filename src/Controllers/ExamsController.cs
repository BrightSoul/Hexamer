using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hexamer.Model.Results;
using Hexamer.Services;
using Hexamer.Extensions;
using Hexamer.Model;
using System.IO;
using System.Threading.Tasks;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class ExamsController : Controller
    {
        private readonly IExamRepository examRepository;
        private readonly IAnswerRepository answerRepository;
        private readonly AppConfig config;

        public ExamsController(AppConfig config, IExamRepository examRepository, IAnswerRepository answerRepository)
        {
            this.examRepository = examRepository;
            this.answerRepository = answerRepository;
            this.config = config;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<ExamResult> Get()
        {
            var enabledExams = examRepository.GetAll().Visible().ToList();
            //TODO: join with user data from sqlite
            return enabledExams.Select(exam => ExamResult.FromEntity(exam));
        }
        
        [HttpGet("{id}/Begin")]
        public async Task<IActionResult> Begin(string id)
        {
            //TODO: Verifica che l'utente abbia tutte le domande richieste dall'esame
            var dto = examRepository.GetById(id);
            if (dto == null)
                return NotFound();

            var examResult = ExamResult.FromEntity(dto);
            var answers = await answerRepository.GetAll(User.Identity.Name, examResult.Id);
            examResult.SetScore(answers.Count(), answers.Sum(a => a.ScoreAwarded), answers.Max(a => a.Answered));
            return Ok(examResult);
        }
        [HttpGet("{id}/Image")]
        public IActionResult Image(string id) {
            var dataDirectory = config.ExamsDataDirectory;
            var examImage = Path.Combine(dataDirectory, id, "exam.jpg");
            if (!System.IO.File.Exists(examImage))
                examImage = Path.Combine(dataDirectory, "default-exam-image.jpg");
            return File(System.IO.File.OpenRead(examImage), "image/jpeg");
        }
    }
}
