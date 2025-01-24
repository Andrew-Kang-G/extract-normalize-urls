import Valid from './valid';
import Util from './util';
import {Normalizer} from './normalizer';
import {OptionalUrlPatternBuilder} from "./pattern/OptionalUrlPatternBuilder";
import {BasePatterns} from "./pattern/BasePatterns";
import {DomainPatterns} from "./pattern/DomainPatterns";
import {ProtocolPatterns} from "./pattern/ProtocolPatterns";
import {EmailInfo, ParsedUrl, ParsedUrlWithNormalization} from "./types";
import {ParamsPatterns} from "./pattern/ParamsPatterns";
import {EmailPatternBuilder} from "./pattern/EmailPatternBuilder";
import {CommentPatterns} from "./pattern/CommentPatterns";

const queryString = require('query-string');
/*
*     Public for controller
* */
const Text = {

    extractAllPureUrls(textStr) {

        //console.log('a : ' + Pattern.Children.url);

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(OptionalUrlPatternBuilder.getUrl, 'gi');

        let matches = [];
        let match: RegExpExecArray | null;

        while ((match = rx.exec(textStr)) !== null) {

            /* SKIP DEPENDENCY */
            if (/^@/.test(match[0])) {
                continue;
            }

            let startIdx = match.index;
            let endIdx = match.index + match[0].length;

            let modVal = match[0];
            let re = Url.parseUrl(modVal);

            /* SKIP DEPENDENCY */
            if (re.onlyDomain && new RegExp('^(?:\\.|[0-9]|' + BasePatterns.twoBytesNum + ')+$', 'i').test(re.onlyDomain)) {
                // ip_v4 is OK
                if (!new RegExp('^' + DomainPatterns.ipV4 + '$', 'i').test(re.onlyDomain)) {
                    continue;
                }
            }


            /* this part doesn't need to be included */
            if (re.removedTailOnUrl && re.removedTailOnUrl.length > 0) {
                endIdx -= re.removedTailOnUrl.length;
            }

            obj.push({
                'value': re,
                'area': 'text',
                'index': {
                    'start': startIdx,
                    'end': endIdx
                }
            });
        }

        return obj;

    },

    /*
    * [!!IMPORTANT] Should be refactored.
    * */
    extractCertainPureUris(textStr, uris, endBoundary) {

        let uriRx = Util.Text.urisToOneRxStr(uris);


        if (!uriRx) {
            throw new Error('the variable uris are not available');
        }

        if (endBoundary) {

            uriRx = '(?:\\/[^\\s]*\\/|' +
                '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '[^/\\s]*(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uriRx + ')' +

                '(?:' + ParamsPatterns.mandatoryUrlParams + '|[\\s]|$)'

            ;

        } else {

            uriRx = '(?:\\/[^\\s]*\\/|' +
                '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '[^/\\s]*(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + BasePatterns.langChar + ')'
                + '\\/|\\/|\\b)' +
                '(?:' + uriRx + ')' + ParamsPatterns.optionalUrlParams;
        }

        let obj = [];

        /* normal text area */
        let rx = new RegExp(uriRx, 'gi');

        let match : RegExpExecArray | null;
        while ((match = rx.exec(textStr)) !== null) {

            let mod_val = match[0];

            obj.push({
                'value': Url.parseUrl(mod_val),
                'area': 'text',
                'index': {
                    'start': match.index,
                    'end': match.index + match[0].length
                }
            });
        }


        return obj;

    },

    extractAllPureEmails(textStr, final_prefixSanitizer) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let obj = [];

        let rx = new RegExp(EmailPatternBuilder.getEmail, 'gi');


        let match: RegExpExecArray | null;

        while ((match = rx.exec(textStr)) !== null) {

            let mod_val = match[0];

            let mod_val_front = mod_val.split(/@/)[0];

            let st_idx = match.index;
            let end_idx = match.index + match[0].length;


            /* prefixSanitizer */
            if (final_prefixSanitizer === true) {

                // the 'border' is a en char that divides non-en and en areas.
                let border = '';
                let removedLength = 0;

                let rx_left_plus_border = new RegExp('^([^a-zA-Z0-9]+)([a-zA-Z0-9])', '');

                let is_mod_val_front_only_foreign_lang = true;

                let match2 = {};
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

            let re = Email.assortEmail(mod_val);

            //console.log('re : ' + re);
            /* this part doesn't need to be included */
            if (re.removedTailOnEmail && re.removedTailOnEmail.length > 0) {
                end_idx -= re.removedTailOnEmail.length;
            }

            obj.push({
                'value': re,
                'area': 'text',
                'index': {
                    'start': st_idx,
                    'end': end_idx
                },
                'pass': Email.strictTest(re.email)
            });
        }

        return obj;


    }
};

const Url = {

    /**
     * @brief
     * Normalize an url or a fuzzy url
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url) {

        let obj: ParsedUrlWithNormalization = {
            url: null,
            normalizedUrl: null,
            removedTailOnUrl: '',
            protocol: null,
            onlyDomain: null,
            onlyParams: null,
            onlyUri: null,
            onlyUriWithParams: null,
            onlyParamsJsn: null,
            type: null,
            port: null
        };

        try {

            url = Valid.checkIfStrOrFailAndTrimStr(url);


            /* Chapter 1. Normalizing process */

            Normalizer.modifiedUrl = Util.Text.removeAllSpaces(url);

            // 1. full url
            obj.url = url;

            // 2. protocol
            obj.protocol = Normalizer.extractAndNormalizeProtocolFromSpacesRemovedUrl();

            // 3. Domain
            let typeDomain = Normalizer.extractAndNormalizeDomainFromProtocolRemovedUrl();
            obj.type = typeDomain.type;
            obj.onlyDomain = typeDomain.domain;

            //console.log('modified_url : ' + Normalizer.modified_url);

            // 4. Port
            obj.port = Normalizer.extractAndNormalizePortFromDomainRemovedUrl();

            // 5. Finalize
            obj.normalizedUrl = Normalizer.finalizeNormalization(obj.protocol, obj.port, obj.onlyDomain);

            // 6. Params & URI
            let uriParams = Normalizer.extractAndNormalizeUriParamsFromPortRemovedUrl();
            obj.onlyUri = uriParams.uri;
            obj.onlyParams = uriParams.params;


            /* Chapter 2. Post normalizing process  (same as the function 'parseUrl')*/

            let onlyUri = obj.onlyUri;
            let onlyParams = obj.onlyParams;
            if (!onlyUri) {
                onlyUri = '';
            }
            if (!onlyParams) {
                onlyParams = '';
            }

            obj.onlyUriWithParams = onlyUri + onlyParams;
            if (!obj.onlyUriWithParams) {
                obj.onlyUriWithParams = null;
            }

            // 7. obj.onlyParams to JSON
            if (obj.onlyParams) {

                try {
                    obj.onlyParamsJsn = queryString.parse(obj.onlyParams);
                } catch (e1) {
                    console.log(e1);
                }

            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (obj.onlyUri === null && obj.onlyParams === null) {

                if (obj.type !== 'ip_v6') {
                    // removedTailOnUrl
                    let rm_part_matches = obj.normalizedUrl.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                    if (rm_part_matches) {
                        obj.removedTailOnUrl = rm_part_matches[0];
                        obj.normalizedUrl = obj.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                    }
                } else {

                    if (obj.port === null) {

                        // removedTailOnUrl
                        let rm_part_matches = obj.normalizedUrl.match(new RegExp('[^\\u005D]+$', 'gi'));
                        if (rm_part_matches) {
                            obj.removedTailOnUrl = rm_part_matches[0];
                            obj.normalizedUrl = obj.normalizedUrl.replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                        }

                    } else {

                        // removedTailOnUrl
                        let rm_part_matches = obj.normalizedUrl.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                        if (rm_part_matches) {
                            obj.removedTailOnUrl = rm_part_matches[0];
                            obj.normalizedUrl = obj.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                        }
                    }


                }

            } else if (obj.onlyUri !== null && obj.onlyParams === null) {

                if(obj.url) {

                    let rm_part_matches = new RegExp('\\/([^/\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(obj.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.normalizedUrl = obj.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }

                    }

                }

            } else if (obj.onlyParams !== null) {

                if(obj.url) {

                    let rm_part_matches = new RegExp('\\=([^=\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(obj.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.normalizedUrl = obj.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }

                    }
                }
            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.
            if (obj.type && obj.type === 'domain') {

                if (obj.onlyUri === null && obj.onlyParams === null) {

                    if (obj.port === null) {

                        if(obj.normalizedUrl) {

                            let onlyEnd = obj.normalizedUrl.match(new RegExp('[^.]+$', 'gi'));
                            if (onlyEnd && onlyEnd.length > 0) {

                                // this is a root domain only in English like com, ac
                                // but the situation is like com가, ac나
                                if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                                    if (/[^a-zA-Z]+$/.test(obj.normalizedUrl)) {

                                        // remove non alphabets
                                        const matchedNormalizeUrl = obj.normalizedUrl.match(/[^a-zA-Z]+$/);
                                        if(matchedNormalizeUrl && matchedNormalizeUrl.length > 0) {
                                            obj.removedTailOnUrl = matchedNormalizeUrl[0] + obj.removedTailOnUrl;
                                        }
                                        obj.normalizedUrl = obj.normalizedUrl.replace(/[^a-zA-Z]+$/, '');
                                    }
                                }

                            }
                        }
                    } else {
                        // this is a domain with no uri no params
                        let onlyEnd = obj.normalizedUrl.match(new RegExp('[^:]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a port num like 8000
                            if (/[0-9]/.test(onlyEnd[0])) {
                                if (/[^0-9]+$/.test(obj.normalizedUrl)) {

                                    // remove non numbers
                                    const matchedNormalizeUrl = obj.normalizedUrl.match(/[^0-9]+$/);
                                    if(matchedNormalizeUrl && matchedNormalizeUrl.length > 0) {
                                        obj.removedTailOnUrl = matchedNormalizeUrl[0] + obj.removedTailOnUrl;
                                    }
                                    obj.normalizedUrl = obj.normalizedUrl.replace(/[^0-9]+$/, '');
                                }
                            }

                        }

                    }

                }
            }


        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    },

    /**
     * @brief
     * Parse an url
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    parseUrl(url): ParsedUrl {

        let obj: ParsedUrl = {
            url: null,
            removedTailOnUrl: '',
            protocol: null,
            onlyDomain: null,
            onlyParams: null,
            onlyUri: null,
            onlyUriWithParams: null,
            onlyParamsJsn: null,
            type: null,
            port: null
        };

        try {

            url = Valid.checkIfStrOrFailAndTrimStr(url);

            url = Util.Text.removeAllSpaces(url);


            if (!Valid.isUrlPattern(url) && !Valid.isUriPattern(url)) {
                throw new Error('This is neither an url nor an uri.' + ' / Error url : ' + url);
            } else if (Valid.isEmailPattern(url)) {
                throw new Error('This is an email pattern.' + ' / Error url : ' + url);
            }


            // 1. full url
            obj.url = url;

            // 2. protocol
            let rx = new RegExp('^([a-zA-Z0-9]+):');

            let match = {};
            let isMatched = false;
            while ((match = rx.exec(url)) !== null) {

                if (match[1]) {

                    isMatched = true;

                    // exception case for rx
                    if (match[1] === 'localhost') {
                        obj.protocol = null;
                        break;
                    }

                    let rx2 = new RegExp(ProtocolPatterns.allProtocols, 'gi');

                    let match2 = {};
                    let isMatched2 = false;
                    while ((match2 = rx2.exec(match[1]) !== null)) {
                        obj.protocol = match[1];
                        isMatched2 = true;
                    }

                    if (!isMatched2) {
                        obj.protocol = match[1] + ' (unknown protocol)';
                    }

                    break;
                }

            }

            if (!isMatched) {
                obj.protocol = null;
            }

            // 3. Separate a domain and the 'UriWithParams'
            url = url.replace(/^(?:[a-zA-Z0-9]+:\/\/)/g, '');

            // 4. Separate params
            let rx3 = new RegExp('\\?(?:.|[\\s])*$', 'gi');
            let match3 = {};
            while ((match3 = rx3.exec(url)) !== null) {
                obj.onlyParams = match3[0];
            }
            url = url.replace(rx3, '');

            if (obj.onlyParams === "?") {
                obj.onlyParams = null;
            }

            // 5. Separate uri
            let rx2 = new RegExp('[#/](?:.|[\\s])*$', 'gi');
            let match2;
            while ((match2 = rx2.exec(url)) !== null) {
                obj.onlyUri = match2[0];
            }
            url = url.replace(rx2, '');

            if(obj.onlyUri!= null) {
                if (/^[#/]+$/.test(obj.onlyUri)) {
                    obj.onlyUri = null;
                }
            }

            // 6.
            let onlyUri = obj.onlyUri;
            let onlyParams = obj.onlyParams;
            if (!onlyUri) {
                onlyUri = '';
            }
            if (!onlyParams) {
                onlyParams = '';
            }

            obj.onlyUriWithParams = onlyUri + onlyParams;
            if (!obj.onlyUriWithParams) {
                obj.onlyUriWithParams = null;
            }

            // 7. obj.onlyParams to JSON
            if (obj.onlyParams) {

                try {
                    obj.onlyParamsJsn = queryString.parse(obj.onlyParams);
                } catch (e1) {
                    console.log(e1);
                }
            }

            // 8. port
            if (/:[0-9]+$/.test(url)) {
                obj.port = url.match(/[0-9]+$/)[0];
                url = url.replace(/:[0-9]+$/, '');
            }

            // 9.
            obj.onlyDomain = url;


            // 10. type : domain, ip, localhost
            if (new RegExp('^' + DomainPatterns.ipV4, 'i').test(url)) {
                obj.type = 'ip_v4';
            } else if (new RegExp('^' + DomainPatterns.ipV6, 'i').test(url)) {
                //console.log('r : ' + url);
                obj.type = 'ip_v6';
            } else if (/^localhost/i.test(url)) {
                obj.type = 'localhost';
            } else {
                obj.type = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (obj.onlyUri === null && obj.onlyParams === null) {

                if(obj.url) {

                    if (obj.type !== 'ip_v6') {
                        // removedTailOnUrl
                        let rm_part_matches = obj.url.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                        if (rm_part_matches) {
                            obj.removedTailOnUrl = rm_part_matches[0];
                            obj.url = obj.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                        }
                    } else {

                        if (obj.port === null) {

                            // removedTailOnUrl
                            let rm_part_matches = obj.url.match(new RegExp('[^\\u005D]+$', 'gi'));
                            if (rm_part_matches) {
                                obj.removedTailOnUrl = rm_part_matches[0];
                                obj.url = obj.url.replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                            }

                        } else {

                            // removedTailOnUrl
                            let rm_part_matches = obj.url.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                            if (rm_part_matches) {
                                obj.removedTailOnUrl = rm_part_matches[0];
                                obj.url = obj.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                            }
                        }


                    }

                }

            } else if (obj.onlyUri !== null && obj.onlyParams === null) {

                if(obj.url) {
                    let rm_part_matches = new RegExp('[#/]([^/\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(obj.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.url = obj.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }

                    }
                }

            } else if (obj.onlyParams !== null) {

                if(obj.url) {
                    let rm_part_matches = new RegExp('\\=([^=\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(obj.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.removedTailOnUrl = rm_part_matches[2];
                                    obj.url = obj.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }
                    }
                }
            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.
            if (obj.url && obj.type === 'domain') {

                if (obj.onlyUri === null && obj.onlyParams === null) {

                    if (obj.port === null) {

                        let onlyEnd = obj.url.match(new RegExp('[^.]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a root domain only in English like com, ac
                            // but the situation is like com가, ac나
                            if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                                if (/[^a-zA-Z]+$/.test(obj.url)) {

                                    // remove non alphabets
                                    const matchedObjUrl = obj.url.match(/[^a-zA-Z]+$/);
                                    if(matchedObjUrl && matchedObjUrl.length > 0) {
                                        obj.removedTailOnUrl = matchedObjUrl[0] + obj.removedTailOnUrl;
                                    }
                                    obj.url = obj.url.replace(/[^a-zA-Z]+$/, '');
                                }
                            }

                        }
                    } else {
                        // this is a domain with no uri no params
                        let onlyEnd = obj.url.match(new RegExp('[^:]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a port num like 8000
                            if (/[0-9]/.test(onlyEnd[0])) {
                                if (/[^0-9]+$/.test(obj.url)) {

                                    // remove non numbers
                                    const matchedObjUrl = obj.url.match(/[^0-9]+$/);
                                    if (matchedObjUrl && matchedObjUrl.length > 0) {
                                        obj.removedTailOnUrl = matchedObjUrl[0] + obj.removedTailOnUrl;
                                    }
                                    obj.url = obj.url.replace(/[^0-9]+$/, '');
                                }
                            }

                        }

                    }

                }
            }
            // 12. uri like 'abc/def'
            //if(!new RegExp('^' + BasePatterns.all_protocols + '|\\.' + BasePatterns.all_root_domains + '\\/|\\?','gi').test(obj.onlyDomain)){
            if (obj.url && !new RegExp(OptionalUrlPatternBuilder.getUrl, 'gi').test(obj.url)) {

                obj.onlyDomain = null;
                obj.type = 'uri';

                if (!/^[/]/.test(obj.url)) {

                    obj.onlyUriWithParams = obj.url;
                    obj.onlyUri = obj.url.replace(/\?[^/]*$/gi, '');
                }
            }

            //obj.normalizedUrl = this.normalizeUrl(obj.url)['normalizedUrl'];


            //}

        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    }

};

const Email = {
    assortEmail(email) {

        let obj : EmailInfo = {
            email: null,
            removedTailOnEmail: null,
            type: null
        };

        try {

            email = Valid.checkIfStrOrFailAndTrimStr(email);
            email = Util.Text.removeAllSpaces(email);

            if (!Valid.isEmailPattern(email)) {
                throw new Error('This is not an email pattern');
            }

            obj.email = email;

            if (new RegExp('@' + BasePatterns.everything + '*' + DomainPatterns.ipV4, 'i').test(email)) {
                obj.type = 'ip_v4';
            } else if (new RegExp('@' + BasePatterns.everything + '*' + DomainPatterns.ipV6, 'i').test(email)) {
                //console.log('r : ' + url);
                obj.type = 'ip_v6';
            } else {
                obj.type = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if(obj.email) {
                if (obj.type !== 'ip_v6') {
                    // removedTailOnUrl
                    let rm_part_matches = obj.email.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                    if (rm_part_matches) {
                        obj.removedTailOnEmail = rm_part_matches[0];
                        obj.email = obj.email.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                    }
                } else {

                    // removedTailOnUrl
                    let rm_part_matches = obj.email.match(new RegExp('[^\\u005D]+$', 'gi'));
                    if (rm_part_matches) {
                        obj.removedTailOnEmail = rm_part_matches[0];
                        obj.email = obj.email.replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                    }
                }


                // If no uri no params, we remove suffix in case that it is non-alphabets.
                // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.

                let onlyEnd = obj.email.match(new RegExp('[^.]+$', 'gi'));
                if (onlyEnd && onlyEnd.length > 0) {

                    // this is a root domain only in English like com, ac
                    // but the situation is like com가, ac나
                    if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                        if (/[^a-zA-Z]+$/.test(obj.email)) {

                            // remove non alphabets
                            const matchedEmail = obj.email.match(/[^a-zA-Z]+$/);
                            if(matchedEmail && matchedEmail.length > 0) {
                                obj.removedTailOnEmail = matchedEmail[0] + obj.removedTailOnEmail;
                            }
                            obj.email = obj.email.replace(/[^a-zA-Z]+$/, '');
                        }
                    }

            }
            }
        } catch (e) {

            console.log(e);

        } finally {

            return obj;

        }

    },
    strictTest(email) {

        // Test for total length of RFC-2821 etc...
        try {

            if (!email) return false;

            if (email.length > 256) return false;

            if (!/^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email)) return false;

            let [account, address] = email.split('@');
            if (account.length > 64) return false;

            let domainParts = address.split('.');
            if (domainParts.some(function (part) {
                return part.length > 63;
            })) return false;

            return true;

        } catch (e) {

            console.log(e);

            return false;

        }
    }
};

const Xml = {

    extractAllPureElements(xmlStr) {

        const rx = new RegExp(CommentPatterns.xml_element, "g");


        let matches = [];
        let match : RegExpExecArray | null;
        while ((match = rx.exec(xmlStr)) !== null) {

            //console.log(match[0].split(/[\t\s]+|>/)[0]);
            matches.push({
                'value': match[0],
                'elementName': match[0].split(/[\t\s]+|>/)[0].replace(/^</, ''),
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            })

        }

        return matches;

    },

    extractAllPureComments(xmlStr) {

        const rx = new RegExp(CommentPatterns.xml_comment, 'gi');

        let matches = [];
        let match : RegExpExecArray | null;

        while ((match = rx.exec(xmlStr)) !== null) {

            matches.push({
                'value': match[0],
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            })

        }

        return matches;

    },

};

export default {

    Text, Url, Xml
}