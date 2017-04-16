import { ILayout } from 'ILayout';
import { Page } from 'Page';

export class NavigationContext {
    constructor (private layout : ILayout, private page: Page, private navigationArgs : string) {

    }
    get Layout(): ILayout {
        return this.layout;
    }
    get Page(): string {
        return Page[this.page];
    }
    get NavigationArgs(): string {
        return this.navigationArgs;
    }
}