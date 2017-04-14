import * as ko from "knockout";

class HelloViewModel {
    language: KnockoutObservable<string>
    framework: KnockoutObservable<string>
    templateName: KnockoutObservable<string>

    constructor(language: string, framework: string) {
        this.language = ko.observable(language);
        this.framework = ko.observable(framework);
        this.templateName = ko.observable("QuestionTypes/MultipleChoice");
        setTimeout(() => {
            this.templateName("QuestionTypes/Reorder");
        }, 5000);
    }
}
export function init() {
    ko.applyBindings(new HelloViewModel("TypeScript", "Knockout"));
};