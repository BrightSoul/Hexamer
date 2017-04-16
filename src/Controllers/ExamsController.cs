using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hexamer.Model.Results;
using Hexamer.Services;
using Hexamer.Extensions;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class ExamsController : Controller
    {
        private readonly IExamRepository examRepository;
        private readonly IAnswerRepository answerRepository;

        public ExamsController(IExamRepository examRepository, IAnswerRepository answerRepository)
        {
            this.examRepository = examRepository;
            this.answerRepository = answerRepository;
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<ExamResult> Get()
        {
            var enabledExams = examRepository.GetAll().Visible().ToList();
            //TODO: join with user data from sqlite
            return enabledExams.Select(exam => ExamResult.FromEntity(exam));
        }
        
        [HttpGet("{id}/start")]
        public IActionResult Start(string id)
        {
            //TODO: Verifica che l'utente abbia tutte le domande richieste dall'esame
            var dto = examRepository.GetById(id);
            if (dto == null)
                return NotFound();

            return Ok(ExamResult.FromEntity(dto));
        }
    }
}
