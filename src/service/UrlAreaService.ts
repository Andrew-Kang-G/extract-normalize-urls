import {NormalizerType, ParsedUrlType, ParsedUrlWithNormalizationType} from "../types";
import Valid from "../valid";
import {Normalizer} from "../normalizer";
import Util from "../util";
import {BasePatterns} from "../pattern/BasePatterns";
import {ProtocolPatterns} from "../pattern/ProtocolPatterns";
import {DomainPatterns} from "../pattern/DomainPatterns";
import {SafeConditionalUrlPatternBuilder} from "../pattern/SafeConditionalUrlPatternBuilder";

const queryString = require('query-string');

export const UrlAreaService = {

    /**
     * @brief
     * Normalize an url or a fuzzy url
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url: string): ParsedUrlWithNormalizationType {

        let obj: ParsedUrlWithNormalizationType = {
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

            url = Valid.validateAndTrimString(url);


            /* Chapter 1. Normalizing process */

            Normalizer.modifiedUrl = Util.Text.removeAllSpaces(url);

            // 1. full url
            obj.url = url;

            // 2. protocol
            obj.protocol = Normalizer.extractAndNormalizeProtocolFromSpacesRemovedUrl();

            // 3. Domain
            let domainWithType: ReturnType<NormalizerType["extractAndNormalizeDomainFromProtocolRemovedUrl"]> = Normalizer.extractAndNormalizeDomainFromProtocolRemovedUrl();
            obj.type = domainWithType.type;
            obj.onlyDomain = domainWithType.domain;

            // 4. Port
            obj.port = Normalizer.extractAndNormalizePortFromDomainRemovedUrl();

            // 5. Finalize
            obj.normalizedUrl = Normalizer.finalizeNormalization(obj.protocol, obj.port, obj.onlyDomain);

            // 6. Params & URI
            let uriParams: ReturnType<NormalizerType["extractAndNormalizeUriParamsFromPortRemovedUrl"]> = Normalizer.extractAndNormalizeUriParamsFromPortRemovedUrl();
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

                if (obj.type !== 'ipV6') {
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
    parseUrl(url: string): ParsedUrlType {

        let obj: ParsedUrlType = {
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

            url = Valid.validateAndTrimString(url);

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

            let match: RegExpExecArray | null;
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
            let match3: RegExpExecArray | null;
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
                const portMatch = url.match(/[0-9]+$/);
                if (portMatch) {
                    obj.port = portMatch[0];
                    url = url.replace(/:[0-9]+$/, '');
                }
            }


            // 9.
            obj.onlyDomain = url;


            // 10. type : domain, ip, localhost
            if (new RegExp('^' + DomainPatterns.ipV4, 'i').test(url)) {
                obj.type = 'ipV4';
            } else if (new RegExp('^' + DomainPatterns.ipV6, 'i').test(url)) {
                //console.log('r : ' + url);
                obj.type = 'ipV6';
            } else if (/^localhost/i.test(url)) {
                obj.type = 'localhost';
            } else {
                obj.type = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (obj.onlyUri === null && obj.onlyParams === null) {

                if(obj.url) {

                    if (obj.type !== 'ipV6') {
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
            if (obj.url && !new RegExp(SafeConditionalUrlPatternBuilder.getUrl, 'gi').test(obj.url)) {

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