namespace Hexamer.Services {
    public interface ILogger {
        void LogQuestionAnswered(string username, string token, string examId, string questionId, int questionNumber, double score);
        void LogQuestionDisplayed(string username, string token, string examId, string questionId, int questionNumber);
        void LogExamCompleted(string username, string token, string examId, decimal score, decimal normalizedScore);
    }
}