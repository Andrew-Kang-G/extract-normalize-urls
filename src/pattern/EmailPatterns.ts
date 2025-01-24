import {DomainPatterns} from "./DomainPatterns";

export class EmailPatterns extends DomainPatterns {

    // https://cs.chromium.org/chromium/src/third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&sq=package:chromium&dr
    static allEmailsFront: string = '(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))[\\s]*';

    static allEmailsEnd: string = '[\\s]*(?:'
                                        + this.ipV4 + '|'
                                        + this.ipV6 + '|' +
                                            '[^\\s@]+\\.' + '(?:' + this.allRootDomains + '\\b)' +
                                            '(?:' + this.allRootDomains + '|\\.)*)';
}