import * as ko from "knockout";
import { ViewModel } from 'ViewModel';

class HelloViewModel extends ViewModel {
    language: KnockoutObservable<string>
    framework: KnockoutObservable<string>
    public templateName: KnockoutObservable<string>

    constructor(language: string, framework: string) {
        super();
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