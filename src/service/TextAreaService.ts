import {EmailMatch, IndexContainingBaseMatch} from "../types";
import {SafeConditionalUrlPatternBuilder} from "../pattern/SafeConditionalUrlPatternBuilder";
import {BasePatterns} from "../pattern/BasePatterns";
import {DomainPatterns} from "../pattern/DomainPatterns";
import Util from "../util";
import {ParamsPatterns} from "../pattern/ParamsPatterns";
import {EmailPatternBuilder} from "../pattern/EmailPatternBuilder";
import {UrlAreaService} from "./UrlAreaService";
import {EmailAreaService} from "./EmailAreaService";

export const TextAreaService = {

    extractAllPureUrls(textStr: string): IndexContainingBaseMatch[] {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(SafeConditionalUrlPatternBuilder.getUrl, 'gi');

        let matches = [];
        let match: RegExpExecArray | null;

        while ((match = rx.exec(textStr)) !== null) {

            /* SKIP DEPENDENCY */
            if (/^@/.test(match[0])) {
                continue;
            }

            let startIdx = match.index;
            let endIdx = match.index + match[0].length;

            let modVal = match[0];
            let re = UrlAreaService.parseUrl(modVal);

            /* SKIP DEPENDENCY */
            if (re.onlyDomain && new RegExp('^(?:\\.|[0-9]|' + BasePatterns.twoBytesNum + ')+$', 'i').test(re.onlyDomain)) {
                // ipV4 is OK
                if (!new RegExp('^' + DomainPatterns.ipV4 + '$', 'i').test(re.onlyDomain)) {
                    continue;
                }
            }


            /* this part doesn't need to be included */
            if (re.removedTailOnUrl && re.removedTailOnUrl.length > 0) {
                endIdx -= re.removedTailOnUrl.length;
            }

            obj.push({
                value: re,
                area: 'text',
                index: {
                    start: startIdx,
                    end: endIdx
                }
            } as IndexContainingBaseMatch);
        }

        return obj;

    },

    /*
    * [!!IMPORTANT] Should be refactored.
    * */
    extractCertainPureUris(textStr: string, uris: Array<Array<string>>, endBoundary: boolean): IndexContainingBaseMatch[] {

        let uriRx = Util.Text.urisToOneRxStr(uris);


        if (!uriRx) {
            throw new Error('the variable uris are not available');
        }

        if (endBoundary) {

            uriRx = '(?:\\/[^\\s]*\\/|' +
                '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '[^/\\s]*(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uriRx + ')' +

                '(?:' + ParamsPatterns.mandatoryUrlParams + '|[\\s]|$)'

            ;

        } else {

            uriRx = '(?:\\/[^\\s]*\\/|' +
                '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '[^/\\s]*(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uriRx + ')' + ParamsPatterns.optionalUrlParams;
        }

        let obj = [];

        /* normal text area */
        let rx = new RegExp(uriRx, 'gi');

        let match : RegExpExecArray | null;
        while ((match = rx.exec(textStr)) !== null) {

            let mod_val = match[0];

            obj.push({
                value: UrlAreaService.parseUrl(mod_val),
                area: 'text',
                index: {
                    start: match.index,
                    end: match.index + match[0].length
                }
            } as IndexContainingBaseMatch);
        }


        return obj;

    },

    extractAllPureEmails(textStr: string, finalPrefixSanitizer: boolean): EmailMatch[] {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(EmailPatternBuilder.getEmail, 'gi');


        let match: RegExpExecArray | null;

        while ((match = rx.exec(textStr)) !== null) {

            let mod_val = match[0];

            let mod_val_front = mod_val.split(/@/)[0];

            let st_idx = match.index;
            let end_idx = match.index + match[0].length;


            /* prefixSanitizer */
            if (finalPrefixSanitizer) {

                // the 'border' is a en char that divides non-en and en areas.
                let border = '';
                let removedLength = 0;

                let rx_left_plus_border = new RegExp('^([^a-zA-Z0-9]+)([a-zA-Z0-9])', '');

                let is_mod_val_front_only_foreign_lang = true;

                let match2: RegExpExecArray | null;
                if ((match2 = rx_left_plus_border.exec(mod_val_front)) !== null) {

                    is_mod_val_front_only_foreign_lang = false;

                    //console.log('match2:' + match2);

                    if (match2[1]) {
                        removedLength = match2[1].length;
                    }
                    if (match2[2]) {
                        border = match2[2];
                    }
                }

                if (is_mod_val_front_only_foreign_lang === false) {
                    mod_val = mod_val.replace(rx_left_plus_border, '');
                    mod_val = border + mod_val;
                }

                st_idx += removedLength;

            }

            let re = EmailAreaService.assortEmail(mod_val);

            //console.log('re : ' + re);
            /* this part doesn't need to be included */
            if (re.removedTailOnEmail && re.removedTailOnEmail.length > 0) {
                end_idx -= re.removedTailOnEmail.length;
            }

            obj.push({
                value: re,
                area: 'text',
                index: {
                    start: st_idx,
                    end: end_idx
                },
                pass: EmailAreaService.strictTest(re.email)
            } as EmailMatch);
        }
        return obj;
    }
};