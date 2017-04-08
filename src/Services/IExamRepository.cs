using Hexamer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Services
{
    public interface IExamRepository
    {
        IEnumerable<Exam> GetAll();
        Exam GetById(string id);
    }
}
