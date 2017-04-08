using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Model
{
    public abstract class Question : QuestionDefaults
    {
        public string Id { get; set; }
        public string CorrectAnswer { get; set; }
        public abstract double CalculateScore(string providedAnswer);
    }
}
