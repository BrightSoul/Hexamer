using System;
using System.Collections.Generic;
using System.Linq;

namespace Hexamer.Model.QuestionTypes
{
    public class Reorder : Question
    {
        public override double CalculateScore(string answerProvided, out bool isCorrectAnswer, out bool isCompleteAnswer)
        {
            isCorrectAnswer = false;
            isCompleteAnswer = false;
            return 0;
        }

        public override object GetQuestionData(string randomizationSeed)
        {
            return new
            {
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
