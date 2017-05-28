using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hexamer.Model.Results;
using Hexamer.Services;
using Hexamer.Extensions;
using Hexamer.Model;
using System.IO;
using System.Threading.Tasks;
using System;

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
        public async Task<IEnumerable<ExamResult>> GetAll()
        {
            string language = Request.GetLanguage();
            var enabledExams = examRepository.GetAll(language).Visible().ToList();
            var examResults = enabledExams.Select(exam => ExamResult.FromEntity(exam, language)).ToList();
            foreach (var examResult in examResults)
            {
                var answers = await answerRepository.GetAll(User.Identity.Name, examResult.Id);
                examResult.SetScore(answers);
                if (examResult.IsNewlyCompleted)
                {
                    try
                    {
                        System.IO.File.AppendAllText(Path.Combine(config.ExamsDataDirectory, "examlog.txt"), $"{DateTime.Now.ToString("yyyyMMddHHmmss")}\t{User.Identity.Name}\t{examResult.Score}\r\n");
                    }
                    catch
                    {

                    }
                }
            }
            return examResults;
        }

        [HttpGet("{examId}")]
        public async Task<IActionResult> Detail(string examId)
        {
            string language = Request.GetLanguage();
            var exam = examRepository.GetById(examId, language);
            if (exam == null)
                return NotFound();

            if (await answerRepository.CreateMissingAnswers(User.Identity.Name, exam))
            {
                exam = examRepository.GetById(examId, language);
            }
            var examResult = ExamResult.FromEntity(exam, language);
            var answers = await answerRepository.GetAll(User.Identity.Name, examResult.Id);
            examResult.SetScore(answers);
            return Ok(examResult);
        }

        [HttpGet("{examId}/Image")]
        public IActionResult Image(string examId, string path)
        {
            string language = Request.GetLanguage();
            var exam = examRepository.GetById(examId, language);
            if (exam == null || !exam.CanOpen)
                return NotFound();

            string contentPath = null;
            if (string.IsNullOrEmpty(path))
            {
                contentPath = Path.Combine(config.ExamsDataDirectory, exam.Id, "exam.jpg");
                if (!System.IO.File.Exists(contentPath))
                    contentPath = Path.Combine(config.ExamsDataDirectory, "default-exam-image.jpg");
            }
            else
            {
                contentPath = Path.Combine(config.ExamsDataDirectory, exam.Id, "content", Path.GetFileName(path));
            }

            if (!System.IO.File.Exists(contentPath))
                return NotFound();
            var extension = Path.GetExtension(contentPath).Trim('.').ToLowerInvariant();
            Stream contentStream = System.IO.File.OpenRead(contentPath);
            switch (extension)
            {
                case "gif":
                    return File(contentStream, "image/gif");
                case "jpg":
                case "jpeg":
                    return File(contentStream, "image/jpeg");
                case "png":
                    return File(contentStream, "image/png");
                default:
                    return NotFound();
            }
        }

        [HttpGet("{examId}/{questionNumber}")]
        public async Task<IActionResult> QuestionDetail(string examId, int questionNumber)
        {
            var language = Request.GetLanguage();

            var answer = await answerRepository.GetByNumber(User.Identity.Name, examId, questionNumber);
            if (answer == null)
                return NotFound("Answer");

            var exam = examRepository.GetById(examId, Request.GetLanguage());
            if (exam == null)
                return NotFound("Exam");

            var question = exam.Questions.SingleOrDefault(q => q.Id == answer.Question);
            if (question == null)
                return NotFound("Question");

            var examResult = ExamResult.FromEntity(exam, language);
            var answers = await answerRepository.GetAll(User.Identity.Name, examResult.Id);
            examResult.SetScore(answers);

            var result = QuestionResult.FromEntities(examResult, question, answer, User.Identity);
            await answerRepository.UpdateDisplayed(User.Identity.Name, examId, questionNumber);
            return Ok(result);
        }

        [HttpPost("{examId}")]
        public async Task<IActionResult> Reset(string examId)
        {
            var exam = examRepository.GetById(examId, Request.GetLanguage());
            if (exam == null)
                return NotFound("Exam");

            if (!exam.CanReset)
                return BadRequest("Can't reset");

            await answerRepository.Reset(User.Identity.Name, examId);
            return Ok();
        }
    }
}
