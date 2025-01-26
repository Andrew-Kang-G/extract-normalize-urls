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
const EmailPatternBuilder_1 = require("../pattern/EmailPatternBuilder");
const UrlAreaService_1 = require("./UrlAreaService");
const EmailAreaService_1 = require("./EmailAreaService");
const UriMatchProcessor_1 = require("../bo/UriMatchProcessor");
const EmailMatchProcessor_1 = require("../bo/EmailMatchProcessor");
exports.TextAreaService = {
    extractAllUrlMatchList(textStr) {
        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }
        const urlRx = new RegExp(SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.getUrl, 'gi');
        let urlMatchList = [];
        let match;
        while ((match = urlRx.exec(textStr)) !== null) {
            /* EXCLUDED FROM MATCH LIST : Email Type */
            if (/^@/.test(match[0])) {
                continue;
            }
            let startIdx = match.index;
            let endIdx = match.index + match[0].length;
            const parsedUrl = UrlAreaService_1.UrlAreaService.parseUrl(match[0]);
            /* EXCLUDED FROM MATCH LIST */
            if (parsedUrl.onlyDomain && new RegExp('^(?:\\.|[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + ')+$', 'i').test(parsedUrl.onlyDomain)) {
                // ipV4 is OK
                if (!new RegExp('^' + DomainPatterns_1.DomainPatterns.ipV4 + '$', 'i').test(parsedUrl.onlyDomain)) {
                    continue;
                }
            }
            /* Adjust endIdx by the length of removedTailOnUrl, if it exists */
            if (parsedUrl.removedTailOnUrl && parsedUrl.removedTailOnUrl.length > 0) {
                endIdx -= parsedUrl.removedTailOnUrl.length;
            }
            urlMatchList.push({
                value: parsedUrl,
                area: 'text',
                index: {
                    start: startIdx,
                    end: endIdx
                }
            });
        }
        return urlMatchList;
    },
    /*
    * [!!IMPORTANT] Should be refactored.
    * */
    extractCertainUriMatchList(textStr, uris, endBoundary) {
        let urisRxStr = util_1.default.Text.urisToOneRxStr(uris);
        if (!urisRxStr) {
            throw new Error('the variable uris are not available');
        }
        urisRxStr = (0, UriMatchProcessor_1.adjustUrisRx)(urisRxStr, endBoundary);
        let uriMatchList = [];
        const uriRx = new RegExp(urisRxStr, 'gi');
        let match;
        while ((match = uriRx.exec(textStr)) !== null) {
            uriMatchList.push({
                value: UrlAreaService_1.UrlAreaService.parseUrl(match[0]),
                area: 'text',
                index: {
                    start: match.index,
                    end: match.index + match[0].length
                }
            });
        }
        return uriMatchList;
    },
    extractAllEmailMatchList(textStr, finalPrefixSanitizer) {
        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }
        let emailMatchList = [];
        const emailRx = new RegExp(EmailPatternBuilder_1.EmailPatternBuilder.getEmail, 'gi');
        let match;
        while ((match = emailRx.exec(textStr)) !== null) {
            let matchedEmail = match[0];
            let matchedEmailFront = matchedEmail.split(/@/)[0];
            let startIdx = match.index;
            let endIdx = match.index + match[0].length;
            if (finalPrefixSanitizer) {
                const { sanitizedEmail, removedLength } = (0, EmailMatchProcessor_1.sanitizeEmailPrefix)(matchedEmailFront, matchedEmail);
                matchedEmail = sanitizedEmail;
                startIdx += removedLength;
            }
            let parsedEmail = EmailAreaService_1.EmailAreaService.parseEmail(matchedEmail);
            /* Adjust endIdx by the length of removedTailOnUrl, if it exists */
            if (parsedEmail.removedTailOnEmail && parsedEmail.removedTailOnEmail.length > 0) {
                endIdx -= parsedEmail.removedTailOnEmail.length;
            }
            emailMatchList.push({
                value: parsedEmail,
                area: 'text',
                index: {
                    start: startIdx,
                    end: endIdx
                },
                pass: EmailAreaService_1.EmailAreaService.strictTest(parsedEmail.email)
            });
        }
        return emailMatchList;
    }
};
