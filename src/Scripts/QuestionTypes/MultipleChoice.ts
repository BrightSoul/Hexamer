import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class MultipleChoiceViewModel {
    public Question: Question;
    public IsCompleteAnswer: KnockoutObservable<boolean>;
    public IsInvalidAnswer: KnockoutObservable<boolean>;

    constructor(question: Question) {
        this.Question = question;
        let optionsChecked : number = 0;
        let chosenIds = (question.AnswerProvided || "").toLowerCase().split(',').filter(a => a);
        let correctIds = (question.CorrectAnswer || "").toLowerCase().split(',').filter(a => a);

        for (let i: number = 0; i < question.QuestionData.Options.length; i++) {
            let option = question.QuestionData.Options[i];
            let isChecked : boolean = chosenIds.indexOf(option.Id.toLowerCase()) > -1;
            optionsChecked += isChecked ? 1 : 0;
            option.IsChecked = ko.observable(isChecked);
            option.IsChecked.subscribe(this.UpdateAnswer);
            option.IsCorrect = correctIds.indexOf(option.Id.toLowerCase()) > -1;
        }
        this.IsCompleteAnswer = ko.observable(optionsChecked == question.QuestionData.Choose);
        this.IsInvalidAnswer = ko.observable(optionsChecked > question.QuestionData.Choose);
    }
    private UpdateAnswer = () => {
        let optionsChecked : number = 0;
        let options : string[] = [];
        for (let i: number = 0; i < this.Question.QuestionData.Options.length; i++) {
            let option = this.Question.QuestionData.Options[i];
            if (option.IsChecked && option.IsChecked()) {
                optionsChecked++;
                options.push(option.Id);
            }
        }
        this.IsCompleteAnswer(optionsChecked == this.Question.QuestionData.Choose);
        this.IsInvalidAnswer(optionsChecked > this.Question.QuestionData.Choose);
        this.Question.AnswerProvided = options.join(',');
        this.Question.IsDirty = true;
    };
}
export function initialize(question: Question) {
    return new MultipleChoiceViewModel(question);
}