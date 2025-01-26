import {ExtractCertainUriMatch, IndexContainingBaseMatch} from "../types";
import {DomainPatterns} from "../pattern/DomainPatterns";
import {BasePatterns} from "../pattern/BasePatterns";
import {ParamsPatterns} from "../pattern/ParamsPatterns";

function processUriMatchInIndexRange(
    uriMatch: IndexContainingBaseMatch,
    urlMatchList: IndexContainingBaseMatch[]
): ExtractCertainUriMatch {
    let obj_part: ExtractCertainUriMatch = {
        uriDetected: undefined,
        inWhatUrl: undefined,
    };
    for (let i = 0; i < urlMatchList.length; i++) {
        if (
            uriMatch.index.start > urlMatchList[i].index.start &&
            uriMatch.index.start < urlMatchList[i].index.end &&
            uriMatch.index.end > urlMatchList[i].index.start &&
            uriMatch.index.end <= urlMatchList[i].index.end
        ) {
            let sanitizedUrl = uriMatch.value.url || "";
            let rx = new RegExp(
                "^(\\/\\/[^/]*|\\/[^\\s]+\\." + DomainPatterns.allRootDomains + ")",
                "gi"
            );
            let match: RegExpExecArray | null;

            while ((match = rx.exec(uriMatch.value.url || "")) !== null) {
                if (match[1]) {
                    sanitizedUrl = sanitizedUrl.replace(rx, "");

                    uriMatch.value.url = sanitizedUrl;
                    uriMatch.index.start += match[1].length;

                    uriMatch.value.onlyUriWithParams = uriMatch.value.url;
                    uriMatch.value.onlyUri = (uriMatch.value.url || "").replace(/\?[^/]*$/gi, "");
                }
            }

            obj_part.inWhatUrl = urlMatchList[i];
        }
    }

    obj_part.uriDetected = uriMatch;
    return obj_part;
}

export function processAllUriMatches(
    uriMatchList: IndexContainingBaseMatch[],
    urlMatchList: IndexContainingBaseMatch[]
): ExtractCertainUriMatch[] {
    return uriMatchList.map((uriMatch) => processUriMatchInIndexRange(uriMatch, urlMatchList));
}


/**
 * Adjusts the URI regex based on the boundary condition.
 * @param urisRxStr - The base URI regex string.
 * @param endBoundary - Whether to apply the end boundary condition.
 * @returns The adjusted URI regex string.
 */
export function adjustUrisRx(urisRxStr: string, endBoundary: boolean): string {
    if (endBoundary) {
        return  '(?:\\/[^\\s]*\\/|' +
            '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
            + '[^/\\s]*(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
            + '\\/|\\/|\\b)' +
            '(?:' + urisRxStr + ')' +
            '(?:' + ParamsPatterns.mandatoryUrlParams + '|[\\s]|$)';
    } else {
        return  '(?:\\/[^\\s]*\\/|' +
            '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
            + '[^/\\s]*(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
            + '\\/|\\/|\\b)' +
            '(?:' + urisRxStr + ')' + ParamsPatterns.optionalUrlParams;
    }

}