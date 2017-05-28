import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class ClickImageViewModel {
    public Question: Question;
    public Image: string;
    public Area: any;
    public Answer: KnockoutObservable<any>;
    public IsCompleteAnswer: KnockoutObservable<boolean>;

    constructor(question: Question) {
        this.Question = question;
        let answerProvided = [];
        if (question.AnswerProvided) {
            answerProvided = question.AnswerProvided.split(',');
            this.Answer = ko.observable({Left: answerProvided[0], Top: answerProvided[1]});
        } else {
            this.Answer = ko.observable(null);
        }
        
        this.Image = `/api/Exams/${question.ExamId}/Image?path=${encodeURIComponent(question.QuestionData.Image)}`;
        this.IsCompleteAnswer = ko.observable(answerProvided.length == 2);
        
        if (question.CorrectAnswer) {
            let correctCoordinates = question.CorrectAnswer.split(',');
            this.Area = {
                Left: correctCoordinates[0],
                Top: correctCoordinates[1],
                Width: correctCoordinates[2],
                Height: correctCoordinates[3]
            };
        } else {
            this.Area = null;
        }
    }

    public UpdateAnswer = (vm, event) => {
        this.IsCompleteAnswer(true);
        this.Answer({Left: event.offsetX, Top: event.offsetY});
        this.Question.AnswerProvided = Math.round(event.offsetX) + "," + Math.round(event.offsetY);
        this.Question.IsDirty = true;
    };

    public ClearAnswer = () => {
        this.IsCompleteAnswer(false);
        this.Question.AnswerProvided = "";
        this.Question.IsDirty = true;
    };
}
export function initialize(question: Question) {
    return new ClickImageViewModel(question);
}