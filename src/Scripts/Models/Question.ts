export class Question {
    public Id : string;
    public ExamId : string;
    public Text: string;
    public Ordinal: number;
    public CallToAction: string;
    public GivenAnswer: string;
    public Data: any;
    public Type: string;
    public IsBookmarked: boolean;
    public CanRevealAnswer: boolean;
}