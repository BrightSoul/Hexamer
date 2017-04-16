using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Hexamer.Model
{
    public class Exam
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime? ValidFrom { get; set; }
        public DateTime? ValidTo { get; set; }
        public bool Hidden { get; set; }
        public int NumberOfQuestions { get; set; }

        public static Exam FromFile(string fileName)
        {


            var json = File.ReadAllText(fileName);
            var jObject = JsonConvert.DeserializeObject(json) as JObject;
            jObject = FixTypes(jObject);
            //TODO: find a better way to change the jObject to Exam
            var newJsonContent = JsonConvert.SerializeObject(jObject);
            var exam = JsonConvert.DeserializeObject<Exam>(newJsonContent, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Objects });
            exam.Id = Path.GetFileName(Path.GetDirectoryName(fileName));
            return exam;
        }

        private static JObject FixTypes(JObject jObject)
        {
            string defaultType = null;
            var questionDefaults = jObject["QuestionDefaults"];
            if (questionDefaults != null)
            {
                defaultType = questionDefaults["Type"].Value<string>();
            }
            if (jObject["Questions"] != null)
            {
                var questions = jObject["Questions"] as JArray;
                for(var i = 0; i<questions.Count; i++)
                {
                    //TODO: Fix this implementation
                    var oldObject = questions[i];
                    questions[i] = new JObject();
                    var currentType = questions[i]["Type"];
                    var typeName = currentType == null ? defaultType : currentType.Value<string>();
                    
                    var fullTypeName = $"Hexamer.Model.QuestionTypes.{typeName}, Hexamer";
                    fullTypeName = "Hexamer.Model.QuestionTypes.MultipleChoice, Hexamer";
                    questions[i]["$type"] = fullTypeName;
                    foreach (var property in oldObject.OfType<JProperty>())
                    {
                        questions[i][property.Name] = property.Value;
                    }
                    foreach (var property in questionDefaults.OfType<JProperty>())
                    {
                        if (questions[i][property.Name] == null)
                        {
                            questions[i][property.Name] = property.Value;
                        }
                    }
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
        public bool CanShowScore
        {
            get
            {
                return !Hidden && (!ValidTo.HasValue || ValidTo.Value < DateTime.Now) && (!ValidFrom.HasValue || ValidFrom.Value < DateTime.Now);
            }
        }
        public bool CanTakeExam
        {
            get
            {
                return !Hidden && (!ValidTo.HasValue || ValidTo.Value > DateTime.Now) && (!ValidFrom.HasValue || ValidFrom.Value < DateTime.Now);
            }
        }
        public QuestionDefaults QuestionDefaults { get; set; }
        public List<Question> Questions { get; set; }
        public List<Group> Group { get; set; }

    }
}
