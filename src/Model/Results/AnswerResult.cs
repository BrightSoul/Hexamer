using System;
using System.Security.Principal;

namespace Hexamer.Model.Results
{
    public class AnswerResult
    {
        public string Type {get; set;}
        public string Text {get; set;}
        public string AnswerProvided { get; set;}
        public string AnswerText { get; set; }
        public string CorrectAnswer { get; set; }
        public bool IsBookmarked { get; set; }
        public object QuestionData { get; set; }
        public static object FromEntities(Exam exam, Question question, Answer answer, IIdentity user)
        {
            return new AnswerResult {
                Type = question.Type,
                Text = question.Text,
                IsBookmarked = answer.IsBookmarked,
                AnswerProvided = answer.AnswerProvided,
                AnswerText = exam.CanShowAnswer ? question.AnswerText : null,
                CorrectAnswer = exam.CanShowAnswer ? question.CorrectAnswer : null,
                QuestionData = question.GetQuestionData(GetRandomizationSeed(answer.Number, user.Name))
            };
        }

        private static string GetRandomizationSeed(int number, string name)
        {
            if (string.IsNullOrEmpty(name))
                return string.Empty;
            
            number = number % name.Length;
            if (number == 0)
                return name;

            return name.Substring(number) + name.Substring(0, number);
        }
    }
}
