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
        public abstract double CalculateScore(string providedAnswer);
    }
}
