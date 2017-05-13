﻿using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Hexamer.Model.Results;
using Hexamer.Services;
using Hexamer.Extensions;
using Hexamer.Model;
using System.IO;
using System.Threading.Tasks;
using System;

namespace Hexamer.Controllers
{
    [Route("api/[controller]")]
    public class ExamsController : Controller
    {
        private readonly IExamRepository examRepository;
        private readonly IAnswerRepository answerRepository;
        private readonly AppConfig config;

        public ExamsController(AppConfig config, IExamRepository examRepository, IAnswerRepository answerRepository)
        {
            this.examRepository = examRepository;
            this.answerRepository = answerRepository;
            this.config = config;
        }

        // GET api/values
        [HttpGet]
        public async Task<IEnumerable<ExamResult>> GetAll()
        {
            string language = Request.GetLanguage();
            var enabledExams = examRepository.GetAll(language).Visible().ToList();
            var examResults = enabledExams.Select(exam => ExamResult.FromEntity(exam));
            foreach (var examResult in examResults) {
                var answers = await answerRepository.GetAll(User.Identity.Name, examResult.Id);
                examResult.SetScore(answers);
            }
            return examResults;
        }
        
        [HttpGet("{examId}")]
        public async Task<IActionResult> Detail(string examId)
        {
            string language = Request.GetLanguage();
            var exam = examRepository.GetById(examId, language);
            if (exam == null)
                return NotFound();

            if (await answerRepository.CreateMissingAnswers(User.Identity.Name, exam)) {
                exam = examRepository.GetById(examId, language);
            }
            var examResult = ExamResult.FromEntity(exam);
            var answers = await answerRepository.GetAll(User.Identity.Name, examResult.Id);
            examResult.SetScore(answers);
            return Ok(examResult);
        }
        [HttpGet("{examId}/{questionNumber}")]
        public async Task<IActionResult> QuestionDetail(string examId, int questionNumber)
        {
            var answer = await answerRepository.GetByNumber(User.Identity.Name, examId, questionNumber);
            if (answer == null)
                return NotFound("Answer");
            
            var exam = examRepository.GetById(examId, Request.GetLanguage());
            if (exam == null)
                return NotFound("Exam");

            var question = exam.Questions.SingleOrDefault(q => q.Id == answer.Question);
            if (question == null)
                return NotFound("Question");

            var result = QuestionResult.FromEntities(exam, question, answer, User.Identity);
            await answerRepository.UpdateDisplayed(User.Identity.Name, examId, questionNumber);
            return Ok(result);
        }

        [HttpGet("{id}/Image")]
        public IActionResult Image(string id) {
            var dataDirectory = config.ExamsDataDirectory;
            var examImage = Path.Combine(dataDirectory, id, "exam.jpg");
            if (!System.IO.File.Exists(examImage))
                examImage = Path.Combine(dataDirectory, "default-exam-image.jpg");
            return File(System.IO.File.OpenRead(examImage), "image/jpeg");
        }
    }
}
