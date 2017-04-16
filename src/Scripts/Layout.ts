import * as ko from 'knockout';
import axios from 'axios';
import { ILayout } from 'ILayout';
import { User } from 'User';
import { Page } from 'Page';
import { NavigationContext } from 'NavigationContext';
import { UserResult } from 'Scripts/Results/UserResult';

export class LayoutViewModel implements ILayout {

    public NavigationContext: KnockoutObservable<NavigationContext>;
    public User: KnockoutObservable<User>;
    public Title: KnockoutObservable<string>;
    
    constructor() {
        let templateEngine: any = ko["amdTemplateEngine"];
        templateEngine.defaultPath = "/html";
        templateEngine.defaultSuffix = ".html";
        this.User = ko.observable(null);
        this.NavigationContext = ko.observable(null);
        this.Title = ko.observable("Hexamer");
        this.GetUser();
    }

    public SetTitle(title: string) {
        this.Title(title);
    }
    private async GetUser() : Promise<void> {
        let result = await this.Get<UserResult>("/api/User");
        if (result.IsAuthenticated) {
            this.Login(result.User);
        } else {
            await this.Logout();
        }
    }
    
    public async Get<TResult>(url: string): Promise<TResult> {
        let response = await axios.get(url);
        this.EnsureSuccessStatusCode(response.status);
        return <TResult> response.data;
    }

    public async Post<TResult, TData>(url: string, data: TData): Promise<TResult> {
        let response = await axios.post(url, data);
        this.EnsureSuccessStatusCode(response.status);
        return <TResult> response.data;
    }

    private EnsureSuccessStatusCode(statusCode: number) {
        if (statusCode == 401) {
            alert("Per favore rieffettua il login");
            this.Navigate(Page.Login);
        } else if (statusCode >= 400) {
            alert("Si è verificato un errore nel server, per favore segnala questo problema");
        }
    }

    public Navigate(page: Page, navigationArgs: string = null) : void {
        var navigationContext = new NavigationContext(this, page, navigationArgs);
        this.NavigationContext(navigationContext);
    }
    private NavigateAccordingToUrl(defaultPage: Page) : void {
        let navigationInfo: string[] = location.hash.substr(location.hash.indexOf('#')+1).split('/');
        let destinationPage: Page = defaultPage;
        if (navigationInfo[0] in Page) {
            destinationPage = <Page> Page[navigationInfo[0]];
        }
        let navigationArgs: string = navigationInfo.length > 1 ? navigationInfo[1] : null;
        this.Navigate(destinationPage, navigationArgs);
    }
    private BackToHome() {
        if (confirm("Vuoi davvero tornare alla home?")) {
            this.Navigate(Page.Exam);
        }
    }
    private Login(user: User){
        this.User(user);
        this.NavigateAccordingToUrl(Page.Exams);
    }
    private async Logout() : Promise<void> {
        await this.Get("/api/Logout");
        this.User(null);
        this.Navigate(Page.Login);
    }
}