import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class CodeCompletionViewModel {
    public Question: Question;
    public CodeText: string;
    public IsCompleteAnswer: KnockoutObservable<boolean>;

    constructor(question: Question) {
        this.Question = question;
        let optionsChecked : number = 0;
        let answerProvided = (question.AnswerProvided || "").toLowerCase().split(',');
        let correctOptions = question.CorrectAnswer.toLowerCase().split(',');
        let codeText = question.QuestionData.CodeText;
        question.AnswerRevealed.subscribe(this.UpdateTooltips);

        //Do some replacements
        for (let i = 0; i<question.QuestionData.Blocks.length; i++) {
            let block = question.QuestionData.Blocks[i];
            let options = block.Options.map(option => '<option value="' + option.Id + '"' + (answerProvided.indexOf((block.Id+option.Id).toLowerCase()) > -1 ? ' selected="selected"' : '')  + '>' + option.Text + '</option>');
            let correctOption = block.Options.filter(option => correctOptions.indexOf((block.Id+option.Id).toLowerCase()) > -1);
            let dropDownList = '<select class="form-control" name="block'+block.Id+'" data-html="true" data-placement="top" data-toggle="tooltip" data-trigger="manual" data-title="'+(correctOption.length > 0 ? correctOption[0].Text : '').split('"').join('&quot;')+'"><option></option>'+options.join('')+'</select>';
            codeText = codeText.replace('{'+block.Id+'}', dropDownList);
        }

        this.CodeText = codeText;
        this.IsCompleteAnswer = ko.observable(false);

    }
    private UpdateTooltips = (newValue: boolean) => {
        window["jQuery"]('.code [data-toggle="tooltip"]').tooltip(newValue ? 'show' : 'hide');
    };
    public UpdateAnswer = (vm, event) => {
        
        let answer : string[] = [];
        let children = (<HTMLSelectElement> event.target).parentElement.children;
        for (var i = 0; i<children.length; i++) {
            if (children[i].tagName.toLowerCase() != "select")
                continue;
            let select = <HTMLSelectElement> children[i];
            let blockId = select.name.replace("block", "");
            let optionId = select.value;
            let selection = optionId != "" ? blockId + optionId : "";
            if (selection) {
                answer.push(selection);
            }
        }
        this.IsCompleteAnswer(answer.length == this.Question.QuestionData.Blocks.length);
        this.Question.AnswerProvided = answer.join(',');
        this.Question.IsDirty = true;
    };

}
export function initialize(question: Question) {
    return new CodeCompletionViewModel(question);
}