using Microsoft.AspNetCore.Mvc;
using Hexamer.Services;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class ScoreController : Controller
    {
        private readonly IExamRepository examRepository;

        public ScoreController(IExamRepository examRepository)
        {
            this.examRepository = examRepository;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(string id)
        {
            //TODO: Verifica che l'utente abbia tutte le domande richieste dall'esame
            return null;
        }
    }
}
