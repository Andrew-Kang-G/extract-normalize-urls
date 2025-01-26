import {NormalizerType, ParsedUrlComponents, ParsedUrlWithNormalizationComponents} from "../types";
import Valid from "../valid";

import Util from "../util";
import {BasePatterns} from "../pattern/BasePatterns";
import {ProtocolPatterns} from "../pattern/ProtocolPatterns";
import {DomainPatterns} from "../pattern/DomainPatterns";
import {SafeConditionalUrlPatternBuilder} from "../pattern/SafeConditionalUrlPatternBuilder";
import {UrlNormalizer} from "../bo/UrlNormalizer";

const queryString = require('query-string');

export const UrlAreaService = {

    /**
     * @brief
     * Normalize an url or a fuzzy url
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url: string): ParsedUrlWithNormalizationComponents {

        let survivedUrlComponents: ParsedUrlWithNormalizationComponents = {
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

            /* Chapter 1. Normalizing process */

            // 1. full url

            // Record the original URL
            survivedUrlComponents.url = url;

            UrlNormalizer.initializeSacrificedUrl(url);

            // 2. protocol
            survivedUrlComponents.protocol = UrlNormalizer.extractAndNormalizeProtocolFromSpacesRemovedUrl();

            // 3. Domain
            let domainWithType: ReturnType<NormalizerType["extractAndNormalizeDomainFromProtocolRemovedUrl"]> = UrlNormalizer.extractAndNormalizeDomainFromProtocolRemovedUrl();
            survivedUrlComponents.type = domainWithType.type;
            survivedUrlComponents.onlyDomain = domainWithType.domain;

            // 4. Port
            survivedUrlComponents.port = UrlNormalizer.extractAndNormalizePortFromDomainRemovedUrl();

            // 5. Finalize
            survivedUrlComponents.normalizedUrl = UrlNormalizer.extractNormalizedUrl(survivedUrlComponents.protocol, survivedUrlComponents.port, survivedUrlComponents.onlyDomain);

            // 6. Params & URI
            let uriParams: ReturnType<NormalizerType["extractAndNormalizeUriParamsFromPortRemovedUrl"]> = UrlNormalizer.extractAndNormalizeUriParamsFromPortRemovedUrl();
            survivedUrlComponents.onlyUri = uriParams.uri;
            survivedUrlComponents.onlyParams = uriParams.params;




            /* Chapter 2. Post normalizing process  (same as the function 'parseUrl')*/

            let onlyUri = survivedUrlComponents.onlyUri;
            let onlyParams = survivedUrlComponents.onlyParams;
            if (!onlyUri) {
                onlyUri = '';
            }
            if (!onlyParams) {
                onlyParams = '';
            }

            survivedUrlComponents.onlyUriWithParams = onlyUri + onlyParams;
            if (!survivedUrlComponents.onlyUriWithParams) {
                survivedUrlComponents.onlyUriWithParams = null;
            }

            // 7. obj.onlyParams to JSON
            if (survivedUrlComponents.onlyParams) {

                try {
                    survivedUrlComponents.onlyParamsJsn = queryString.parse(survivedUrlComponents.onlyParams);
                } catch (e1) {
                    console.log(e1);
                }

            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (survivedUrlComponents.onlyUri === null && survivedUrlComponents.onlyParams === null) {

                if (survivedUrlComponents.type !== 'ipV6') {
                    // removedTailOnUrl
                    let rm_part_matches = survivedUrlComponents.normalizedUrl.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                    if (rm_part_matches) {
                        survivedUrlComponents.removedTailOnUrl = rm_part_matches[0];
                        survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                    }
                } else {

                    if (survivedUrlComponents.port === null) {

                        // removedTailOnUrl
                        let rm_part_matches = survivedUrlComponents.normalizedUrl.match(new RegExp('[^\\u005D]+$', 'gi'));
                        if (rm_part_matches) {
                            survivedUrlComponents.removedTailOnUrl = rm_part_matches[0];
                            survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                        }

                    } else {

                        // removedTailOnUrl
                        let rm_part_matches = survivedUrlComponents.normalizedUrl.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                        if (rm_part_matches) {
                            survivedUrlComponents.removedTailOnUrl = rm_part_matches[0];
                            survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                        }
                    }


                }

            } else if (survivedUrlComponents.onlyUri !== null && survivedUrlComponents.onlyParams === null) {

                if(survivedUrlComponents.url) {

                    let rm_part_matches = new RegExp('\\/([^/\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(survivedUrlComponents.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    survivedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    survivedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }

                    }

                }

            } else if (survivedUrlComponents.onlyParams !== null) {

                if(survivedUrlComponents.url) {

                    let rm_part_matches = new RegExp('\\=([^=\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(survivedUrlComponents.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    survivedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    survivedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }

                    }
                }
            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.
            if (survivedUrlComponents.type && survivedUrlComponents.type === 'domain') {

                if (survivedUrlComponents.onlyUri === null && survivedUrlComponents.onlyParams === null) {

                    if (survivedUrlComponents.port === null) {

                        if(survivedUrlComponents.normalizedUrl) {

                            let onlyEnd = survivedUrlComponents.normalizedUrl.match(new RegExp('[^.]+$', 'gi'));
                            if (onlyEnd && onlyEnd.length > 0) {

                                // this is a root domain only in English like com, ac
                                // but the situation is like com가, ac나
                                if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                                    if (/[^a-zA-Z]+$/.test(survivedUrlComponents.normalizedUrl)) {

                                        // remove non alphabets
                                        const matchedNormalizeUrl = survivedUrlComponents.normalizedUrl.match(/[^a-zA-Z]+$/);
                                        if(matchedNormalizeUrl && matchedNormalizeUrl.length > 0) {
                                            survivedUrlComponents.removedTailOnUrl = matchedNormalizeUrl[0] + survivedUrlComponents.removedTailOnUrl;
                                        }
                                        survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(/[^a-zA-Z]+$/, '');
                                    }
                                }

                            }
                        }
                    } else {
                        // this is a domain with no uri no params
                        let onlyEnd = survivedUrlComponents.normalizedUrl.match(new RegExp('[^:]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a port num like 8000
                            if (/[0-9]/.test(onlyEnd[0])) {
                                if (/[^0-9]+$/.test(survivedUrlComponents.normalizedUrl)) {

                                    // remove non numbers
                                    const matchedNormalizeUrl = survivedUrlComponents.normalizedUrl.match(/[^0-9]+$/);
                                    if(matchedNormalizeUrl && matchedNormalizeUrl.length > 0) {
                                        survivedUrlComponents.removedTailOnUrl = matchedNormalizeUrl[0] + survivedUrlComponents.removedTailOnUrl;
                                    }
                                    survivedUrlComponents.normalizedUrl = survivedUrlComponents.normalizedUrl.replace(/[^0-9]+$/, '');
                                }
                            }

                        }

                    }

                }
            }


        } catch (e) {

            console.log(e);

        } finally {

            return survivedUrlComponents;

        }

    },

    /**
     * @brief
     * Parse an url
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    parseUrl(url: string): ParsedUrlComponents {

        let parsedUrlComponents: ParsedUrlComponents = {
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
            parsedUrlComponents.url = url;

            // 2. protocol
            let rx = new RegExp('^([a-zA-Z0-9]+):');

            let match: RegExpExecArray | null;
            let isMatched = false;
            while ((match = rx.exec(url)) !== null) {

                if (match[1]) {

                    isMatched = true;

                    // exception case for rx
                    if (match[1] === 'localhost') {
                        parsedUrlComponents.protocol = null;
                        break;
                    }

                    let rx2 = new RegExp(ProtocolPatterns.allProtocols, 'gi');

                    let match2 = {};
                    let isMatched2 = false;
                    while ((match2 = rx2.exec(match[1]) !== null)) {
                        parsedUrlComponents.protocol = match[1];
                        isMatched2 = true;
                    }

                    if (!isMatched2) {
                        parsedUrlComponents.protocol = match[1] + ' (unknown protocol)';
                    }

                    break;
                }

            }

            if (!isMatched) {
                parsedUrlComponents.protocol = null;
            }

            // 3. Separate a domain and the 'UriWithParams'
            url = url.replace(/^(?:[a-zA-Z0-9]+:\/\/)/g, '');

            // 4. Separate params
            let rx3 = new RegExp('\\?(?:.|[\\s])*$', 'gi');
            let match3: RegExpExecArray | null;
            while ((match3 = rx3.exec(url)) !== null) {
                parsedUrlComponents.onlyParams = match3[0];
            }
            url = url.replace(rx3, '');

            if (parsedUrlComponents.onlyParams === "?") {
                parsedUrlComponents.onlyParams = null;
            }

            // 5. Separate uri
            let rx2 = new RegExp('[#/](?:.|[\\s])*$', 'gi');
            let match2;
            while ((match2 = rx2.exec(url)) !== null) {
                parsedUrlComponents.onlyUri = match2[0];
            }
            url = url.replace(rx2, '');

            if(parsedUrlComponents.onlyUri!= null) {
                if (/^[#/]+$/.test(parsedUrlComponents.onlyUri)) {
                    parsedUrlComponents.onlyUri = null;
                }
            }

            // 6.
            let onlyUri = parsedUrlComponents.onlyUri;
            let onlyParams = parsedUrlComponents.onlyParams;
            if (!onlyUri) {
                onlyUri = '';
            }
            if (!onlyParams) {
                onlyParams = '';
            }

            parsedUrlComponents.onlyUriWithParams = onlyUri + onlyParams;
            if (!parsedUrlComponents.onlyUriWithParams) {
                parsedUrlComponents.onlyUriWithParams = null;
            }

            // 7. obj.onlyParams to JSON
            if (parsedUrlComponents.onlyParams) {

                try {
                    parsedUrlComponents.onlyParamsJsn = queryString.parse(parsedUrlComponents.onlyParams);
                } catch (e1) {
                    console.log(e1);
                }
            }

            // 8. port
            if (/:[0-9]+$/.test(url)) {
                const portMatch = url.match(/[0-9]+$/);
                if (portMatch) {
                    parsedUrlComponents.port = portMatch[0];
                    url = url.replace(/:[0-9]+$/, '');
                }
            }


            // 9.
            parsedUrlComponents.onlyDomain = url;


            // 10. type : domain, ip, localhost
            if (new RegExp('^' + DomainPatterns.ipV4, 'i').test(url)) {
                parsedUrlComponents.type = 'ipV4';
            } else if (new RegExp('^' + DomainPatterns.ipV6, 'i').test(url)) {
                //console.log('r : ' + url);
                parsedUrlComponents.type = 'ipV6';
            } else if (/^localhost/i.test(url)) {
                parsedUrlComponents.type = 'localhost';
            } else {
                parsedUrlComponents.type = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if (parsedUrlComponents.onlyUri === null && parsedUrlComponents.onlyParams === null) {

                if(parsedUrlComponents.url) {

                    if (parsedUrlComponents.type !== 'ipV6') {
                        // removedTailOnUrl
                        let rm_part_matches = parsedUrlComponents.url.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                        if (rm_part_matches) {
                            parsedUrlComponents.removedTailOnUrl = rm_part_matches[0];
                            parsedUrlComponents.url = parsedUrlComponents.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                        }
                    } else {

                        if (parsedUrlComponents.port === null) {

                            // removedTailOnUrl
                            let rm_part_matches = parsedUrlComponents.url.match(new RegExp('[^\\u005D]+$', 'gi'));
                            if (rm_part_matches) {
                                parsedUrlComponents.removedTailOnUrl = rm_part_matches[0];
                                parsedUrlComponents.url = parsedUrlComponents.url.replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                            }

                        } else {

                            // removedTailOnUrl
                            let rm_part_matches = parsedUrlComponents.url.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                            if (rm_part_matches) {
                                parsedUrlComponents.removedTailOnUrl = rm_part_matches[0];
                                parsedUrlComponents.url = parsedUrlComponents.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                            }
                        }


                    }

                }

            } else if (parsedUrlComponents.onlyUri !== null && parsedUrlComponents.onlyParams === null) {

                if(parsedUrlComponents.url) {
                    let rm_part_matches = new RegExp('[#/]([^/\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(parsedUrlComponents.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    parsedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    parsedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    parsedUrlComponents.url = parsedUrlComponents.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }

                    }
                }

            } else if (parsedUrlComponents.onlyParams !== null) {

                if(parsedUrlComponents.url) {
                    let rm_part_matches = new RegExp('\\=([^=\\s]+?)(' + BasePatterns.noLangCharNum + '+)$', 'gi').exec(parsedUrlComponents.url);

                    if (rm_part_matches) {
                        if (rm_part_matches[1]) {
                            if (!new RegExp(BasePatterns.noLangCharNum, 'gi').test(rm_part_matches[1])) {
                                if (rm_part_matches[2]) {
                                    parsedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    parsedUrlComponents.removedTailOnUrl = rm_part_matches[2];
                                    parsedUrlComponents.url = parsedUrlComponents.url.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                                }
                            }
                        }
                    }
                }
            }


            // If no uri no params, we remove suffix in case that it is non-alphabets.
            // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.
            if (parsedUrlComponents.url && parsedUrlComponents.type === 'domain') {

                if (parsedUrlComponents.onlyUri === null && parsedUrlComponents.onlyParams === null) {

                    if (parsedUrlComponents.port === null) {

                        let onlyEnd = parsedUrlComponents.url.match(new RegExp('[^.]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a root domain only in English like com, ac
                            // but the situation is like com가, ac나
                            if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                                if (/[^a-zA-Z]+$/.test(parsedUrlComponents.url)) {

                                    // remove non alphabets
                                    const matchedObjUrl = parsedUrlComponents.url.match(/[^a-zA-Z]+$/);
                                    if(matchedObjUrl && matchedObjUrl.length > 0) {
                                        parsedUrlComponents.removedTailOnUrl = matchedObjUrl[0] + parsedUrlComponents.removedTailOnUrl;
                                    }
                                    parsedUrlComponents.url = parsedUrlComponents.url.replace(/[^a-zA-Z]+$/, '');
                                }
                            }

                        }
                    } else {
                        // this is a domain with no uri no params
                        let onlyEnd = parsedUrlComponents.url.match(new RegExp('[^:]+$', 'gi'));
                        if (onlyEnd && onlyEnd.length > 0) {

                            // this is a port num like 8000
                            if (/[0-9]/.test(onlyEnd[0])) {
                                if (/[^0-9]+$/.test(parsedUrlComponents.url)) {

                                    // remove non numbers
                                    const matchedObjUrl = parsedUrlComponents.url.match(/[^0-9]+$/);
                                    if (matchedObjUrl && matchedObjUrl.length > 0) {
                                        parsedUrlComponents.removedTailOnUrl = matchedObjUrl[0] + parsedUrlComponents.removedTailOnUrl;
                                    }
                                    parsedUrlComponents.url = parsedUrlComponents.url.replace(/[^0-9]+$/, '');
                                }
                            }

                        }

                    }

                }
            }
            // 12. uri like 'abc/def'
            //if(!new RegExp('^' + BasePatterns.all_protocols + '|\\.' + BasePatterns.all_root_domains + '\\/|\\?','gi').test(obj.onlyDomain)){
            if (parsedUrlComponents.url && !new RegExp(SafeConditionalUrlPatternBuilder.getUrl, 'gi').test(parsedUrlComponents.url)) {

                parsedUrlComponents.onlyDomain = null;
                parsedUrlComponents.type = 'uri';

                if (!/^[/]/.test(parsedUrlComponents.url)) {

                    parsedUrlComponents.onlyUriWithParams = parsedUrlComponents.url;
                    parsedUrlComponents.onlyUri = parsedUrlComponents.url.replace(/\?[^/]*$/gi, '');
                }
            }

        } catch (e) {

            console.log(e);

        } finally {

            return parsedUrlComponents;

        }

    }

};