import * as ko from 'knockout';
export class ScoreResult {
    public Username: string;
    public AnsweredQuestions: number;
    public CorrectQuestions: number;
    public Tokens: string[];
    public Score: number;
    public NormalizedScore: number;
    public Excellence: boolean;
    public IsRunning: KnockoutObservable<boolean>;
    public IsBlocked: boolean;
}