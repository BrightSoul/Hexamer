using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CommonMark;
using CommonMark.Syntax;
using System.Net;

namespace Hexamer.Model
{
    public class Exam
    {
        public string Id { get; set; }
        public string DefaultLanguage { get; set; }
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public decimal MinimumScore { get; set; }
        public decimal MaximumScore { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public bool Hidden { get; set; }

        public static Exam FromFile(string fileName, string language = null)
        {
            var json = File.ReadAllText(fileName);
            var jObject = JsonConvert.DeserializeObject(json) as JObject;

            var supportedLanguages = (jObject["SupportedLanguages"] as JArray).Select(token => token.Value<string>()).ToList();
            if (!supportedLanguages.Contains(language))
            {
                var normalizedLanguage = (language ?? "").Split('-').First();
                language = null;
                foreach (var supportedLanguage in supportedLanguages)
                {
                    if (supportedLanguage.Equals(normalizedLanguage, StringComparison.OrdinalIgnoreCase))
                    {
                        language = supportedLanguage;
                    }
                }
            }
            if (string.IsNullOrEmpty(language))
            {
                if (jObject["DefaultLanguage"] != null)
                {
                    language = jObject["DefaultLanguage"].Value<string>();
                }
                else
                {
                    language = supportedLanguages.First();
                }
            }

            jObject = FixLanguage(jObject, language, "Title", "Subtitle");

            var exam = jObject.ToObject<Exam>();
            //new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Objects }

            //TODO: find a better way to change the jObject to Exam
            exam.Id = Path.GetFileName(Path.GetDirectoryName(fileName));
            exam.Questions = GetQuestionsFromFilename(exam.Id, fileName, language);
            return exam;
        }

        private static List<Question> GetQuestionsFromFilename(string examId, string fileName, string language)
        {
            var questionList = new List<Question>();
            var questionsDirectory = Path.Combine(Path.GetDirectoryName(fileName), "questions");
            var questions = Directory.GetFiles(questionsDirectory, "*.json").Select(file =>
                new
                {
                    Id = Path.GetFileNameWithoutExtension(file),
                    Content = JsonConvert.DeserializeObject(File.ReadAllText(file)) as JObject
                }
            ).ToList();
            foreach (var question in questions)
            {
                var jObject = FixTypes(question.Content);
                jObject = FixLanguage(jObject, language, "Text", "AnswerText", "Options[*].Text", "CodeText");
                var serialized = JsonConvert.SerializeObject(jObject);
                var q = JsonConvert.DeserializeObject(serialized, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Objects }) as Question;
                q.Id = question.Id;
                q.AnswerText = GetMarkupFromMarkdown(examId, q.AnswerText);
                q.Text = GetMarkupFromMarkdown(examId, q.Text);
                questionList.Add(q);
            }
            return questionList;
        }

        private static string GetMarkupFromMarkdown(string examId, string text)
        {
            var document = CommonMarkConverter.Parse(text);

            // walk the document node tree
            foreach (var node in document.AsEnumerable())
            {
                if (
                    // start and end of each node may be visited separately
                    node.IsOpening
                    // blocks are elemets like paragraphs and lists, inlines are
                    // elements like emphasis, links, images.
                    && node.Inline != null
                    && node.Inline.Tag == InlineTag.Image)
                {
                    node.Inline.TargetUrl = $"/api/Exams/{examId}/Image?path={WebUtility.UrlEncode(Path.GetFileName(node.Inline.TargetUrl))}";
                }
            }

            using (var writer = new System.IO.StringWriter())
            {
                // write the HTML output
                CommonMarkConverter.ProcessStage3(document, writer);
                return writer.ToString();
            }
        }

        private static JObject FixTypes(JObject jObject)
        {
            string defaultType = null;

            //TODO: Fix this implementation
            var oldObject = jObject;
            jObject = new JObject();
            var currentType = oldObject["Type"];
            var typeName = currentType == null ? defaultType : currentType.Value<string>();

            var fullTypeName = $"Hexamer.Model.QuestionTypes.{typeName}, Hexamer";
            //fullTypeName = "Hexamer.Model.QuestionTypes.MultipleChoice, Hexamer";
            jObject["$type"] = fullTypeName;
            foreach (var property in oldObject.OfType<JProperty>())
            {
                jObject[property.Name] = property.Value;
            }
            return jObject;
        }

        private static JObject FixLanguage(JObject jObject, string language, params string[] selectors)
        {
            foreach (var selector in selectors)
            {
                var tokens = jObject.SelectTokens(selector);
                foreach (var token in tokens)
                {
                    var property = token.Parent as JProperty;
                    property.Value = new JValue(token[language].Value<string>());
                }
            }
            return jObject;
        }

        public bool CanShowAnswer
        {
            get
            {
                return !Hidden && !ValidTo.HasValue && (!ValidFrom.HasValue || ValidFrom.Value < DateTime.Now);
            }
        }
        public bool CanOpen
        {
            get
            {
                return !Hidden && (!ValidTo.HasValue || ValidTo.Value > DateTime.Now) && (!ValidFrom.HasValue || ValidFrom.Value < DateTime.Now);
            }
        }

        public bool CanReset
        {
            get
            {
                return !Hidden && (!ValidTo.HasValue || ValidTo.Value > DateTime.Now) && (!ValidFrom.HasValue || ValidFrom.Value < DateTime.Now);
            }
        }

        public List<Question> Questions { get; set; }
        public List<Group> Groups { get; set; }

    }
}