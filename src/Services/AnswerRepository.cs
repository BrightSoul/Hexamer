using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hexamer.Model;
using System.Data.Common;
using System.Data;
using System.IO;
using Hexamer.Extensions;

namespace Hexamer.Services
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly DbProviderFactory factory;
        private readonly AppConfig config;
        public AnswerRepository(AppConfig config, DbProviderFactory factory)
        {
            this.factory = factory;
        }
        public async Task<IEnumerable<Answer>> GetAll(string username, string exam)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT * FROM Answers WHERE Username=@username AND Exam=@exam";
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

        public async Task<Answer> GetById(string username, string exam, string question)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var command = conn.CreateCommand())
                {
                    command.CommandText = "SELECT * FROM Answers WHERE Username=@username AND Exam=@exam AND Question=@question";
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

        public async Task UpdateAnswer(string username, Answer answer)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "UPDATE Answers SET AnswerProvided=@answedProvided, ScoreAwarded=@scoreAwarded, IsCorrectAnswer=@isCorrectAnswer, Answered=@answered WHERE Exam=@exam AND Question=@question";
                    cmd.AddParameter("answerProvided", answer.AnswerProvided);
                    cmd.AddParameter("scoreAwarded", answer.ScoreAwarded);
                    cmd.AddParameter("isCorrectAnswer", answer.IsCorrectAnswer);
                    cmd.AddParameter("answered", answer.Answered);
                    cmd.AddParameter("exam", answer.Exam);
                    cmd.AddParameter("question", answer.Question);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }

        public async Task UpdateMark(string username, string exam, string question, bool marked)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "UPDATE Answers SET MarkedForReview=@markedForReview WHERE Exam=@exam AND Question=@question";
                    cmd.AddParameter("exam", exam);
                    cmd.AddParameter("question", question);
                    cmd.AddParameter("markedForReview", marked);
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
        public async Task Create(string username, IEnumerable<Answer> answers)
        {
            using (var conn = await GetDbConnectionForUser(username))
            {
                //This transaction will automatically rollback if anything happens
                //https://github.com/aspnet/Microsoft.Data.Sqlite/blob/dev/src/Microsoft.Data.Sqlite.Core/SqliteTransaction.cs#L113
                using (var transaction = conn.BeginTransaction(IsolationLevel.Serializable))
                {
                    foreach (var answer in answers)
                    {
                        using (var cmd = conn.CreateCommand())
                        {
                            cmd.CommandText = "INSERT INTO Answers (Exam, Question, Number, AnswerProvided, ScoreAwarded, IsCorrectAnswer, Answered) VALUES (@exam, @question, @number, @answedProvided, @scoreAwarded, @isCorrectAnswer, @answered)";
                            cmd.AddParameter("exam", answer.Exam);
                            cmd.AddParameter("question", answer.Question);
                            cmd.AddParameter("number", answer.Number);
                            cmd.AddParameter("created", answer.Created);
                            cmd.AddParameter("answerProvided", answer.AnswerProvided);
                            cmd.AddParameter("scoreAwarded", answer.ScoreAwarded);
                            cmd.AddParameter("isCorrectAnswer", answer.IsCorrectAnswer);
                            cmd.AddParameter("answered", answer.Answered);
                            await cmd.ExecuteNonQueryAsync();
                        }
                    }
                    transaction.Commit();
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
                command.CommandText = "CREATE TABLE IF NOT EXISTS Answers (Exam VARCHAR(255) NOT NULL, Question VARCHAR(255) NOT NULL, Number INT NOT NULL, AnswerProvided TEXT NOT NULL, ScoreAwarded DOUBLE NOT NULL, IsCorrectAnswer BOOLEAN NOT NULL, Answered DATETIME, Created DATETIME NOT NULL, PRIMARY KEY (Exam, Question))";
                await command.ExecuteNonQueryAsync();
            }
        }

        private Answer ConstructFromReader(DbDataReader dataReader)
        {
            return new Answer
            {
                Exam = (string) dataReader["Exam"],
                Question = (string) dataReader["Question"],
                Number = Convert.ToInt32(dataReader["Number"]),
                AnswerProvided = (string) dataReader["AnswerProvided"],
                ScoreAwarded = (double) dataReader["ScoreAwarded"],
                IsCorrectAnswer = Convert.ToBoolean(dataReader["IsCorrectAnswer"]),
                Answered = (DateTime?) dataReader["Answered"],
                Created = (DateTime) dataReader["Created"]
            };
        }

    }
}
