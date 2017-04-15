import * as ko from "knockout";

class ExamViewModel {
    language: KnockoutObservable<string>
    framework: KnockoutObservable<string>
    public templateName: KnockoutObservable<string>

    constructor() {
        this.language = ko.observable(language);
        this.framework = ko.observable(framework);
        this.templateName = ko.observable("QuestionTypes/MultipleChoice");
        setTimeout(() => {
            this.templateName("QuestionTypes/Reorder");
        }, 5000);
    }
}
export function initialize() {
    return new ExamViewModel();
}