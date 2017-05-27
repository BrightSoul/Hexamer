using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hexamer.Model;
using System.Data.Common;
using System.Data;
using System.IO;
using Hexamer.Extensions;
using System.Linq;

namespace Hexamer.Services
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly DbProviderFactory factory;
        private readonly AppConfig config;
        public AnswerRepository(AppConfig config, DbProviderFactory factory)
        {
            this.factory = factory;
            this.config = config;
        }
        public async Task<IEnumerable<Answer>> GetAll(string username, string exam)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT * FROM Answers WHERE Exam=@exam";
                    command.AddParameter("exam", exam);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        List<Answer> answers = new List<Answer>();
                        while (await reader.ReadAsync())
                        {
                            answers.Add(ConstructFromReader(reader));
                        }
                        return answers;
                    }
                }
            }
        }

        public async Task<Answer> GetByNumber(string username, string exam, int questionNumber)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT * FROM Answers WHERE Exam=@exam AND Number=@questionNumber";
                    command.AddParameter("exam", exam);
                    command.AddParameter("questionNumber", questionNumber);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return ConstructFromReader(reader);
                        }
                        return null;
                    }
                }
            }
        }
        public async Task<Answer> GetById(string username, string exam, string question)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT * FROM Answers WHERE Exam=@exam AND Question=@question";
                    command.AddParameter("exam", exam);
                    command.AddParameter("question", question);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return ConstructFromReader(reader);
                        }
                        return null;
                    }
                }
            }
        }

        public async Task<bool> Reset(string username, string exam)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM Answers WHERE Exam=@exam";
                    cmd.AddParameter("exam", exam);
                    var rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
        }

        public async Task<bool> UpdateDisplayed(string username, string examId, int questionNumber)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "UPDATE Answers SET Displayed=@displayed WHERE Exam=@exam AND Number=@number";
                    cmd.AddParameter("exam", examId);
                    cmd.AddParameter("number", questionNumber);
                    cmd.AddParameter("displayed", DateTime.Now);
                    var rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected == 1;
                }
            }
        }
        public async Task<bool> UpdateAnswer(string username, string examId, int questionNumber, string answerProvided, double scoreAwarded, bool isCorrectAnswer, bool isCompleteAnswer)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "UPDATE Answers SET AnswerProvided=@answerProvided, ScoreAwarded=@scoreAwarded, IsCorrectAnswer=@isCorrectAnswer, IsCompleteAnswer=@isCompleteAnswer, Answered=@answered WHERE Exam=@examId AND Number=@questionNumber";
                    cmd.AddParameter("answerProvided", answerProvided);
                    cmd.AddParameter("scoreAwarded", scoreAwarded);
                    cmd.AddParameter("isCorrectAnswer", isCorrectAnswer);
                    cmd.AddParameter("isCompleteAnswer", isCompleteAnswer);
                    cmd.AddParameter("answered", DateTime.Now);
                    cmd.AddParameter("examId", examId);
                    cmd.AddParameter("questionNumber", questionNumber);
                    var rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected == 1;
                }
            }
        }

        public async Task<bool> UpdateBookmark(string username, string examId, int questionNumber, bool bookmarked)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "UPDATE Answers SET IsBookmarked=@isBookmarked WHERE Exam=@exam AND Number=@number";
                    cmd.AddParameter("exam", examId);
                    cmd.AddParameter("number", questionNumber);
                    cmd.AddParameter("isBookmarked", bookmarked);
                    var rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected == 1;
                }
            }
        }
        public async Task<bool> CreateMissingAnswers(string username, Exam exam)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                //This transaction will automatically rollback if anything happens
                //https://github.com/aspnet/Microsoft.Data.Sqlite/blob/dev/src/Microsoft.Data.Sqlite.Core/SqliteTransaction.cs#L113
                using (var transaction = conn.BeginTransaction(IsolationLevel.Serializable))
                {
                    var answers = (await GetAll(username, exam.Id)).ToList();
                    var maximumQuestions = Math.Min(exam.MaximumQuestions, exam.Questions.Count());
                    if (answers.Count >= maximumQuestions) {
                        return false;
                    }
                    var userQuestions = answers.Select(a => a.Question);
                    var allQuestions = exam.Questions
                        .OrderBy(q => q.Group)
                        .ThenBy(q => Guid.NewGuid().ToString())
                        .Select(q => q.Id)
                        .ToList();
                    
                    var difference = maximumQuestions - answers.Count;
                    var questionsToCreate = allQuestions.Except(userQuestions).Take(difference).ToList();
                    if (questionsToCreate.Count > 0)
                    {
                        answers = questionsToCreate
                            .Select(q => new Answer { Exam = exam.Id, Question = q })
                            .ToList();
                    }
                    else
                    {
                        answers.Clear();
                    }

                    if (answers.Count > 0)
                    {

                        int number = 0;
                        using (var cmd = conn.CreateCommand())
                        {
                            cmd.CommandText = "SELECT COALESCE(MAX(Number), 0) FROM Answers WHERE Exam=@exam;";
                            cmd.AddParameter("exam", exam.Id);
                            number = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                        }
                        foreach (var answer in answers)
                        {
                            using (var cmd = conn.CreateCommand())
                            {
                                number++;
                                answer.Number = number;
                                cmd.CommandText = "INSERT INTO Answers (Exam, Question, Number, Created, IsCorrectAnswer, IsCompleteAnswer, IsBookmarked) VALUES (@exam, @question, @number, @created, @isCorrectAnswer, @isCompleteAnswer, @isBookmarked)";
                                cmd.AddParameter("exam", answer.Exam); 
                                cmd.AddParameter("question", answer.Question);
                                cmd.AddParameter("number", answer.Number);
                                cmd.AddParameter("created", answer.Created);
                                cmd.AddParameter("isCorrectAnswer", false);
                                cmd.AddParameter("isCompleteAnswer", false);
                                cmd.AddParameter("isBookmarked", false);
                                await cmd.ExecuteNonQueryAsync();
                            }
                        }
                    }
                    transaction.Commit();
                    return answers.Count > 0;
                }
            }
        }



        private async Task<DbConnection> GetDbConnectionForUser(string username)
        {
            string databasePath = Path.Combine(config.UserDataDirectory, $"{username}.db");
            bool databaseExists = File.Exists(databasePath);
            var connection = factory.CreateConnection();
            connection.ConnectionString = $"Data Source={databasePath}";
            await connection.OpenAsync();
            if (!databaseExists)
            {
                await CreateUserDatabaseSchema(connection);
            }
            return connection;
        }

        private async Task CreateUserDatabaseSchema(DbConnection connection)
        {
            using (var command = connection.CreateCommand())
            {
                command.CommandText = "CREATE TABLE IF NOT EXISTS Answers (Exam VARCHAR(255) NOT NULL, Question VARCHAR(255) NOT NULL, Number INT NOT NULL, AnswerProvided TEXT NULL, ScoreAwarded DOUBLE NULL, IsCorrectAnswer BOOLEAN NOT NULL, IsCompleteAnswer BOOLEAN NOT NULL, IsBookmarked BOOLEAN NOT NULL, Answered DATETIME, Displayed DATETIME, Created DATETIME NOT NULL, CONSTRAINT UniqueQuestionNumber UNIQUE (Exam, Number), PRIMARY KEY (Exam, Question))";
                await command.ExecuteNonQueryAsync();
            }
        }

        private Answer ConstructFromReader(DbDataReader dataReader)
        {
            return new Answer
            {
                Exam = (string)dataReader["Exam"],
                Question = (string)dataReader["Question"],
                Number = Convert.ToInt32(dataReader["Number"]),
                AnswerProvided = dataReader["AnswerProvided"] == null || dataReader["AnswerProvided"] == DBNull.Value ? null : (string) dataReader["AnswerProvided"],
                ScoreAwarded = dataReader["ScoreAwarded"] == null || dataReader["ScoreAwarded"] == DBNull.Value ? (double?) null : (double) dataReader["ScoreAwarded"],
                IsCorrectAnswer = Convert.ToBoolean(dataReader["IsCorrectAnswer"]),
                IsCompleteAnswer = Convert.ToBoolean(dataReader["IsCompleteAnswer"]),
                IsBookmarked = Convert.ToBoolean(dataReader["IsBookmarked"]),
                Answered = dataReader["Answered"] == null || dataReader["Answered"] == DBNull.Value ? (DateTime?) null : DateTime.Parse(dataReader["Answered"].ToString()),
                Created = DateTime.Parse(dataReader["Created"].ToString())
            };
        }

    }
}
