using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class ResourcesController : Controller
    {

        [HttpGet("{exam}/{question}/question")]
        public string GetQuestion(string exam, string question)
        {
            return null;
        }

        [HttpGet("{exam}/{question}/question")]
        public string GetAnswer(string exam, string question)
        {
            return null;
        }
    }
}
