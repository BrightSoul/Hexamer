using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Hexamer.Model
{
    public abstract class Question 
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Group { get; set; }
        public double ScoreAwarded { get; set; }
        public string Type { get; set; }
        public string AnswerText { get; set; }
        public string CorrectAnswer { get; set; }
        public abstract object GetQuestionData(string randomizationSeed);
        public abstract double CalculateScore(string answerProvided, out bool isCorrectAnswer, out bool isCompleteAnswer);

        protected IList<T> SortList<T>(IEnumerable<T> items, string randomizationSeed) {
            if (items == null)
                return new List<T>();
            
            var list = items.ToList();

            if (string.IsNullOrEmpty(randomizationSeed))
                return list;
            
            while (randomizationSeed.Length < list.Count) {
                randomizationSeed += randomizationSeed;
            }
            
            int index = 0;
            return list.OrderBy(l => {
                byte value = (byte) randomizationSeed[Math.Min(index, randomizationSeed.Length-1)];
                index++;
                return value;
            }).ToList();
        }
    }
}
