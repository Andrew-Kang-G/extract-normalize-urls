"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlAreaApi = void 0;
const SafeConditionalUrlPatternBuilder_1 = require("../pattern/SafeConditionalUrlPatternBuilder");
const CommentPatterns_1 = require("../pattern/CommentPatterns");
const EmailPatternBuilder_1 = require("../pattern/EmailPatternBuilder");
const BasePatterns_1 = require("../pattern/BasePatterns");
const XmlAreaService_1 = require("../service/XmlAreaService");
const UrlAreaService_1 = require("../service/UrlAreaService");
exports.XmlAreaApi = {
    /**
     *
     * @brief
     * Distill all opening tags with each 'elementName'.
     * @author Andrew Kang
     * @param xmlStr string required
     * @return array
     *
     */
    extractAllElements(xmlStr) {
        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }
        const cmtMatches = XmlAreaService_1.XmlAreaService.extractAllPureComments(xmlStr);
        let matches = XmlAreaService_1.XmlAreaService.extractAllPureElements(xmlStr);
        for (let a = 0; a < matches.length; a++) {
            for (let i = 0; i < cmtMatches.length; i++) {
                if (cmtMatches[i].startIndex < matches[a].startIndex && matches[a].lastIndex < cmtMatches[i].lastIndex) {
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
    extractAllComments(xmlStr) {
        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }
        let el_matches = XmlAreaService_1.XmlAreaService.extractAllPureElements(xmlStr);
        let matches = XmlAreaService_1.XmlAreaService.extractAllPureComments(xmlStr);
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
     'ipV4' : false,
     'ipV6' : false,
     'localhost' : false,
     'intranet' : false
     }
     * @return array
     */
    extractAllUrls(xmlStr, skipXml = false, noProtocolJsn) {
        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }
        SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.setUrlPattern(noProtocolJsn);
        let obj = [];
        if (!skipXml) {
            let cmtMatches = exports.XmlAreaApi.extractAllComments(xmlStr);
            let elMatches = exports.XmlAreaApi.extractAllElements(xmlStr);
            /* 1. comment */
            for (let a = 0; a < cmtMatches.length; a++) {
                let rx = new RegExp(SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.getUrl, 'gi');
                let matches = [];
                let match;
                while ((match = rx.exec(cmtMatches[a].value)) !== null) {
                    /* remove email patterns related to 'all_urls3_front' regex */
                    if (/^@/.test(match[0])) {
                        continue;
                    }
                    /* comment - regex conflict case handler */
                    let mod_val = match[0].replace(/-->$/, '');
                    //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    //mod_val = mod_val.trim();
                    obj.push({
                        'value': UrlAreaService_1.UrlAreaService.parseUrl(mod_val),
                        'area': 'comment'
                    });
                }
            }
            /* 2. element */
            for (let a = 0; a < elMatches.length; a++) {
                let rx = new RegExp(SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.getUrl, 'gi');
                let matches = [];
                let match;
                while ((match = rx.exec(elMatches[a].value)) !== null) {
                    /* remove email patterns related to 'all_urls3_front' regex */
                    if (/^@/.test(match[0])) {
                        continue;
                    }
                    /* attribute value - regex conflict case handler */
                    let mod_val = match[0].replace(new RegExp('[\\u0022\\u0027](?:[\\t\\s]+|[\\t\\s]*/[\\t\\s]*)(?:>|)', 'gi'), '');
                    //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
                    //mod_val = mod_val.trim();
                    obj.push({
                        'value': UrlAreaService_1.UrlAreaService.parseUrl(mod_val),
                        'area': 'element : ' + elMatches[a].elementName
                    });
                }
            }
            /* 3. Remove all comments */
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns_1.CommentPatterns.xml_comment, 'gi'), '');
            /* 4. Remove all elements */
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns_1.CommentPatterns.xml_element, "g"), '');
        }
        /* check if all comments and elements have been removed properly */
        //console.log('xmlStr : ' + xmlStr);
        /* 5. normal text area */
        let rx = new RegExp(SafeConditionalUrlPatternBuilder_1.SafeConditionalUrlPatternBuilder.getUrl, 'gi');
        let matches = [];
        let match;
        while ((match = rx.exec(xmlStr)) !== null) {
            /* remove email patterns related to 'all_urls3_front' regex */
            if (/^@/.test(match[0])) {
                continue;
            }
            let mod_val = match[0];
            //mod_val = mod_val.replace(/[\n\r\t\s]/g, '');
            obj.push({
                'value': UrlAreaService_1.UrlAreaService.parseUrl(mod_val),
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
    extractAllEmails(xmlStr, prefixSanitizer = true, skipXml = false) {
        if (!(xmlStr && typeof xmlStr === 'string')) {
            throw new Error('the variable xmlStr must be a string type and not be null.');
        }
        let final_prefixSanitizer = null;
        if (prefixSanitizer) {
            final_prefixSanitizer = true;
        }
        else {
            if (prefixSanitizer === false) {
                final_prefixSanitizer = false;
            }
            else {
                final_prefixSanitizer = true;
            }
        }
        let obj = [];
        if (!skipXml) {
            let cmt_matches = exports.XmlAreaApi.extractAllComments(xmlStr);
            let el_matches = exports.XmlAreaApi.extractAllElements(xmlStr);
            /* 1. comment */
            for (let a = 0; a < cmt_matches.length; a++) {
                let rx = new RegExp(EmailPatternBuilder_1.EmailPatternBuilder.getEmail, 'gi');
                let matches = [];
                let match;
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
                let rx = new RegExp(EmailPatternBuilder_1.EmailPatternBuilder.getEmail, 'gi');
                let matches = [];
                let match;
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
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns_1.CommentPatterns.xml_comment, 'gi'), '');
            /* 4. Remove all elements */
            const elementRegex = '(?:' + BasePatterns_1.BasePatterns.langChar + '[^<>\\u0022\\u0027\\t\\s]*)';
            xmlStr = xmlStr.replace(new RegExp(CommentPatterns_1.CommentPatterns.xml_element, "g"), '');
        }
        /* 5. normal text area */
        let rx = new RegExp(EmailPatternBuilder_1.EmailPatternBuilder.getEmail, 'gi');
        let matches = [];
        let match;
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
