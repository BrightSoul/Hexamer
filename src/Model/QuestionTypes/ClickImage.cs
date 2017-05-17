using System;
using System.Collections.Generic;
using System.Linq;

namespace Hexamer.Model.QuestionTypes
{
    public class ClickImage : Question
    {
        public override double CalculateScore(string answerProvided, out bool isCorrectAnswer, out bool isCompleteAnswer)
        {
            isCorrectAnswer = false;
            isCompleteAnswer = false;
            if (string.IsNullOrEmpty(answerProvided))
                return 0;

            var coordinates = answerProvided.Split(',');
            if (coordinates.Length != 2)
                return 0;

            if (!int.TryParse(coordinates[0], out int userX))
                return 0;
            if (!int.TryParse(coordinates[1], out int userY))
                return 0;

            isCompleteAnswer = true;

            var answerCoordinates = CorrectAnswer.Split(',').Select(c => int.Parse(c)).ToArray();
            if (userX < answerCoordinates[0] || userX > answerCoordinates[0]+answerCoordinates[2])
                return 0;
            
            if (userY < answerCoordinates[1] || userY > answerCoordinates[1]+answerCoordinates[3])
                return 0;
            
            isCorrectAnswer = true;
            return ScoreAwarded;
            
        }

        public string Image {
            get; set;
        }

        public override object GetQuestionData(string randomizationSeed) {            
            return new {
                Image = Image
            };
        }
    }
}
