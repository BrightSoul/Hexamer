using System;
using System.Collections.Generic;
using System.Linq;
using Hexamer.Extensions;

namespace Hexamer.Model.QuestionTypes
{
    public class Reorder : Question
    {
        public override double CalculateScore(string answerProvided, out bool isCorrectAnswer, out bool isCompleteAnswer)
        {
            isCorrectAnswer = false;
            isCompleteAnswer = false;

            if (string.IsNullOrEmpty(answerProvided))
                return 0;

            var answerIds = answerProvided.ToLowerInvariant().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);
            var correctIds = CorrectAnswer.ToLowerInvariant().Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries);

            if (answerIds.Length > correctIds.Length)
                return 0;

            var distance = answerIds.LevenshteinDistance(correctIds);
            var penaltyWeights = new [] {1, 0.75, 0.5, 0.4, 0.3, 0.25, 0.2};
            var startIndex = correctIds.Length-1;
            var score = ScoreAwarded;
            for (var i=distance-1; i>=0; i--) {
                score -= penaltyWeights[i];
            }

            isCompleteAnswer = answerIds.Length == correctIds.Length;
            isCorrectAnswer = distance == 0;

            return Math.Max(0, score);
        }

        public override object GetQuestionData(string randomizationSeed)
        {
            return new
            {
                Choose = CorrectAnswer.Split(",".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).Length,
                Options = Options
            };
        }

        public ReorderOption[] Options
        {
            get; set;
        }


    }

    public class ReorderOption
    {
        public string Id { get; set; }
        public string Text { get; set; }
    }


}
