import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class ReorderViewModel {
    public Question: Question;
    public CodeText: string;
    public IsCompleteAnswer: KnockoutObservable<boolean>;

    constructor(question: Question) {
        this.Question = question;
        question.AnswerRevealed.subscribe(this.UpdateTooltips);
        this.IsCompleteAnswer = ko.observable(false);

    }
    private UpdateTooltips = (newValue: boolean) => {
        window["jQuery"]('.drag-content [data-toggle="tooltip"]').tooltip(newValue ? 'show' : 'hide');
    };
    public UpdateAnswer = (vm, event) => {
        
        
        this.IsCompleteAnswer(false);
        this.Question.AnswerProvided = "";
        this.Question.IsDirty = true;
    };
}
export function initialize(question: Question) {
    return new ReorderViewModel(question);
}