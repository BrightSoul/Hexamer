using Hexamer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Services
{
    public interface IAnswerRepository
    {
        Task<IEnumerable<Answer>> GetAll(string username, string exam);
        Task<Answer> GetById(string username, string exam, string question);
        Task Create(string username, IEnumerable<Answer> answer);
        Task UpdateAnswer(string username, Answer answer);
        Task UpdateMark(string username, string exam, string question, bool marked);
    }
}
