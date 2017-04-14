import * as ko from "knockout";

export class HelloViewModel {
    language: KnockoutObservable<string>
    framework: KnockoutObservable<string>

    constructor(language: string, framework: string) {
        alert(1);
        this.language = ko.observable(language);
        this.framework = ko.observable(framework);
    }
}