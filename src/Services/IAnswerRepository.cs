using Hexamer.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hexamer.Services
{
    public interface IAnswerRepository
    {
        Task<IEnumerable<Answer>> GetAll(string username, string exam);
        Task<Answer> GetById(string username, string exam, string question);
        Task<Answer> GetByNumber(string username, string exam, int questionNumber);
        Task<bool> CreateMissingAnswers(string username, Exam exam);
        Task UpdateAnswer(string username, Answer answer);
        Task UpdateDisplayed(string username, string examId, int questionNumber);
        Task UpdateBookmark(string username, string examId, int questionNumber, bool bookmarked);
    }
}
