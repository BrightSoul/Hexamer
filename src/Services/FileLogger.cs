using System;
using System.IO;
using Hexamer.Model;

namespace Hexamer.Services {
    public class FileLogger : ILogger
    {
        private readonly string filePath;
        private static object fileLock = new Object();
        public FileLogger(AppConfig config)
        {
            filePath = Path.Combine(config.ExamsDataDirectory, "log.txt");
        }
        
        public void LogExamCompleted(string username, string token, string examId, decimal score, decimal normalizedScore)
        {
            throw new NotImplementedException();
        }
        public void LogQuestionAnswered(string username, string token, string examId, string questionId, int questionNumber, double score)
        {
            throw new NotImplementedException();
        }
        public void LogQuestionDisplayed(string username, string token, string examId, string questionId, int questionNumber)
        {
            throw new NotImplementedException();
        }

        private void Log(string type, string username, string token, string examId, params string[] text) {
            lock (fileLock) {
                try {
                    string additionalText = text != null ? string.Join("\t", text) : string.Empty;
                    File.AppendAllText(filePath, $"\r\n{DateTime.Now.ToString("yyyyMMdd.HHmmss.fff")}\t{type}\t{username}\t{token}\t{examId}\t{additionalText}");
                } catch {
                }
            }
        }
    }
}