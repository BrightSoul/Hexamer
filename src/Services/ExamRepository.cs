using Hexamer.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Hexamer.Services
{
    public class ExamRepository : IExamRepository
    {
        private readonly string examsDataDirectory;
        public ExamRepository(AppConfig config)
        {
            examsDataDirectory = config.ExamsDataDirectory; 
        }
        public IEnumerable<Exam> GetAll(string language)
        {
            return GetAll(name => true, language);
        }

        private IEnumerable<Exam> GetAll(Func<string, bool> filter, string language)
        {
            return Directory
               .EnumerateDirectories(examsDataDirectory)
               .Where(filter)
               .Select(directory => Path.Combine(directory, "exam.json"))
               .Where(examFile => File.Exists(examFile))
               .Select(examFile => Exam.FromFile(examFile, language));
        }

        public Exam GetById(string id, string language)
        {
            var exams = GetAll(dirName => Path.GetFileName(dirName).Equals(id, StringComparison.Ordinal), language);
            return exams.FirstOrDefault();
        }
    }
}
