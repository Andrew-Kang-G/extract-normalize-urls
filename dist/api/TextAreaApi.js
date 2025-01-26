"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAreaApi = void 0;
const SafeConditionalUrlPatternBuilder_1 = require("../pattern/SafeConditionalUrlPatternBuilder");
const TextAreaService_1 = require("../service/TextAreaService");
const UriMatchProcessor_1 = require("../bo/UriMatchProcessor");
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
        let uriMatchList = TextAreaService_1.TextAreaService.extractCertainPureUris(textStr, uris, endBoundary);
        let urlMatchList = TextAreaService_1.TextAreaService.extractAllPureUrls(textStr);
        return (0, UriMatchProcessor_1.processAllUriMatches)(uriMatchList, urlMatchList);
    },
};
