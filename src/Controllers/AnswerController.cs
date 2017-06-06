using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hexamer.Model.Results;
using Hexamer.Services;
using Hexamer.Extensions;
using System.Threading.Tasks;
using Hexamer.Model.Requests;
using System.IO;
using Hexamer.Model;
using System;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class AnswerController : Controller
    {
        private readonly IExamRepository examRepository;
        private readonly IAnswerRepository answerRepository;
        private readonly IStatistics statistics;
        private readonly AppConfig config;
        public AnswerController(IExamRepository examRepository, IAnswerRepository answerRepository, IStatistics statistics, AppConfig config)
        {
            this.examRepository = examRepository;
            this.answerRepository = answerRepository;
            this.config = config;
            this.statistics = statistics;
        }

        [HttpPost("{examId}/{questionNumber}")]
        public async Task<IActionResult> Post(string examId, int questionNumber, [FromBody] AnswerRequest request)
        {
            var answer = await answerRepository.GetByNumber(User.Identity.Name, examId, questionNumber);
            if (answer == null)
                return NotFound("Answer");

            var exam = examRepository.GetById(examId, Request.GetLanguage(config.DefaultLocalization));
            if (exam == null)
                return NotFound("Exam");

            var question = exam.Questions.SingleOrDefault(q => q.Id == answer.Question);
            if (question == null)
                return NotFound("Question");

            var score = question.CalculateScore(request.AnswerProvided, out bool isCorrectAnswer, out bool isCompleteAnswer);
            var result = await answerRepository.UpdateAnswer(User.Identity.Name, examId, questionNumber, request.AnswerProvided, score, isCorrectAnswer, isCompleteAnswer);

            var token = User.Identity.Token(HttpContext);
            statistics.LogQuestionAnswered(User.Identity.Name, User.Identity.Token(HttpContext), examId, question.Id, answer.Number, answer.ScoreAwarded ?? 0.0, answer.IsCorrectAnswer);

            return Ok();
        }


        [HttpPost("{examId}/{questionNumber}/Bookmark")]
        public async Task<IActionResult> Bookmark(string examId, int questionNumber, [FromBody] BookmarkRequest request)
        {
            var result = await answerRepository.UpdateBookmark(User.Identity.Name, examId, questionNumber, request.IsBookmarked);
            if (result)
                return Ok();
            else
                return NotFound();
        }
    }
}
