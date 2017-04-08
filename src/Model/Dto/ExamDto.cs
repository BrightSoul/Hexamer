using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hexamer.Model.Dto
{
    public class ExamDto
    {
        private ExamDto(Exam exam)
        {
            Id = exam.Id;
            Title = exam.Title;
            NumberOfQuestions = exam.NumberOfQuestions;
            ValidTo = exam.ValidTo;
        }

        public static ExamDto FromEntity(Exam exam)
        {
            if (exam == null)
                return null;

            return new ExamDto(exam);
        }

        public string Id { get; set; }
        public string Title { get; set; }
        public int NumberOfQuestions { get; set; }
        public int NumberOfQuestionsAnswered { get; set; }
        public double? Score { get; set; }
        public DateTime? ValidTo { get; set; }
        public List<string> Questions { get; set; }
    }
}
