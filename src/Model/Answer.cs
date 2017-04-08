using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Model
{
    public class Answer
    {
        public string Exam { get; set; }
        public string Question { get; set; }
        public int Number { get; set; }
        public string AnswerProvided { get; set; }
        public double? ScoreAwarded { get; set; }
        public bool IsCorrectAnswer { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Answered { get; set; }

    }
}
