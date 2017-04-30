export class Question {
    public Id : string;
    public ExamId : string;
    public Text: string;
    public Number: number;
    public CallToAction: string;
    public ProvidedAnswer: string;
    public Data: any;
    public Type: string;
    public IsBookmarked: boolean;
    public CanRevealAnswer: boolean;
}