import { ILocale } from 'Scripts/Localization/ILocale';
export class En implements ILocale {
    ApplicationName: string = "Exams";
    LanguageName: string = "English";
    Welcome: string = "Welcome!";
    WelcomeMessage: string = "In order to start the exam, login by clicking the button below.";
    BeginExam: string = "Begin";
    ContinueExam: string = "Resume";
    ReviewExam: string = "Review";
    ResetExam: string = "Reset";
    CumLaude: string = "cum laude";
    MarkWillAppearHere: string = "your mark will be here";
    Questions: string = "questions";
    QuestionsAlreadyAnswered: string = "already answered";
    AvailableFrom: string = "Available from";
    StartingIn: string = "Starting in";
    Next: string = "Next";
    Previous: string = "Previous";
    RevealAnswer: string = "Reveal answer";
    RemainingTime: string = "Remaining time";
    TimesUp: string = "Time's up!";
    BookmarkAnswer: string = "Review this question later";
    AverageTimePerAnswer: string = "approximately per question";
    BackToHome: string = "Back to home";
    BackToHomeConfirmation: string = "Are you sure you want to go back to the homepage? You'll be able to resume this exam at any time.";
    Logout: string = "Logout";
    LogoutConfirmation: string = "Are you sure you want to logout?";
}