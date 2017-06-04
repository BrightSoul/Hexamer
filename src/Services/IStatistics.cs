using System.Collections.Generic;
using Hexamer.Model;

namespace Hexamer.Services {
    public interface IStatistics {
        void LogQuestionAnswered(string username, string token, string examId, string questionId, int questionNumber, double score, bool isCorrect);
        void LogQuestionDisplayed(string username, string token, string examId, string questionId, int questionNumber);
        void LogExamCompleted(string username, string token, string examId, decimal score);
        IEnumerable<UserStatistics> GetStatistics(string examId);
    }
}