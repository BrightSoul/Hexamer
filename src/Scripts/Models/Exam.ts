import { ExamStatus } from 'Scripts/Models/ExamStatus';

export class Exam {
    public Id: string;
    public Title: string;
    public Subtitle: string;
    public Rating: string;
    public Questions: number;
    public QuestionsAnswered: number[];
    public QuestionsBookmarked: number[];
    public LastQuestionDisplayed: number;
    public BeginsInSeconds?: number;
    public RemainingSeconds?: number;
    public CanOpen: boolean;
    public CanReset: boolean;
    public CanShowAnswer: boolean;
    public Status: ExamStatus;
    public Score?: number;
    public IsNewlyCompleted: boolean;
    public Passed: boolean;
}