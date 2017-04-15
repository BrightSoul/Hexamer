using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Model.Results
{
    public class QuestionResult
    {
        public string Id { get; set; }
        public int Number { get; set; }
        public bool Answered { get; set; }
        public bool MarkedForReview { get; set; }
    }
}
