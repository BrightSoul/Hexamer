import * as ko from 'knockout';
import axios, { AxiosRequestConfig } from 'axios';
import { UserResult } from 'Scripts/Results/UserResult';
import { ILayout } from 'Scripts/Models/ILayout';
import { User } from 'Scripts/Models/User';
import { NavigationContext } from 'Scripts/Models/NavigationContext';
import { Page } from 'Scripts/Models/Page';
import { SupportedLocales } from 'Scripts/Localization/SupportedLocales';
import { ILocale } from 'Scripts/Localization/ILocale';

export class LayoutViewModel implements ILayout {

    public NavigationContext: KnockoutObservable<NavigationContext>;
    public User: KnockoutObservable<User>;
    public Title: KnockoutObservable<string>;
    public SupportedLocales: string[];
    public CurrentLocale: KnockoutObservable<string>;
    private LocaleLoader: KnockoutComputed<void>;
    public Locale: KnockoutObservable<ILocale>;
    public IsBusy: KnockoutObservable<boolean>;
    private CurrentPage: Page;

    constructor() {
        let templateEngine: any = ko["amdTemplateEngine"];
        templateEngine.defaultPath = "/html";
        templateEngine.defaultSuffix = ".html?v=" + Math.random();
        this.User = ko.observable(null);
        this.IsBusy = ko.observable(null);
        this.NavigationContext = ko.observable(null);
        this.SupportedLocales = [];
        this.Locale = ko.observable<ILocale>();
        this.Title = ko.observable<string>();
        this.CurrentLocale = ko.observable(null);
        this.LocaleLoader = ko.computed(this.LoadLocale);
        this.InitLocale();
        this.GetUser();


    }

    private InitLocale(): void {
        this.CreateLocaleBinding();
        for (let p in SupportedLocales) {
            if (isNaN(parseInt(p, 10)))
                this.SupportedLocales.push(p);
        }

        let navigatorLanguage = navigator.language.toLowerCase();
        let foundLanguage = this.SupportedLocales.filter(l => l.toLowerCase() == navigatorLanguage || l.toLowerCase().substr(0, 2) == navigatorLanguage.substr(0, 2));
        if (foundLanguage.length > 0) {
            this.CurrentLocale(foundLanguage[0]);
        } else {
            this.CurrentLocale(this.SupportedLocales[0]);
        }

    }

    private CreateLocaleBinding(): void {
        ko.bindingHandlers.locale = {
            init: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
                // This will be called when the binding is first applied to an element
                // Set up any initial state, event handlers, etc. here
                let subscription = (newLocale : ILocale) : void => {
                    if (newLocale == null) {
                        element.innerText = "";
                    } else {
                        element.innerText = newLocale[valueAccessor()];
                    }
                };
                subscription(this.Locale());
                this.Locale.subscribe(subscription);
            },
            update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
                element.innerText = this.Locale()[valueAccessor()];
            }
        };
    }

    private LoadLocale = () => {
        let currentLocale = this.CurrentLocale();
        if (!currentLocale)
            return;
        requirejs(["Localization/Locale/" + currentLocale], (localeModule) => {
            let locale = <ILocale>new localeModule[currentLocale]();
            this.Locale(locale);
            this.Title(this.Locale().ApplicationName);
            if (this.User())
                this.NavigateAccordingToHash(this.CurrentPage);
        });
    }

    public SetTitle(title: string) {
        this.Title(title);
    }

    public SelectLocale = (locale: string) => {
        this.CurrentLocale(locale);
    };

    public GetUsername(): string {
        let user = this.User();
        return user ? user.Name : null;
    }

    private async GetUser(): Promise<void> {
        let result = await this.Get<UserResult>("/api/User");
        window.onhashchange = () => { this.NavigateAccordingToHash(Page.Login); };
        if (result.IsAuthenticated) {
            this.Login(result.User);
        } else {
            await this.Logout();
        }
    }

    public async Get<TResult>(url: string): Promise<TResult> {
        let response = await axios.get(url, this.GetAxiosConfig());
        this.EnsureSuccessStatusCode(response.status);
        return <TResult>response.data;
    }

    public async Post<TResult, TData>(url: string, data: TData): Promise<TResult> {
        let response = await axios.post(url, data, this.GetAxiosConfig());
        this.EnsureSuccessStatusCode(response.status);
        return <TResult>response.data;
    }

    private GetAxiosConfig() : AxiosRequestConfig {
        return <AxiosRequestConfig> {
            headers: { "Accept-Language": this.CurrentLocale() }
        };
    }

    private EnsureSuccessStatusCode(statusCode: number) {
        if (statusCode == 401) {
            alert("Per favore rieffettua il login");
            this.Navigate(Page.Login);
        } else if (statusCode >= 400) {
            alert("Si è verificato un errore nel server, per favore segnala questo problema");
        }
    }

    public Navigate(page: Page, navigationArgs: string = null): void {
        let newHash: string = Page[page] + (navigationArgs ? '/' + navigationArgs : '');
        if (location.hash.substr(location.hash.indexOf('#') + 1) == newHash)
            this.NavigateAccordingToHash(page);
        else
            location.hash = newHash;
    }
    private NavigateAccordingToHash(defaultPage: Page): void {
        let navigationInfo: string[] = location.hash.substr(location.hash.indexOf('#') + 1).split('/');
        let destinationPage: Page = defaultPage;
        if (navigationInfo[0] in Page) {
            destinationPage = <Page>Page[navigationInfo[0]];
        }
        let navigationArgs: string = navigationInfo.length > 1 ? navigationInfo.slice(1).join('/') : null;

        if (destinationPage == Page.Login && this.User()) {
            this.Navigate(Page.Exams);
        } else if (destinationPage != Page.Login && destinationPage != Page.AdminLogin && !this.User()) {
            this.Navigate(Page.Login);
        } else {
            this.CurrentPage = destinationPage;
            var navigationContext = new NavigationContext(this, destinationPage, navigationArgs);
            this.NavigationContext(navigationContext);
        }
    }
    private BackToHome() {
        if (confirm(this.Locale().BackToHomeConfirmation)) {
            this.Navigate(Page.Exams);
        }
    }
    private Login(user: User) {
        this.User(user);
        this.NavigateAccordingToHash(Page.Exams);
    }
    private async Logout(): Promise<void> {
        await this.Get("/api/Logout");
        this.User(null);
        this.Navigate(Page.Login);
    }
}