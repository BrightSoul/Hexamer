export class QuestionIndicator {
    public Number: number;
    public IsAnswered: KnockoutObservable<boolean>;
    public IsBookmarked: KnockoutObservable<boolean>;

    constructor() {
        this.IsAnswered = ko.observable(false);
        this.IsBookmarked = ko.observable(false);
    }
}