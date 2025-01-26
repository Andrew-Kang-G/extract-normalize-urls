import {EmailMatch, ExtractCertainUriMatch, IndexContainingBaseMatch, NoProtocolJsnParamType} from "../types";
import {SafeConditionalUrlPatternBuilder} from "../pattern/SafeConditionalUrlPatternBuilder";

import {DomainPatterns} from "../pattern/DomainPatterns";
import {TextAreaService} from "../service/TextAreaService";

export const TextAreaApi = {


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
    extractAllUrls(
        textStr: string,
        noProtocolJsn: NoProtocolJsnParamType = {
            ipV4: false,
            ipV6: false,
            localhost: false,
            intranet: false
        }
    ): IndexContainingBaseMatch[] {
        SafeConditionalUrlPatternBuilder.setUrlPattern(noProtocolJsn);
        return TextAreaService.extractAllPureUrls(textStr);
    },


    /**
     * @brief
     * Distill all emails from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param prefixSanitizer boolean (default : true)
     * @return array
     */
    extractAllEmails(textStr: string, prefixSanitizer: boolean = true): EmailMatch[] {
        return TextAreaService.extractAllPureEmails(textStr, prefixSanitizer);
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
    extractCertainUris(textStr: string, uris: Array<Array<string>>, endBoundary: boolean = false): ExtractCertainUriMatch[] {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let obj: IndexContainingBaseMatch[] = TextAreaService.extractCertainPureUris(textStr, uris, endBoundary);
        let obj2: IndexContainingBaseMatch[] = TextAreaService.extractAllPureUrls(textStr);


        //console.log('obj : ' + JSON.stringify(obj));

        let obj_final = [];

        for (let a = 0; a < obj.length; a++) {

            let obj_part: ExtractCertainUriMatch = {
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

                    let rx = new RegExp('^(\\/\\/[^/]*|\\/[^\\s]+\\.' + DomainPatterns.allRootDomains + ')', 'gi');
                    let matches = [];
                    let match: RegExpExecArray | null;

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