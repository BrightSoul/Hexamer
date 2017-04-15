import * as ko from "knockout";
import axios from 'axios';
import { ILayout } from "ILayout";
class LoginViewModel {
    public Status: KnockoutObservable<string>

    private layout: ILayout;
    constructor(layout: ILayout) {
        this.Status = ko.observable("Accedi");
        this.layout = layout;
        //setTimeout(() => { this.Status("Acceduto!"); }, 2000);
    }
    public async Login() {
        let response = await axios.post("/api/Login");
        alert(response.data);
        this.layout.Navigate("Exams");
    }
}
export function initialize(layout: ILayout) {
    console.log(arguments);
    return new LoginViewModel(layout);
}