import Service from './service';
import {NoProtocolJsnType} from "./types";
import {OptionalUrlPatternBuilder} from "./pattern/OptionalUrlPatternBuilder";
import {DomainPatterns} from "./pattern/DomainPatterns";
import {CommentPatterns} from "./pattern/CommentPatterns";
import {EmailPatternBuilder} from "./pattern/EmailPatternBuilder";
import {BasePatterns} from "./pattern/BasePatterns";


/*
*     All Public
* */

const TextArea = {


    /**
     * @brief
     * Distill all urls in texts
     * @author Andrew Kang
     * @param textStr string required
     * @param noProtocolJsn object
     *    default :  {
                'ip_v4' : false,
                'ip_v6' : false,
                'localhost' : false,
                'intranet' : false
            }

     * @return array
     */
    extractAllUrls(
        textStr: string,
        noProtocolJsn: NoProtocolJsnType = {
            ip_v4: false,
            ip_v6: false,
            localhost: false,
            intranet: false
        }
    ){


        OptionalUrlPatternBuilder.setUrlPattern(noProtocolJsn);

        //console.log('a : ' + Pattern.Children.url);

        return Service.Text.extractAllPureUrls(textStr);

    },


    /**
     * @brief
     * Distill all emails from normal text
     * @author Andrew Kang
     * @param textStr string required
     * @param prefixSanitizer boolean (default : true)
     * @return array
     */
    extractAllEmails(textStr: string, prefixSanitizer: boolean = true) {

        return Service.Text.extractAllPureEmails(textStr, prefixSanitizer);

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
    extractCertainUris(textStr: string, uris: Array<string>, endBoundary: boolean = false) {

        if (!(textStr && typeof textStr === 'string')) {
            throw new Error('the variable textStr must be a string type and not be null.');
        }

        let obj = Service.Text.extractCertainPureUris(textStr, uris, endBoundary);
        let obj2 = Service.Text.extractAllPureUrls(textStr);


        //console.log('obj : ' + JSON.stringify(obj));

        let obj_final = [];

        for (let a = 0; a < obj.length; a++) {

            let obj_part = {
                'uri_detected': null,
                'in_what_url': null,
            };

            //let matchedUrlFound = false;
            for (let b = 0; b < obj2.length; b++) {

                /*           console.log('obj : ' + JSON.stringify(obj[a]));
                           console.log('obj2 : ' + JSON.stringify(obj2[b]));*/

                if ((obj[a]['index']['start'] > obj2[b]['index']['start'] && obj[a]['index']['start'] < obj2[b]['index']['end'])
                    &&
                    (obj[a]['index']['end'] > obj2[b]['index']['start'] && obj[a]['index']['end'] <= obj2[b]['index']['end'])) {

                    // Here, the uri detected is inside its url
                    // false positives like the example '//google.com/abc/def?a=5&b=7' can be detected in 'Service.Text.extractCertainPureUris'

                    let sanitizedUrl = obj[a]['value']['url'];

                    let rx = new RegExp('^(\\/\\/[^/]*|\\/[^\\s]+\\.' + DomainPatterns.allRootDomains + ')', 'gi');
                    let matches = [];
                    let match = {};

                    while ((match = rx.exec(obj[a]['value']['url'])) !== null) {
                        if (match[1]) {

                            sanitizedUrl = sanitizedUrl.replace(rx, '');

                            //console.log(match[1]);

                            obj[a]['value']['url'] = sanitizedUrl;
                            obj[a]['index']['start'] += match[1].length;

                            obj[a]['value']['onlyUriWithParams'] = obj[a]['value']['url'];
                            obj[a]['value']['onlyUri'] = obj[a]['value']['url'].replace(/\?[^/]*$/gi, '');
                        }
                    }


                    obj_part.in_what_url = obj2[b];
                    //matchedUrlFound = true;

                }


            }

            obj_part.uri_detected = obj[a];
            obj_final.push(obj_part);

        }


        return obj_final;

    },


};

const UrlArea = {

    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    parseUrl(url: string) {

        return Service.Url.parseUrl(url);
    },

    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url: string) {

        return Service.Url.normalizeUrl(url);
    }

};

const XmlArea = {


    /**
     *
     * @brief
     * Distill all opening tags with each 'elementName'.
     * @author Andrew Kang
     * @param xmlStr string required
     * @return array
     *
     */
    extractAllElements(xmlStr: string) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }

        const cmt_matches = Service.Xml.extractAllPureComments(xmlStr);

        let matches = Service.Xml.extractAllPureElements(xmlStr);


        for (let a = 0; a < matches.length; a++) {
            for (let i = 0; i < cmt_matches.length; i++) {
                if (cmt_matches[i].startIndex < matches[a].startIndex && matches[a].lastIndex < cmt_matches[i].lastIndex) {

                    matches[a]['commentArea'] = true;
                    break;

                }
            }

            if (matches[a]['commentArea'] !== true) {
                matches[a]['commentArea'] = false;
            }

        }


        return matches;

    },

    /**
     * @brief
     * Distill all comments. Comments inside tags are ignored.
     * @author Andrew Kang
     * @param xmlStr string required
     * @return array
     */
    extractAllComments(xmlStr: string) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }

        let el_matches = Service.Xml.extractAllPureElements(xmlStr);
        let matches = Service.Xml.extractAllPureComments(xmlStr);

        el_matches = el_matches.reverse();
        matches = matches.reverse();

        matches.forEach(function (val, idx) {

            for (let i = 0; i < el_matches.length; i++) {
                if (el_matches[i].startIndex < val.startIndex && val.lastIndex < el_matches[i].lastIndex) {

                    delete matches[idx];
                    break;

                }
            }
        });


        return matches;

    },

    /**
     * @brief
     * Distill all urls from normal text, tags, comments in html
     * @author Andrew Kang
     * @param xmlStr string required
     * @param skipXml boolean (default : false)
     * @param noProtocolJsn object
     *    default :  {
                'ip_v4' : false,
                'ip_v6' : false,
                'localhost' : false,
                'intranet' : false
            }
     * @return array
     */
    extractAllUrls(xmlStr: string, skipXml = false, noProtocolJsn: NoProtocolJsnType) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }

        OptionalUrlPatternBuilder.setUrlPattern(noProtocolJsn);

        let obj = [];

        if (!skipXml) {

            let cmt_matches = XmlArea.extractAllComments(xmlStr);
            let el_matches = XmlArea.extractAllElements(xmlStr);

            /* 1. comment */
            for (let a = 0; a < cmt_matches.length; a++) {

                let rx = new RegExp(OptionalUrlPatternBuilder.getUrl, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(cmt_matches[a].value)) !== null) {

                    /* remove email patterns related to 'all_urls3_front' regex */
                    if (/^@/.test(match[0])) {
                        continue;
                    }

                    /* comment - regex conflict case handler */
                    let mod_val = match[0].replace(/-->$/, '');

                    //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    //mod_val = mod_val.trim();

                    obj.push({
                        'value': Service.Url.parseUrl(mod_val),
                        'area': 'comment'
                    });

                }

            }

            /* 2. element */
            for (let a = 0; a < el_matches.length; a++) {

                let rx = new RegExp(OptionalUrlPatternBuilder.getUrl, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(el_matches[a].value)) !== null) {

                    /* remove email patterns related to 'all_urls3_front' regex */
                    if (/^@/.test(match[0])) {
                        continue;
                    }


                    /* attribute value - regex conflict case handler */
                    let mod_val = match[0].replace(new RegExp('[\\u0022\\u0027](?:[\\t\\s]+|[\\t\\s]*/[\\t\\s]*)(?:>|)', 'gi'), '');

                    //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    //mod_val = mod_val.trim();

                    obj.push({
                        'value': Service.Url.parseUrl(mod_val),
                        'area': 'element : ' + el_matches[a].elementName
                    });

                }

            }

            /* 3. Remove all comments */
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns.xml_comment, 'gi'), '');

            /* 4. Remove all elements */
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns.xml_element, "g"), '');


        }


        /* check if all comments and elements have been removed properly */
        //console.log('xmlStr : ' + xmlStr);

        /* 5. normal text area */
        let rx = new RegExp(OptionalUrlPatternBuilder.getUrl, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(xmlStr)) !== null) {

            /* remove email patterns related to 'all_urls3_front' regex */
            if (/^@/.test(match[0])) {
                continue;
            }

            let mod_val = match[0];
            //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');

            obj.push({
                'value': Service.Url.parseUrl(mod_val),
                'area': 'text'
            });
        }


        return obj;

    },

    /**
     * @brief
     * Distill all emails from normal text, tags, comments in html
     * @author Andrew Kang
     * @param xmlStr string required
     * @param prefixSanitizer boolean (default : true)
     * @param skipXml boolean (default : false)
     * @return array
     */
    extractAllEmails(xmlStr: string, prefixSanitizer: boolean = true, skipXml: boolean = false) {

        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }

        let final_prefixSanitizer = null;
        if (prefixSanitizer) {
            final_prefixSanitizer = true;
        } else {
            if (prefixSanitizer === false) {
                final_prefixSanitizer = false;
            } else {
                final_prefixSanitizer = true;
            }
        }

        let obj = [];

        if (!skipXml) {

            let cmt_matches = XmlArea.extractAllComments(xmlStr);
            let el_matches = XmlArea.extractAllElements(xmlStr);

            /* 1. comment */
            for (let a = 0; a < cmt_matches.length; a++) {

                let rx = new RegExp(EmailPatternBuilder.getEmail, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(cmt_matches[a].value)) !== null) {

                    /* comment - regex conflict case handler */
                    let mod_val = match[0].replace(/-->$/, '');

                    mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    mod_val = mod_val.trim();

                    let mod_val_front = mod_val.split(/@/)[0];

                    /* prefixSanitizer */
                    if (final_prefixSanitizer === true) {

                        //mod_val = mod_val.replace(new RegExp('^[^0-9\\p{L}]+', 'u'), '');

                        let border = '';
                        let rx_border = new RegExp('^[^a-zA-Z0-9]+([a-zA-Z0-9])', 'gi');
                        let is_mod_val_front_only_foreign_lang = true;
                        while ((match = rx_border.exec(mod_val_front)) !== null) {

                            is_mod_val_front_only_foreign_lang = false;
                            border = match[1];

                        }

                        if (is_mod_val_front_only_foreign_lang === false) {

                            mod_val = mod_val.replace(rx_border, '');
                            mod_val = border + mod_val;
                        }

                    }

                    obj.push({
                        'value': mod_val,
                        'area': 'comment'
                    });

                }

            }

            /* 2. element */
            for (let a = 0; a < el_matches.length; a++) {

                let rx = new RegExp(EmailPatternBuilder.getEmail, 'gi');

                let matches = [];
                let match = {};

                while ((match = rx.exec(el_matches[a].value)) !== null) {

                    /* attribute value - regex conflict case handler */
                    let mod_val = match[0].replace(new RegExp('[\\u0022\\u0027](?:[\\t\\s]+|[\\t\\s]*/[\\t\\s]*)(?:>|)', 'gi'), '');

                    mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    mod_val = mod_val.trim();

                    let mod_val_front = mod_val.split(/@/)[0];

                    /* prefixSanitizer */
                    if (final_prefixSanitizer === true) {

                        //mod_val = mod_val.replace(new RegExp('^[^0-9\\p{L}]+', 'u'), '');

                        let border = '';
                        let rx_border = new RegExp('^[^a-zA-Z0-9]+([a-zA-Z0-9])', 'gi');
                        let is_mod_val_front_only_foreign_lang = true;
                        while ((match = rx_border.exec(mod_val_front)) !== null) {

                            is_mod_val_front_only_foreign_lang = false;
                            border = match[1];

                        }

                        if (is_mod_val_front_only_foreign_lang === false) {
                            mod_val = mod_val.replace(rx_border, '');
                            mod_val = border + mod_val;
                        }

                    }


                    obj.push({
                        'value': mod_val,
                        'area': 'element : ' + el_matches[a].elementName
                    });

                }

            }

            /* 3. Remove all comments */
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns.xml_comment, 'gi'), '');

            /* 4. Remove all elements */
            const elementRegex = '(?:' + BasePatterns.langChar + '[^<>\\u0022\\u0027\\t\\s]*)';
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns.xml_element, "g"), '');

        }

        /* 5. normal text area */
        let rx = new RegExp(EmailPatternBuilder.getEmail, 'gi');

        let matches = [];
        let match = {};

        while ((match = rx.exec(xmlStr)) !== null) {

            let mod_val = match[0];

            mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
            mod_val = mod_val.trim();

            let mod_val_front = mod_val.split(/@/)[0];

            /* prefixSanitizer */
            if (final_prefixSanitizer === true) {

                //mod_val = mod_val.replace(new RegExp('^[^0-9\\p{L}]+', 'u'), '');

                let border = '';
                let rx_border = new RegExp('^[^a-zA-Z0-9]+([a-zA-Z0-9])', 'gi');
                let is_mod_val_front_only_foreign_lang = true;
                while ((match = rx_border.exec(mod_val_front)) !== null) {

                    is_mod_val_front_only_foreign_lang = false;
                    border = match[1];

                }

                if (is_mod_val_front_only_foreign_lang === false) {
                    mod_val = mod_val.replace(rx_border, '');
                    mod_val = border + mod_val;
                }

            }

            obj.push({
                'value': mod_val,
                'area': 'text'
            });
        }

        return obj;

    }

};

export default {
    TextArea,
    UrlArea,
    XmlArea
};