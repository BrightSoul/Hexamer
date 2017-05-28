using System.Security.Principal;
namespace Hexamer.Model.Results
{
    public class QuestionResult
    {
        public string ExamId { get; set; }
        public int Number { get; set; }
        public string Type {get; set;}
        public string Text {get; set;}
        public string AnswerProvided { get; set;}
        public string AnswerText { get; set; }
        public string CorrectAnswer { get; set; }
        public bool IsBookmarked { get; set; }
        public object QuestionData { get; set; }
        public bool CanShowAnswer {get;set;}
        public static object FromEntities(ExamResult exam, Question question, Answer answer, IIdentity user)
        {
            return new QuestionResult {
                ExamId = exam.Id,
                Number = answer.Number,
                Type = question.Type,
                Text = question.Text,
                CanShowAnswer = exam.CanShowAnswer,
                IsBookmarked = answer.IsBookmarked,
                AnswerProvided = answer.AnswerProvided,
                AnswerText = exam.CanShowAnswer ? question.AnswerText : string.Empty,
                CorrectAnswer = exam.CanShowAnswer ? question.CorrectAnswer : string.Empty,
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