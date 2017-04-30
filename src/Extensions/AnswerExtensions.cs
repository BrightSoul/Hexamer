using System.Collections.Generic;
using System.Linq;
using Hexamer.Model;

namespace Hexamer.Extensions {
    public static class AnswerExtensions {
        public static IEnumerable<Answer> Answered(this IEnumerable<Answer> answers) {
            return answers.Where(a => a.Answered.HasValue && !string.IsNullOrEmpty(a.AnswerProvided));
        }
        public static IEnumerable<Answer> Bookmarked(this IEnumerable<Answer> answers) {
            return answers.Where(a => a.IsBookmarked);
        }
    }
}