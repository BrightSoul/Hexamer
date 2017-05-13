export class Question {

    public constructor() {
        this.IsDirty = false;
    }

    public ExamId: string;
    public Number: number;
    public Type: string;
    public Text: string;
    public AnswerProvided: string;
    public AnswerText: string;
    public CorrectAnswer: string;
    public IsBookmarked: boolean;
    public QuestionData: any;
    public CanShowAnswer: boolean;
    public IsDirty: boolean;
}