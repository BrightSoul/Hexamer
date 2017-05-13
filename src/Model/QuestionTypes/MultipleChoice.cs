using System;
using System.Collections.Generic;

namespace Hexamer.Model.QuestionTypes
{
    public class MultipleChoice : Question
    {
        public override double CalculateScore(string answerProvided, out bool isCorrectAnswer, out bool isCompleteAnswer)
        {
            isCorrectAnswer = false;
            isCompleteAnswer = false;
            if (string.IsNullOrEmpty(answerProvided))
                return 0;
            
            var score = ScoreAwarded;
            var provided = new HashSet<string>(answerProvided.ToLowerInvariant().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries));
            var correct = new HashSet<string>(CorrectAnswer.ToLowerInvariant().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries));

            if (provided.Count > correct.Count)
                return 0;

            var penaltyWeights = new [] {1, 0.75, 0.5, 0.4, 0.3, 0.25, 0.2};
            var penaltyIndex = Math.Min(penaltyWeights.Length, correct.Count)-1;

            foreach (var c in correct) {
                if (!provided.Contains(c)) {
                    score -= (ScoreAwarded * penaltyWeights[penaltyIndex]);
                    penaltyIndex = Math.Max(0, penaltyIndex-1);
                }
            }
            isCorrectAnswer = score == ScoreAwarded;
            isCompleteAnswer = provided.Count == correct.Count;
            return Math.Max(0, score);
        }

        public MultipleChoiceOption[] Options {
            get; set;
        }

        private int Choose {
            get {
                return CorrectAnswer.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).Length;
            }
        }

        public override object GetQuestionData(string randomizationSeed) {
            return new {
                Choose = Choose,
                Options = SortList(Options, randomizationSeed)
            };
        }
    }

    public class MultipleChoiceOption {
        public string Id {get;set;}
        public string Text {get;set;}
    }
}
