namespace Hexamer.Model.Results
{
    public class QuestionResult
    {
        private QuestionResult(Question question, Answer answer)
        {
            this.Id = question.Id;
            this.Text = question.Text;
            if (answer != null) {
                this.Number = answer.Number;
                this.Answered = answer.Answered.HasValue;
                this.IsBookmarked = answer.IsBookmarked;
                this.AnswerProvided = answer.AnswerProvided;
            }
        }
        public string Id { get; set; }
        public string Text { get; private set; }
        public int Number { get; private set; }
        public string AnswerProvided {get; private set;}
        public bool Answered { get; private set; }
        public bool IsBookmarked { get; private set; }

        public static QuestionResult FromEntity(Question question, Answer answer) {
            return new QuestionResult(question, answer);
        }
    }
}