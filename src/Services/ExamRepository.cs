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
        public IEnumerable<Exam> GetAll()
        {
            return GetAll(name => true);
        }

        private IEnumerable<Exam> GetAll(Func<string, bool> filter)
        {
            return Directory
               .EnumerateDirectories(examsDataDirectory)
               .Where(filter)
               .Select(directory => Path.Combine(directory, "exam.json"))
               .Where(examFile => File.Exists(examFile))
               .Select(examFile => Exam.FromFile(examFile));
        }

        public Exam GetById(string id)
        {
            var exams = GetAll(dirName => Path.GetFileName(dirName).Equals(id, StringComparison.Ordinal));
            return exams.FirstOrDefault();
        }
    }
}
