import * as ko from "knockout";

class LoginViewModel {
    public Status: KnockoutObservable<string>

    constructor() {
        this.Status = ko.observable("Accedi");
        setTimeout(() => { this.Status("Acceduto!"); }, 2000);
    }
}
export function initialize() {
    console.log(arguments);
    return new LoginViewModel();
}