import {EmailMatch, ExtractCertainUriMatch, IndexContainingBaseMatch, NoProtocolJsnParamType} from "../types";
import {SafeConditionalUrlPatternBuilder} from "../pattern/SafeConditionalUrlPatternBuilder";
import {TextAreaService} from "../service/TextAreaService";
import {processAllUriMatches} from "../bo/UriMatchProcessor";

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

        let uriMatchList: IndexContainingBaseMatch[] = TextAreaService.extractCertainPureUris(textStr, uris, endBoundary);
        let urlMatchList: IndexContainingBaseMatch[] = TextAreaService.extractAllPureUrls(textStr);

        return processAllUriMatches(uriMatchList, urlMatchList);

    },


};