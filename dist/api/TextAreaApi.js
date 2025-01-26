"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAreaApi = void 0;
const SafeConditionalUrlPatternBuilder_1 = require("../pattern/SafeConditionalUrlPatternBuilder");
const DomainPatterns_1 = require("../pattern/DomainPatterns");
const TextAreaService_1 = require("../service/TextAreaService");
exports.TextAreaApi = {
    /**
     * @brief
     * Distill all urls in texts
     * @author Andrew Kang
     * @param textStr string required
     * @param noProtocolJsn object
     *    default :  {
     'ipV4' : false,
     'ipV6' : false,
     'localhost' : false,
     'intranet' : false
     }

     * @return array
     */
    extractAllUrls(textStr, noProtocolJsn = {
        ipV4: false,
        ipV6: false,
        localhost: false,
        intranet: false
    }) {
        SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.setUrlPattern(noProtocolJsn);
        return TextAreaService_1.TextAreaService.extractAllPureUrls(textStr);
    },
    /**
     * @brief
     * Distill all emails from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param prefixSanitizer boolean (default : true)
     * @return array
     */
    extractAllEmails(textStr, prefixSanitizer = true) {
        return TextAreaService_1.TextAreaService.extractAllPureEmails(textStr, prefixSanitizer);
    },
    /**
     *
     * [!!Important] This functions well, but should be refactored every business logic is here.
     *
     * @brief
     * Distill uris with certain names from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param uris array required
     * for example, [['a','b'], ['c','d']]
     * If you use {number}, this means 'only number' ex) [['a','{number}'], ['c','d']]
     * @param endBoundary boolean (default : false)
     * @return array
     */
    extractCertainUris(textStr, uris, endBoundary = false) {
        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }
        let obj = TextAreaService_1.TextAreaService.extractCertainPureUris(textStr, uris, endBoundary);
        let obj2 = TextAreaService_1.TextAreaService.extractAllPureUrls(textStr);
        //console.log('obj : ' + JSON.stringify(obj));
        let obj_final = [];
        for (let a = 0; a < obj.length; a++) {
            let obj_part = {
                uriDetected: undefined,
                inWhatUrl: undefined,
            };
            //let matchedUrlFound = false;
            for (let b = 0; b < obj2.length; b++) {
                if ((obj[a].index.start > obj2[b].index.start && obj[a].index.start < obj2[b].index.end)
                    &&
                        (obj[a].index.end > obj2[b].index.start && obj[a].index.end <= obj2[b].index.end)) {
                    // Here, the uri detected is inside its url
                    // false positives like the example '//google.com/abc/def?a=5&b=7' can be detected in 'Service.Text.extractCertainPureUris'
                    let sanitizedUrl = obj[a]['value']['url'] || "";
                    let rx = new RegExp('^(\\/\\/[^/]*|\\/[^\\s]+\\.' + DomainPatterns_1.DomainPatterns.allRootDomains + ')', 'gi');
                    let matches = [];
                    let match;
                    while ((match = rx.exec(obj[a].value.url || "")) !== null) {
                        if (match[1]) {
                            sanitizedUrl = sanitizedUrl.replace(rx, '');
                            //console.log(match[1]);
                            obj[a].value.url = sanitizedUrl;
                            obj[a].index.start += match[1].length;
                            obj[a].value.onlyUriWithParams = obj[a].value.url;
                            obj[a].value.onlyUri = (obj[a].value.url || "").replace(/\?[^/]*$/gi, '');
                        }
                    }
                    obj_part.inWhatUrl = obj2[b];
                }
            }
            obj_part.uriDetected = obj[a];
            obj_final.push(obj_part);
        }
        return obj_final;
    },
};
