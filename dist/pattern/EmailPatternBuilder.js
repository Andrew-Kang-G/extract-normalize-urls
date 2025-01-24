"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailPatternBuilder = void 0;
const EmailPatterns_1 = require("./EmailPatterns");
class EmailPatternBuilder extends EmailPatterns_1.EmailPatterns {
    // 2. Email
    static get getEmail() {
        return this.allEmailsFront + "@" + this.allEmailsEnd;
    }
}
exports.EmailPatternBuilder = EmailPatternBuilder;
