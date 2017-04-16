import { Page } from 'Page';
export interface ILayout {
    Navigate(page: Page, navigationArgs: string);
    Get<TResult>(url: string) : Promise<TResult> 
    Post<TResult, TData>(url: string, data: TData): Promise<TResult>
    SetTitle(title: string);
}