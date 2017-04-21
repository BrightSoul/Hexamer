import * as ko from 'knockout';
import axios from 'axios';
import { UserResult } from 'Scripts/Results/UserResult';
import { ILayout } from 'Scripts/Models/ILayout';
import { User } from 'Scripts/Models/User';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Page } from 'Scripts/Models/Page';

export class LayoutViewModel implements ILayout {

    public NavigationContext: KnockoutObservable<NavigationContext>;
    public User: KnockoutObservable<User>;
    public Title: KnockoutObservable<string>;
    
    constructor() {
        let templateEngine: any = ko["amdTemplateEngine"];
        templateEngine.defaultPath = "/html";
        templateEngine.defaultSuffix = ".html?v=" + Math.random();
        this.User = ko.observable(null);
        this.NavigationContext = ko.observable(null);
        this.Title = ko.observable("Hexamer");
        window.onhashchange = () => { this.ChangePage(); };
        this.GetUser();
        
    }

    public SetTitle(title: string) {
        this.Title(title);
    }

    public GetUsername(): string {
        let user = this.User();
        return user ? user.Name : null;
    }
    private ChangePage(): void {
        this.NavigateAccordingToHash(Page.Login);
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
        let newHash: string = Page[page] + (navigationArgs ? '/' + navigationArgs : '');
        if (location.hash.substr(location.hash.indexOf('#')+1) == newHash)
            this.NavigateAccordingToHash(page);
        else
            location.hash = newHash;
    }
    private NavigateAccordingToHash(defaultPage: Page) : void {
        let navigationInfo: string[] = location.hash.substr(location.hash.indexOf('#')+1).split('/');
        let destinationPage: Page = defaultPage;
        if (navigationInfo[0] in Page) {
            destinationPage = <Page> Page[navigationInfo[0]];
        }
        let navigationArgs: string = navigationInfo.length > 1 ? navigationInfo[1] : null;

        if (destinationPage == Page.Login && this.User()) {
            this.Navigate(Page.Exams);
        } else if (destinationPage != Page.Login && !this.User()) {
            this.Navigate(Page.Login);
        } else {
            var navigationContext = new NavigationContext(this, destinationPage, navigationArgs);
            this.NavigationContext(navigationContext);
        }

        
    }
    private BackToHome() {
        if (confirm("Vuoi davvero tornare alla home?")) {
            this.Navigate(Page.Exams);
        }
    }
    private Login(user: User) {
        this.User(user);
        this.Navigate(Page.Exams);
    }
    private async Logout() : Promise<void> {
        await this.Get("/api/Logout");
        this.User(null);
        this.Navigate(Page.Login);
    }
}