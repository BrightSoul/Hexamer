import * as ko from "knockout";
import axios from 'axios';
import { ILayout } from "ILayout";
class LoginViewModel {
    public Status: KnockoutObservable<string>
    public SlackAuthorizeUrl: KnockoutObservable<string>

    private layout: ILayout;
    constructor(layout: ILayout) {
        this.Status = ko.observable("Accedi");
        this.SlackAuthorizeUrl = ko.observable(null);
        this.layout = layout;
        this.FetchSlackAuthorizationUrl();
        //setTimeout(() => { this.Status("Acceduto!"); }, 2000);
    }




    public async FetchSlackAuthorizationUrl() : Promise<string> {
        const p = new Promise<string>((resolve, reject) => { resolve('a string') });
        return p;
    }

    public async Login() {
        let response = await axios.post("/api/Login", {});
        this.layout.Navigate("Exams");
    }
}
export function initialize(layout: ILayout) {
    return new LoginViewModel(layout);
}