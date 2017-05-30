using System;
using System.Collections.Generic;
using System.Linq;
using Hexamer.Extensions;

namespace Hexamer.Model.Results {
    public class ScoreResult {
        private ScoreResult(User user, Exam exam, IEnumerable<Answer> answers)
        {
            Username = user.Name;
            AnsweredQuestions = answers.Answered().Count();
            CorrectQuestions = answers.Correct().Count();
            Score = answers.Sum(answer => answer.ScoreAwarded ?? 0.0);
            NormalizedScore = Math.Min(exam.MaximumScore, ExamResult.NormalizeScore(Convert.ToDecimal(Score)));
            Tokens = new [] { "Token" };
        }
        public string Username {get; private set;}
        public int AnsweredQuestions {get; private set;}
        public int CorrectQuestions {get; private set;}
        public string[] Tokens { get; private set; }
        public double Score { get; private set; }
        public decimal NormalizedScore { get; private set; }
        public static ScoreResult FromEntities(User user, Exam exam, IEnumerable<Answer> answers) {
            return new ScoreResult(user, exam, answers);
        }
    }
}