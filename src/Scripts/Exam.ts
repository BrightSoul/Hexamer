import * as ko from "knockout";

class ExamViewModel {
    language: KnockoutObservable<string>
    framework: KnockoutObservable<string>
    public templateName: KnockoutObservable<string>

    constructor() {
        this.templateName = ko.observable("QuestionTypes/MultipleChoice");
        setTimeout(() => {
            this.templateName("QuestionTypes/Reorder");
        }, 5000);
    }
}
export function initialize() {
    return new ExamViewModel();
}