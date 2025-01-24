import {BasePatterns} from "./BasePatterns";
import {UrlPatterns} from "./UrlPatterns";
import {DomainPatterns} from "./DomainPatterns";
import {ProtocolPatterns} from "./ProtocolPatterns";


export class FuzzyPartialUrlPatterns {

    /* Mixed */

    static get getFuzzyProtocolPort(): string {
        return '(?:[\\s]*|(?:' +  BasePatterns.allKeypadMetaChars + '|[\\s]){0,6})';
    }
    static fuzzierProtocolDomainDelimiter: string = '(?:(?:' + BasePatterns.everything + '{0,3}|[\\s]*)[:;]' + BasePatterns.everything + '{0,6}|' +
    '(?:' + BasePatterns.everything + '{0,3}|[\\s]*)[#/]'+ this.getFuzzyProtocolPort  + '*)[#/]';
    static fuzzyUrlBodyWithoutProtocol: string =
        '(?:[0-9]|' + BasePatterns.langChar + ')'
    + '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + DomainPatterns.rfc3986UnreservedNoAlphaNums + '|' + BasePatterns.langChar + ')+?';


    /* Protocol */

    static get getFuzzyProtocolsRxStr(): string {

        let alls = ProtocolPatterns.allProtocols;
        alls = alls.replace(/^\(\?:|\)$/, '');

        let arrs = alls.split('|');

        let whole_rx = '(?:';
        for (let a = 0; a < arrs.length; a++) {

            let full_rx = '(?:[0-9]|[\\s]|' + BasePatterns.allKeypadMetaChars + '|';

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
                } else {
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

    static fuzzierProtocol: string = '(?:[a-zA-Z])+';

    /* Domain */

    static fuzzyIpV4: string = '[0-9]{1,3}(?:' + BasePatterns.allKeypadMetaChars + '|[\\s])+' +
        '[0-9]{1,3}(?:' + BasePatterns.allKeypadMetaChars + '|[\\s])+' +
        '[0-9]{1,3}(?:' + BasePatterns.allKeypadMetaChars + '|[\\s])+' +
        '[0-9]{1,3}';

    static fuzzyIpV6: string = '\\[[a-fA-F0-9]*(?:' + BasePatterns.allKeypadMetaChars + '|[\\s])*' +
        '[a-fA-F0-9:]*(?:' + BasePatterns.allKeypadMetaChars + '|[\\s])*' +
        '[a-fA-F0-9:]*\\]';

    static get getDoubleFuzzyIpV4(): string {
        return '[^0-9]*' + this.fuzzyIpV4;
    }

    static get getDoubleFuzzyIpV6(): string {
        return '[^\\[]*' + this.fuzzyIpV6;
    }

    static fuzzyLocalhost: string = '(?:' + BasePatterns.allKeypadMetaChars + '|[\\s])*localhost';

    static fuzzyDomainTail: string =
        '(?:[\\s]|' + BasePatterns.allKeypadMetaCharsWithoutDelimiters + '){0,2}?' + BasePatterns.endPuncRegardedChar +
    '(?:[\\s]|' + BasePatterns.allKeypadMetaCharsWithoutDelimiters + '){0,2}?' +
    '(?:' + DomainPatterns.allRootDomains + ')' +
    '(?:(?:' + DomainPatterns.allRootDomains + ')|(?:' + DomainPatterns.allKeypadMetaCharsWithoutDelimiters + '|[\\s]){0,3})*';

    static get getFuzzyDomainBody() {
        return '(?:(?:.+@|)(?:' + this.getDoubleFuzzyIpV4 + '|' + this.fuzzyLocalhost + '|' + this.getDoubleFuzzyIpV6 + ')' +
            '|(?:' +
            '(?:.)+?' +
            this.fuzzyDomainTail +
            ')' +
            ')';
    };

    /* Port */
    static optionalFuzzyPort: string = '(?:'+ this.getFuzzyProtocolPort +'[:;]*' + this.getFuzzyProtocolPort + '[0-9]+|)';
    static mandatoryFuzzyPort: string = '(?:' + DomainPatterns.allKeypadMetaChars + '|[\\s]){0,3}[:;]*(?:' + DomainPatterns.allKeypadMetaChars + '|[\\s]){0,3}[0-9]+';


    /* Params */
    static get getFuzzyParams(): string {
        return '(?:[\\s]*|(?:' +  DomainPatterns.allKeypadMetaChars + '|' + BasePatterns.langChar +'|[\\s]){0,6})';
    }
    static optionalFuzzyUrlParams: string = '(?:(?:' + this.getFuzzyParams + '(/|\\?|#)+[^\\s]*)|)';

}
