using System;
using System.Collections.Generic;
using System.Linq;

namespace Hexamer.Model {
    public class UserStatistics {
        private readonly Dictionary<string, bool> answers;
        public UserStatistics()
        {
            Tokens = new Dictionary<string, DateTime>();
            answers = new Dictionary<string, bool>();
        }
        public string Username { get; set; }
        public Dictionary<string, DateTime> Tokens { get; set; }
        public decimal Score { get; set; }
        public int Answers { get { return answers.Count; } }
        public int CorrectAnswers { get { return answers.Values.Count(correct => correct); } }

        public void AddToken(string token, DateTime date) {
            if (!Tokens.ContainsKey(token)) {
                Tokens.Add(token, DateTime.MinValue);
            }
            var previousDate = Tokens[token];
            if (previousDate < date) {
                Tokens[token] = date;
            }
        }
        public void AddAnswer(string answerId, bool isCorrect) {
            if (!answers.ContainsKey(answerId)) {
                answers.Add(answerId, false);
            }
            answers[answerId] = isCorrect;
        }
    }
}