"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAllUriMatches = processAllUriMatches;
exports.adjustUrisRx = adjustUrisRx;
const DomainPatterns_1 = require("../pattern/DomainPatterns");
const BasePatterns_1 = require("../pattern/BasePatterns");
const ParamsPatterns_1 = require("../pattern/ParamsPatterns");
function processUriMatchInIndexRange(uriMatch, urlMatchList) {
    let obj_part = {
        uriDetected: undefined,
        inWhatUrl: undefined,
    };
    for (let i = 0; i < urlMatchList.length; i++) {
        if (uriMatch.index.start > urlMatchList[i].index.start &&
            uriMatch.index.start < urlMatchList[i].index.end &&
            uriMatch.index.end > urlMatchList[i].index.start &&
            uriMatch.index.end <= urlMatchList[i].index.end) {
            let sanitizedUrl = uriMatch.value.url || "";
            let rx = new RegExp("^(\\/\\/[^/]*|\\/[^\\s]+\\." + DomainPatterns_1.DomainPatterns.allRootDomains + ")", "gi");
            let match;
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
function processAllUriMatches(uriMatchList, urlMatchList) {
    return uriMatchList.map((uriMatch) => processUriMatchInIndexRange(uriMatch, urlMatchList));
}
/**
 * Adjusts the URI regex based on the boundary condition.
 * @param urisRxStr - The base URI regex string.
 * @param endBoundary - Whether to apply the end boundary condition.
 * @returns The adjusted URI regex string.
 */
function adjustUrisRx(urisRxStr, endBoundary) {
    if (endBoundary) {
        return '(?:\\/[^\\s]*\\/|' +
            '(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
            + '[^/\\s]*(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
            + '\\/|\\/|\\b)' +
            '(?:' + urisRxStr + ')' +
            '(?:' + ParamsPatterns_1.ParamsPatterns.mandatoryUrlParams + '|[\\s]|$)';
    }
    else {
        return '(?:\\/[^\\s]*\\/|' +
            '(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
            + '[^/\\s]*(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')'
            + '\\/|\\/|\\b)' +
            '(?:' + urisRxStr + ')' + ParamsPatterns_1.ParamsPatterns.optionalUrlParams;
    }
}
