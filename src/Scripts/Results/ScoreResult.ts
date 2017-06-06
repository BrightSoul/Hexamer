export class ScoreResult {
    public Username: string;
    public AnsweredQuestions: number;
    public CorrectQuestions: number;
    public Tokens: string[];
    public Score: number;
    public NormalizedScore: number;
    public Excellence: boolean;
}