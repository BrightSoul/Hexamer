﻿import * as ko from 'knockout';
import { Question } from 'Scripts/Models/Question';

class ReorderViewModel {
    constructor(question: Question) {
    }
}
export function initialize(question: Question) {
    return new ReorderViewModel(question);
}