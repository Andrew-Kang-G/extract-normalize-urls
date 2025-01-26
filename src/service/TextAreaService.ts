import {EmailMatch, IndexContainingBaseMatch} from "../types";
import {SafeConditionalUrlPatternBuilder} from "../pattern/SafeConditionalUrlPatternBuilder";
import {BasePatterns} from "../pattern/BasePatterns";
import {DomainPatterns} from "../pattern/DomainPatterns";
import Util from "../util";
import {EmailPatternBuilder} from "../pattern/EmailPatternBuilder";
import {UrlAreaService} from "./UrlAreaService";
import {EmailAreaService} from "./EmailAreaService";
import {adjustUrisRx} from "../bo/UriMatchProcessor";
import {sanitizeEmailPrefix} from "../bo/EmailMatchProcessor";

export const TextAreaService = {

    extractAllUrlMatchList(textStr: string): IndexContainingBaseMatch[] {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        const urlRx = new RegExp(SafeConditionalUrlPatternBuilder.getUrl, 'gi');

        let urlMatchList: IndexContainingBaseMatch[] = [];
        let match: RegExpExecArray | null;
        while ((match = urlRx.exec(textStr)) !== null) {

            /* EXCLUDED FROM MATCH LIST : Email Type */
            if (/^@/.test(match[0])) {
                continue;
            }

            let startIdx = match.index;
            let endIdx = match.index + match[0].length;

            const parsedUrl = UrlAreaService.parseUrl(match[0]);

            /* EXCLUDED FROM MATCH LIST */
            if (parsedUrl.onlyDomain && new RegExp('^(?:\\.|[0-9]|' + BasePatterns.twoBytesNum + ')+$', 'i').test(parsedUrl.onlyDomain)) {
                // ipV4 is OK
                if (!new RegExp('^' + DomainPatterns.ipV4 + '$', 'i').test(parsedUrl.onlyDomain)) {
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
            } as IndexContainingBaseMatch);
        }

        return urlMatchList;

    },

    /*
    * [!!IMPORTANT] Should be refactored.
    * */
    extractCertainUriMatchList(textStr: string, uris: Array<Array<string>>, endBoundary: boolean): IndexContainingBaseMatch[] {

        let urisRxStr = Util.Text.urisToOneRxStr(uris);
        if (!urisRxStr) {
            throw new Error('the variable uris are not available');
        }
        urisRxStr = adjustUrisRx(urisRxStr, endBoundary);

        let uriMatchList: IndexContainingBaseMatch[] = [];

        const uriRx = new RegExp(urisRxStr, 'gi');

        let match : RegExpExecArray | null;
        while ((match = uriRx.exec(textStr)) !== null) {
            uriMatchList.push({
                value: UrlAreaService.parseUrl(match[0]),
                area: 'text',
                index: {
                    start: match.index,
                    end: match.index + match[0].length
                }
            } as IndexContainingBaseMatch);
        }
        return uriMatchList;
    },

    extractAllEmailMatchList(textStr: string, finalPrefixSanitizer: boolean): EmailMatch[] {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let emailMatchList = [];

        const emailRx = new RegExp(EmailPatternBuilder.getEmail, 'gi');

        let match: RegExpExecArray | null;

        while ((match = emailRx.exec(textStr)) !== null) {

            let matchedEmail = match[0];

            let matchedEmailFront = matchedEmail.split(/@/)[0];

            let startIdx = match.index;
            let endIdx = match.index + match[0].length;

            if (finalPrefixSanitizer) {
                const { sanitizedEmail, removedLength } = sanitizeEmailPrefix(matchedEmailFront, matchedEmail);
                matchedEmail = sanitizedEmail;
                startIdx += removedLength;
            }

            let parsedEmail = EmailAreaService.parseEmail(matchedEmail);

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
                pass: EmailAreaService.strictTest(parsedEmail.email)
            } as EmailMatch);
        }
        return emailMatchList;
    }
};