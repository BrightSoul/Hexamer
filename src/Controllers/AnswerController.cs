using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hexamer.Model.Results;
using Hexamer.Services;
using Hexamer.Extensions;
using System.Threading.Tasks;
using Hexamer.Model.Requests;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class AnswerController : Controller
    {
        private readonly IExamRepository examRepository;
        private readonly IAnswerRepository answerRepository;

        public AnswerController(IExamRepository examRepository, IAnswerRepository answerRepository)
        {
            this.examRepository = examRepository;
            this.answerRepository = answerRepository;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<ExamResult> Get()
        {
            var language = Request.GetLanguage();
            var enabledExams = examRepository.GetAll(language).Visible().ToList();
            //TODO: join with user data from sqlite
            return enabledExams.Select(exam => ExamResult.FromEntity(exam));
        }
        

        [HttpPost("{examId}/{questionNumber}/Bookmark")]
        public async Task<IActionResult> Bookmark(string examId, int questionNumber, [FromBody] BookmarkRequest request) {
            await answerRepository.UpdateBookmark(User.Identity.Name, examId, questionNumber, request.Bookmarked );
            return Ok();
        }
    }
}
