import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class ReorderViewModel {
    public Question: Question;
    public CodeText: string;
    public IsCompleteAnswer: KnockoutObservable<boolean>;
    public IsInvalidAnswer: KnockoutObservable<boolean>;
    public AvailableOptions: KnockoutObservableArray<any>;
    public ChosenOptions: KnockoutObservableArray<any>;

    constructor(question: Question) {
        this.Question = question;
        question.AnswerRevealed.subscribe(this.UpdateTooltips);
        let availableOptions: any[] = [];
        let chosenOptions: any[] = [];

        let chosenIds = (question.AnswerProvided || "").toLowerCase().split(',').filter(a => a);
        let correctIds = (question.CorrectAnswer || "").toLowerCase().split(',').filter(a => a);

        for (let i: number = 0; i < correctIds.length; i++) {
            let id = correctIds[i];
            let options = question.QuestionData.Options.filter(q => q.Id.toLowerCase() == id);
            for (let j: number = 0; j < options.length; j++) {
                options[j].Ordinal = i+1;
            }
        }

        for (let i: number = 0; i < chosenIds.length; i++) {
            let options = question.QuestionData.Options.filter(q => q.Id.toLowerCase() == chosenIds[i]);
            if (options.length == 0) {
                console.log("Missing an option!")
            } else {
                chosenOptions.push(options[0]);
            }
        }

        for (let i: number = 0; i < question.QuestionData.Options.length; i++) {
            let option = question.QuestionData.Options[i];
            let isChosen : boolean = chosenIds.indexOf(option.Id.toLowerCase()) > -1;
            
            if (!isChosen) {
                availableOptions.push(option);
            }
        }

        this.AvailableOptions = ko.observableArray(availableOptions);
        this.ChosenOptions = ko.observableArray(chosenOptions);
        this.IsCompleteAnswer = ko.observable(question.QuestionData.Choose == chosenIds.length);
        this.IsInvalidAnswer = ko.observable(question.QuestionData.Choose < chosenIds.length);
    }
    private UpdateTooltips = (newValue: boolean) => {
        window["jQuery"]('.drag-content [data-toggle="tooltip"]').tooltip(newValue ? 'show' : 'hide');
    };

    public ChooseOption = (option) => {
        this.AvailableOptions.remove(option);
        if (isNaN(this.dropIndex) || (this.dropIndex >= this.ChosenOptions().length)) { 
            this.ChosenOptions.push(option);
        } else {
            this.ChosenOptions.splice(this.dropIndex, 0, option);
        }
        
        this.UpdateAnswer();
        this.dropIndex = Number.NaN;
    };
    public RemoveOption = (option) => {
        this.ChosenOptions.remove(option);
        if (isNaN(this.dropIndex) || (this.dropIndex >= this.AvailableOptions().length)) {
            this.AvailableOptions.push(option);
        } else {
            this.AvailableOptions.splice(this.dropIndex, 0, option);
        }
        this.UpdateAnswer();
        this.dropIndex = Number.NaN;
    };

    public StartDrag = (vm, event) => {
        console.log("startdrag");
        event.originalEvent.dataTransfer.setData('text/plain', vm.Id);
        event.originalEvent.currentTarget.classList.add("dragging");
        return true;
    };

    
    private dropIndex: number;
    public SetPlaceholder = (vm, event) => {
        if (event.preventDefault)
            event.preventDefault();
        event.currentTarget.classList.add('dragging'); 
        event.originalEvent.dataTransfer.dropEffect = 'move'
        let div = <HTMLDivElement> event.currentTarget.lastElementChild;
        let elements = div.getElementsByTagName("div");
        let y = Math.round((event.offsetY-60) /50);
        y = Math.max(Math.min(y, elements.length), 0);
        this.dropIndex = y;
        for (let i = 0; i<elements.length; i++){
            elements[i].classList.remove("start");
            elements[i].classList.remove("above");
            elements[i].classList.remove("end");
            elements[i].classList.remove("below");
            if (i == y) {
                elements[i].classList.add(i == 0 ? "start" : "above");
            } else if (i == y-1) {
                elements[i].classList.add(y == elements.length ? "end" : "below");
            }
        }
        return false;
    };
    public EndDrag = (vm, event) => {
        event.currentTarget.classList.remove("dragging");
        event.currentTarget.classList.remove("start");
        event.currentTarget.classList.remove("above");
        event.currentTarget.classList.remove("end");
        event.currentTarget.classList.remove("below");
    };

    public EnterDrag = (vm, event) => {
        console.log("enterdrag");
        event.currentTarget.classList.add('dragging');
    };

    public ChooseOptionByDragging = (vm,event) => {
        let optionId = event.originalEvent.dataTransfer.getData("text");
        let option = this.AvailableOptions().filter(opt => opt.Id == optionId);
        if (option.length == 0)  {
            console.log("Option not found!");
            return;
        } 
        this.ChooseOption(option[0]);
        if (event.stopPropagation) event.stopPropagation();
        event.target.classList.remove('dragging');
        return false;
    };


    public RemoveOptionByDragging = (vm,event) => {
        let optionId = event.originalEvent.dataTransfer.getData("text");
        let option = this.ChosenOptions().filter(opt => opt.Id == optionId);
        if (option.length == 0)  {
            console.log("Option not found!");
            return;
        } 
        this.RemoveOption(option[0]);
        if (event.stopPropagation) event.stopPropagation();
        event.target.classList.remove('dragging');
        return false;
    };

    private UpdateAnswer = () => {
        let chosenOptions = this.ChosenOptions();
        this.Question.AnswerProvided = chosenOptions.map(opt => opt.Id).join(',');
        this.Question.IsDirty = true;
        this.IsCompleteAnswer(this.Question.QuestionData.Choose == chosenOptions.length);
        this.IsInvalidAnswer(this.Question.QuestionData.Choose < chosenOptions.length);
    };
}
export function initialize(question: Question) {
    return new ReorderViewModel(question);
}