using Hexamer.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;

namespace Hexamer.Services
{
    public class ExamRepository : IExamRepository
    {
        private readonly string examsDataDirectory;
        private readonly IMemoryCache memoryCache;
        public ExamRepository(IMemoryCache memoryCache, AppConfig config)
        {
            examsDataDirectory = config.ExamsDataDirectory;
            this.memoryCache = memoryCache; 
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
               .Select(examFile => memoryCache.GetOrCreate(
                   key: $"{examFile}|{language.ToLowerInvariant()}|{File.GetLastWriteTimeUtc(examFile).Ticks}",
                   factory: cacheEntry => {
                       cacheEntry.AbsoluteExpiration = DateTimeOffset.Now.AddHours(3);
                       return Exam.FromFile(examFile, language);
                   }
               )
               );
        }

        public Exam GetById(string id, string language)
        {
            var exams = GetAll(dirName => Path.GetFileName(dirName).Equals(id, StringComparison.Ordinal), language);
            return exams.FirstOrDefault();
        }
    }
}
