import { User } from "User";

export interface ILayout {
    Navigate(module: string);
    SetUserIdentity(user: User);
    ClearUserIdentity();
    Get<TResult>(url: string) : Promise<TResult> 
    Post<TResult, TData>(url: string, data: TData): Promise<TResult>
}