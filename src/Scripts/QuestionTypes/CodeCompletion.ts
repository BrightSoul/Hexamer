import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class CodeCompletionViewModel {
    constructor(question: Question) {

    }
}
export function initialize(question: Question) {
    return new CodeCompletionViewModel(question);
}