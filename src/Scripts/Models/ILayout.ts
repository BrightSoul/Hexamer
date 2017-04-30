import * as ko from 'knockout';
import { Page } from 'Page';
import { User } from 'User';
export interface ILayout {
    Navigate(page: Page, navigationArgs?: string);
    Get<TResult>(url: string) : Promise<TResult> 
    Post<TResult, TData>(url: string, data: TData): Promise<TResult>
    SetTitle(title: string);
    GetUsername(): string;
    IsBusy: KnockoutObservable<boolean>;
}