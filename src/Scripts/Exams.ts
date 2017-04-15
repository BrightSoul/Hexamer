import * as ko from "knockout";

class ExamsViewModel {
    public Status: KnockoutObservable<string>

    constructor() {
        this.Status = ko.observable("Rispondi...");
        setTimeout(() => {
            this.Status("Risposta corretta!");
        }, 2000);
    }
}
export function initialize() {
    console.log(arguments);
    return new ExamsViewModel();
}