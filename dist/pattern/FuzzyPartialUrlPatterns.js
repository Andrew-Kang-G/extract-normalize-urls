"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuzzyPartialUrlPatterns = void 0;
const BasePatterns_1 = require("./BasePatterns");
const DomainPatterns_1 = require("./DomainPatterns");
const ProtocolPatterns_1 = require("./ProtocolPatterns");
class FuzzyPartialUrlPatterns {
    /* Mixed */
    static get getFuzzyProtocolPort() {
        return '(?:[\\s]*|(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s]){0,6})';
    }
    /* Protocol */
    static get getFuzzyProtocolsRxStr() {
        let alls = ProtocolPatterns_1.ProtocolPatterns.allProtocols;
        alls = alls.replace(/^\(\?:|\)$/, '');
        let arrs = alls.split('|');
        let whole_rx = '(?:';
        for (let a = 0; a < arrs.length; a++) {
            let full_rx = '(?:[0-9]|[\\s]|' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|';
            let part_arrs = [];
            let part_rx = '[';
            let one = arrs[a];
            for (let b = 0; b < one.length; b++) {
                let cr = one.charAt(b);
                part_rx += cr;
                part_arrs.push(cr);
            }
            part_rx += ']';
            full_rx += part_rx + '|)';
            for (let c = 0; c < part_arrs.length; c++) {
                if (c < part_arrs.length - 1) {
                    whole_rx += part_arrs[c] + full_rx;
                }
                else {
                    whole_rx += part_arrs[c];
                }
            }
            if (a < arrs.length - 1) {
                whole_rx += '|';
            }
        }
        //console.log('w : ' + whole_rx);
        return whole_rx;
    }
    static get getDoubleFuzzyIpV4() {
        return '[^0-9]*' + this.fuzzyIpV4;
    }
    static get getDoubleFuzzyIpV6() {
        return '[^\\[]*' + this.fuzzyIpV6;
    }
    static get getFuzzyDomainBody() {
        return '(?:(?:.+@|)(?:' + this.getDoubleFuzzyIpV4 + '|' + this.fuzzyLocalhost + '|' + this.getDoubleFuzzyIpV6 + ')' +
            '|(?:' +
            '(?:.)+?' +
            this.fuzzyDomainTail +
            ')' +
            ')';
    }
    ;
    /* Params */
    static get getFuzzyParams() {
        return '(?:[\\s]*|(?:' + DomainPatterns_1.DomainPatterns.allKeypadMetaChars + '|' + BasePatterns_1.BasePatterns.langChar + '|[\\s]){0,6})';
    }
}
exports.FuzzyPartialUrlPatterns = FuzzyPartialUrlPatterns;
_a = FuzzyPartialUrlPatterns;
FuzzyPartialUrlPatterns.fuzzierProtocolDomainDelimiter = '(?:(?:' + BasePatterns_1.BasePatterns.everything + '{0,3}|[\\s]*)[:;]' + BasePatterns_1.BasePatterns.everything + '{0,6}|' +
    '(?:' + BasePatterns_1.BasePatterns.everything + '{0,3}|[\\s]*)[#/]' + _a.getFuzzyProtocolPort + '*)[#/]';
FuzzyPartialUrlPatterns.fuzzyUrlBodyWithoutProtocol = '(?:[0-9]|' + BasePatterns_1.BasePatterns.langChar + ')'
    + '(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + DomainPatterns_1.DomainPatterns.rfc3986UnreservedNoAlphaNums + '|' + BasePatterns_1.BasePatterns.langChar + ')+?';
FuzzyPartialUrlPatterns.fuzzierProtocol = '(?:[a-zA-Z])+';
/* Domain */
FuzzyPartialUrlPatterns.fuzzyIpV4 = '[0-9]{1,3}(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s])+' +
    '[0-9]{1,3}(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s])+' +
    '[0-9]{1,3}(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s])+' +
    '[0-9]{1,3}';
FuzzyPartialUrlPatterns.fuzzyIpV6 = '\\[[a-fA-F0-9]*(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s])*' +
    '[a-fA-F0-9:]*(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s])*' +
    '[a-fA-F0-9:]*\\]';
FuzzyPartialUrlPatterns.fuzzyLocalhost = '(?:' + BasePatterns_1.BasePatterns.allKeypadMetaChars + '|[\\s])*localhost';
FuzzyPartialUrlPatterns.fuzzyDomainTail = '(?:[\\s]|' + BasePatterns_1.BasePatterns.allKeypadMetaCharsWithoutDelimiters + '){0,2}?' + BasePatterns_1.BasePatterns.endPuncRegardedChar +
    '(?:[\\s]|' + BasePatterns_1.BasePatterns.allKeypadMetaCharsWithoutDelimiters + '){0,2}?' +
    '(?:' + DomainPatterns_1.DomainPatterns.allRootDomains + ')' +
    '(?:(?:' + DomainPatterns_1.DomainPatterns.allRootDomains + ')|(?:' + DomainPatterns_1.DomainPatterns.allKeypadMetaCharsWithoutDelimiters + '|[\\s]){0,3})*';
/* Port */
FuzzyPartialUrlPatterns.optionalFuzzyPort = '(?:' + _a.getFuzzyProtocolPort + '[:;]*' + _a.getFuzzyProtocolPort + '[0-9]+|)';
FuzzyPartialUrlPatterns.mandatoryFuzzyPort = '(?:' + DomainPatterns_1.DomainPatterns.allKeypadMetaChars + '|[\\s]){0,3}[:;]*(?:' + DomainPatterns_1.DomainPatterns.allKeypadMetaChars + '|[\\s]){0,3}[0-9]+';
FuzzyPartialUrlPatterns.optionalFuzzyUrlParams = '(?:(?:' + _a.getFuzzyParams + '(/|\\?|#)+[^\\s]*)|)';
