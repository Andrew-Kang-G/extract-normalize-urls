import {EmailPatterns} from "./EmailPatterns";

export class EmailPatternBuilder extends EmailPatterns {

    // 2. Email
    static get getEmail() {
        return this.allEmailsFront + "@" + this.allEmailsEnd;
    }
}
