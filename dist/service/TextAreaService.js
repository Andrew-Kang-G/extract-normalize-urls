"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAreaService = void 0;
const SafeConditionalUrlPatternBuilder_1 = require("../pattern/SafeConditionalUrlPatternBuilder");
const BasePatterns_1 = require("../pattern/BasePatterns");
const DomainPatterns_1 = require("../pattern/DomainPatterns");
const util_1 = __importDefault(require("../util"));
const ParamsPatterns_1 = require("../pattern/ParamsPatterns");
const EmailPatternBuilder_1 = require("../pattern/EmailPatternBuilder");
const UrlAreaService_1 = require("./UrlAreaService");
const EmailAreaService_1 = require("./EmailAreaService");
exports.TextAreaService = {
    extractAllPureUrls(textStr) {
        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }
        let obj = [];
        let rx = new RegExp(SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.getUrl, 'gi');
        let matches = [];
        let match;
        while ((match = rx.exec(textStr)) !== null) {
            /* SKIP DEPENDENCY */
            if (/^@/.test(match[0])) {
                continue;
            }
            let startIdx = match.index;
            let endIdx = match.index + match[0].length;
            let modVal = match[0];
            let re = UrlAreaService_1.UrlAreaService.parseUrl(modVal);
            /* SKIP DEPENDENCY */
            if (re.onlyDomain && new RegExp('^(?:\\.|[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + ')+$', 'i').test(re.onlyDomain)) {
                // ipV4 is OK
                if (!new RegExp('^' + DomainPatterns_1.DomainPatterns.ipV4 + '$', 'i').test(re.onlyDomain)) {
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
            });
        }
        return obj;
    },
    /*
    * [!!IMPORTANT] Should be refactored.
    * */
    extractCertainPureUris(textStr, uris, endBoundary) {
        let uriRx = util_1.default.Text.urisToOneRxStr(uris);
        if (!uriRx) {
            throw new Error('the variable uris are not available');
        }
        if (endBoundary) {
            uriRx = '(?:\\/[^\\s]*\\/|' +
                '(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
                + '[^/\\s]*(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uriRx + ')' +
                '(?:' + ParamsPatterns_1.ParamsPatterns.mandatoryUrlParams + '|[\\s]|$)';
        }
        else {
            uriRx = '(?:\\/[^\\s]*\\/|' +
                '(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
                + '[^/\\s]*(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uriRx + ')' + ParamsPatterns_1.ParamsPatterns.optionalUrlParams;
        }
        let obj = [];
        /* normal text area */
        let rx = new RegExp(uriRx, 'gi');
        let match;
        while ((match = rx.exec(textStr)) !== null) {
            let mod_val = match[0];
            obj.push({
                value: UrlAreaService_1.UrlAreaService.parseUrl(mod_val),
                area: 'text',
                index: {
                    start: match.index,
                    end: match.index + match[0].length
                }
            });
        }
        return obj;
    },
    extractAllPureEmails(textStr, finalPrefixSanitizer) {
        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }
        let obj = [];
        let rx = new RegExp(EmailPatternBuilder_1.EmailPatternBuilder.getEmail, 'gi');
        let match;
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
                let match2;
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
            let re = EmailAreaService_1.EmailAreaService.assortEmail(mod_val);
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
                pass: EmailAreaService_1.EmailAreaService.strictTest(re.email)
            });
        }
        return obj;
    }
};
