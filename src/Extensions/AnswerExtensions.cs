using System.Collections.Generic;
using System.Linq;
using Hexamer.Model;

namespace Hexamer.Extensions {
    public static class AnswerExtensions {
        public static IEnumerable<Answer> Answered(this IEnumerable<Answer> answers) {
            return answers.Where(a => a.IsCompleteAnswer);
        }
        public static IEnumerable<Answer> Correct(this IEnumerable<Answer> answers) {
            return answers.Where(a => a.IsCorrectAnswer);
        }
        public static IEnumerable<Answer> Bookmarked(this IEnumerable<Answer> answers) {
            return answers.Where(a => a.IsBookmarked);
        }
    }
}