import * as ko from 'knockout';
import axios from 'axios';
import { ILayout } from "Scripts/ILayout";
import { User } from "Scripts/User";
export class LayoutViewModel implements ILayout {

    Navigate(module: string) {
        this.CurrentModuleName(module);
    }
    SetUserIdentity(user: User) {
        if (!user)
            throw new Error("L'utente non è valido");

        this.User(user);
    }
    ClearUserIdentity() {
        
    }

    private UpdateUserIdentity(user: User){
        this.User(null);
        this.Navigate("Login");
    }

    public CurrentModuleName: KnockoutObservable<string>;
    public User: KnockoutObservable<User>;
    public Strings : any;
    
    constructor() {
        let templateEngine: any = ko["amdTemplateEngine"];
        templateEngine.defaultPath = "/html";
        templateEngine.defaultSuffix = ".html";
        this.Strings = this.CreateStrings();
        //TODO: determinalo in base al cookie
        let user: User = null;
        this.User = ko.observable(user);
        //TODO: determinalo in base all'url. Se l'utente è null, vai con Login 
        if (user) {
            //TODO: determinalo in base all'url. Se l'utente è null, vai con Login 
            this.CurrentModuleName = ko.observable("Login");
        } else {
            this.CurrentModuleName = ko.observable("Login");
        }
    }

    private CreateStrings() {
        return {
            LoginWithSlack: "Accedi con slack"
        };
    }



    public ChangeLanguage(language: string): void {
        
    }
}