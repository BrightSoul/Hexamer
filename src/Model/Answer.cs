using System;

namespace Hexamer.Model
{
    public class Answer
    {
        public Answer()
        {
            Created = DateTime.Now;
        }
        public string Exam { get; set; }
        public string Question { get; set; }
        public int Number { get; set; }
        public string AnswerProvided { get; set; }
        public bool IsBookmarked { get; set; }
        public double? ScoreAwarded { get; set; }
        public bool IsCorrectAnswer { get; set; }
        public bool IsCompleteAnswer { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Displayed { get; set; }
        public DateTime? Answered { get; set; }
    }
}