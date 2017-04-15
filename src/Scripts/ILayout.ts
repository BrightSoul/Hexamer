import { User } from "User";

export interface ILayout {
    Navigate(module: string);
    SetUserIdentity(user: User);
    ClearUserIdentity();
}