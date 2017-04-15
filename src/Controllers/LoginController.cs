using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        
    

        // GET api/values
        [HttpPost]
        public async Task<string> Post()
        {
            return "ciao sono il token";
        }
    }
}
