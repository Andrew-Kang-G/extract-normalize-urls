"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUriMatchInIndexRange = processUriMatchInIndexRange;
exports.processAllUriMatches = processAllUriMatches;
const DomainPatterns_1 = require("../pattern/DomainPatterns");
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
