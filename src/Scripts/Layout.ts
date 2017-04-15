import * as ko from "knockout";
import { ILocalization } from 'ILocalization';
export class LoginViewModel {
    public Localization: ILocalization;
    public CurrentModuleName: KnockoutObservable<string>;

    constructor() {
        ko["amdTemplateEngine"].defaultPath = "/html";
        ko["amdTemplateEngine"].defaultSuffix = ".html";
        //TODO: determinalo in base all'url
        this.CurrentModuleName = ko.observable("Login");

        setTimeout(() => { this.CurrentModuleName("Exams"); }, 10000);
    }

    public ChangeLanguage(language: string): void {
        
    }
}