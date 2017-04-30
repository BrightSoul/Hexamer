using Hexamer.Model;
using System.Collections.Generic;

namespace Hexamer.Services
{
    public interface IExamRepository
    {
        IEnumerable<Exam> GetAll(string language);
        Exam GetById(string id, string language);
    }
}
