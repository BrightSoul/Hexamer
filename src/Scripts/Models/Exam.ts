import { ExamStatus } from 'Scripts/Models/ExamStatus';

export class Exam {
    Id: string;
    Title: string;
    QuestionsCount: number;
    QuestionsAnswered: number;
    BeginsInSeconds?: number;
    RemainingSeconds?: number;
    CanBegin: boolean;
    CanReset: boolean;
    Status: ExamStatus;
    MarkValue?: number;
    MarkComment?: string;
    MarkDetailedValue?: number;
}