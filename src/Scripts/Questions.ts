import * as ko from 'knockout';
import { NavigationContext } from 'Scripts/Models/NavigationContext';

class QuestionsViewModel {
    constructor(private navigationContext: NavigationContext) {
        alert(3);
    }
}
export function initialize(navigationContext: NavigationContext) {
    return new QuestionsViewModel(navigationContext);
}