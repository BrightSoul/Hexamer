using Hexamer.Model;
using System.Collections.Generic;
using System.Linq;

namespace Hexamer.Extensions
{
    public static class ExamExtensions
    {
        public static IEnumerable<Exam> Visible(this IEnumerable<Exam> exams)
        {
            return exams.Where(exam => exam.CanTakeExam || exam.CanShowScore);
        }

        public static IEnumerable<Exam> Takeable(this IEnumerable<Exam> exams)
        {
            return exams.Where(exam => exam.CanTakeExam);
        }
    }
}
