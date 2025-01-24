"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailPatterns = void 0;
const DomainPatterns_1 = require("./DomainPatterns");
class EmailPatterns extends DomainPatterns_1.DomainPatterns {
}
exports.EmailPatterns = EmailPatterns;
_a = EmailPatterns;
// https://cs.chromium.org/chromium/src/third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&sq=package:chromium&dr
EmailPatterns.allEmailsFront = '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))[\\s]*';
EmailPatterns.allEmailsEnd = '[\\s]*(?:'
    + _a.ipV4 + '|'
    + _a.ipV6 + '|' +
    '[^\\s@]+\\.' + '(?:' + _a.allRootDomains + '\\b)' +
    '(?:' + _a.allRootDomains + '|\\.)*)';
