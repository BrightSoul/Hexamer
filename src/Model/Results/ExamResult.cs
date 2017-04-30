﻿using System;
using System.Collections.Generic;
using System.Linq;
using Hexamer.Extensions;

namespace Hexamer.Model.Results
{
    public class ExamResult
    {
        private ExamResult(Exam exam)
        {
            Id = exam.Id;
            Title = exam.Title;
            Subtitle = exam.Subtitle;
            ValidTo = exam.ValidTo;
            Questions = exam.Questions.Count();
            MinimumScore = exam.MinimumScore;
            MaximumScore = exam.MaximumScore;
            Rating = "incomplete";
            QuestionsAnswered = new int[0];
            QuestionsBookmarked = new int[0];
        }
        public static ExamResult FromEntity(Exam exam)
        {
            if (exam == null)
                return null;

            return new ExamResult(exam);
        }

        public string Id { get; private set; }
        public string Title { get; private set; }
        public string Subtitle {get; private set;}
        public int[] QuestionsAnswered { get; private set; }
        public int[] QuestionsBookmarked { get; private set; }
        public decimal MinimumScore {get; private set;}

        private int lastQuestionDisplayed;
        public int LastQuestionDisplayed {get { return Math.Max(1, lastQuestionDisplayed); } private set { lastQuestionDisplayed = value; }}
        public decimal MaximumScore {get; private set;}
        public decimal? Score { get; private set; }
        public bool? Passed {get; private set; }
        public string Rating {get; private set; }
        public DateTime? ValidTo { get; private set; }
        public int Questions { get; private set; }
        public bool IsNewlyCompleted { get; private set; }
        public bool CanOpenExam {get; private set;}
        public bool CanShowAnswer {get; private set;}
        public bool CanResetExam {
            get {
                return Questions <= QuestionsAnswered.Length && !ValidTo.HasValue;
            }
        }
        public void SetScore(IEnumerable<Answer> answers) {
            double? score = answers.Sum(a => a.ScoreAwarded);
            DateTime? lastAnswered = answers.Max(a => a.Answered);
            int? lastQuestionDisplayed = answers.OrderByDescending(a => a.Displayed).Select(a => a.Number).FirstOrDefault();
            LastQuestionDisplayed = lastQuestionDisplayed ?? 1;
            QuestionsAnswered = answers.Answered().Select(a => a.Number).ToArray();
            QuestionsBookmarked = answers.Bookmarked().Select(a => a.Number).ToArray();
            if (QuestionsAnswered.Length < Questions) {
                return;
            }

            if ((DateTime.Now - lastAnswered.Value).TotalSeconds <= 30) {
                IsNewlyCompleted = true;
            }

            decimal normalizedScore = Convert.ToDecimal(score);
            if (normalizedScore - Convert.ToInt32(normalizedScore) >= 0.7m) {
                normalizedScore = Math.Ceiling(normalizedScore);
            } else {
                normalizedScore = Math.Floor(normalizedScore);
            }
            Score = normalizedScore;
            if (Score > MaximumScore) {
                Rating = "excellent";
            } else if (Score == MaximumScore) {
                Rating = "welldone";
            } else if (Score < MinimumScore) {
                Rating = "notpassed";
            } else {
                Rating = "passed";
            }
            Passed = Score >= MinimumScore;
        }
    }
}