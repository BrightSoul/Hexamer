using Hexamer.Model;
using System.Collections.Generic;

namespace Hexamer.Services
{
    public interface IExamRepository
    {
        IEnumerable<Exam> GetAll();
        Exam GetById(string id);
    }
}
