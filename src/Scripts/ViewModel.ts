import * as ko from "knockout";
import { ILocalization } from 'ILocalization';
export abstract class ViewModel {
    public Localization: ILocalization;
    constructor() {
        ko["amdTemplateEngine"].defaultPath = "/templates";
        ko["amdTemplateEngine"].defaultSuffix = ".html";
    }

    public ChangeLanguage(language: string): void {
        
    }
}