using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using Hexamer.Model;

namespace Hexamer.Services {
    public class FileStatistics : IStatistics
    {
        private readonly string filePath;
        private static object fileLock = new Object();
        private static CultureInfo culture = CultureInfo.InvariantCulture;
        private const string ExamType = "exam";
        private const string DisplayType = "display";
        private const string AnswerType = "answer";
        private const string dateFormat = "yyyyMMdd.HHmmss.fff";

        public FileStatistics(AppConfig config)
        {
            filePath = Path.Combine(config.ExamsDataDirectory, "log.txt");
        }
        
        public void LogExamCompleted(string username, string token, string examId, decimal score)
        {
            Log(ExamType, username, token, examId, score.ToString(culture));
        }
        public void LogQuestionAnswered(string username, string token, string examId, string questionId, int questionNumber, double score, bool isCorrect)
        {
            Log(AnswerType, username, token, examId, questionId, questionNumber.ToString(culture), score.ToString(culture), isCorrect.ToString());
        }
        public void LogQuestionDisplayed(string username, string token, string examId, string questionId, int questionNumber)
        {
            Log(DisplayType, username, token, examId, questionId, questionNumber.ToString(culture));
        }

        public IEnumerable<UserStatistics> GetStatistics(string examId)
        {
            var stats = new Dictionary<string, UserStatistics>();
            lock (fileLock) {
                using (var sr = new StreamReader(File.OpenRead(filePath))) {
                    while (!sr.EndOfStream) {
                        var line = sr.ReadLine();
                        if (string.IsNullOrEmpty(line))
                            continue;
                        
                        var parts = line.Split('\t');
                        if (parts.Length < 5)
                            continue;
                        
                        if (parts[4] != examId)
                            continue;

                        DateTime.TryParseExact(parts[0], dateFormat, culture, DateTimeStyles.AssumeLocal, out DateTime date);
                        var type = parts[1];
                        var token = parts[3];
                        var username = parts[2];

                        UserStatistics stat;
                        if (stats.ContainsKey(username)) {
                            stat = stats[username];
                        } else {
                            stat = new UserStatistics { Username = username };
                            stats.Add(username, stat);
                        }
                        
                        stat.AddToken(token, date);
                        try {
                        switch (type) {
                            case ExamType:
                                stat.Score = decimal.Parse(parts[5], culture);
                                break;
                            case AnswerType:
                                var questionId = parts[5];
                                var isCorrect = bool.Parse(parts[7]);
                                stat.AddAnswer(questionId, isCorrect);
                                break;
                            case DisplayType:

                                break;
                        }
                        } catch {

                        }
                    }
                }
            }
            return stats.Values;
        }
        private void Log(string type, string username, string token, string examId, params string[] text) {
            lock (fileLock) {
                try {
                    string additionalText = text != null ? string.Join("\t", text) : string.Empty;
                    File.AppendAllText(filePath, $"{Environment.NewLine}{DateTime.Now.ToString(dateFormat, culture)}\t{type}\t{username}\t{token}\t{examId}\t{additionalText}");
                } catch {
                }
            }
        }
    }
}