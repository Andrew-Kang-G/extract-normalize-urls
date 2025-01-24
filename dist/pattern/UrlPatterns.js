"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlPatterns = void 0;
const ProtocolPatterns_1 = require("./ProtocolPatterns");
const DomainPatterns_1 = require("./DomainPatterns");
const PortPatterns_1 = require("./PortPatterns");
const ParamsPatterns_1 = require("./ParamsPatterns");
const BasePatterns_1 = require("./BasePatterns");
class UrlPatterns {
}
exports.UrlPatterns = UrlPatterns;
/* 1. Original Url-Knife */
UrlPatterns.allUrlsFromKnife = ProtocolPatterns_1.ProtocolPatterns.getMandatoryAllProtocols +
    // localhost, ip v4, v6
    '(?:' + DomainPatterns_1.DomainPatterns.ipV4 + '|' + DomainPatterns_1.DomainPatterns.localhost + '|' + DomainPatterns_1.DomainPatterns.ipV6 + ')' +
    // port or not
    PortPatterns_1.PortPatterns.optionalPort +
    // uri, params
    ParamsPatterns_1.ParamsPatterns.optionalUrlParams;
/* 2. Validator.js */
UrlPatterns.allUrlsFromValidatorJs = '(?:' + ProtocolPatterns_1.ProtocolPatterns.allProtocols + '[\\s]*:[\\s]*/[\\s]*/[\\s]*)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?';
/* 3. 'https://www.iana.org/domains/root/db' */
UrlPatterns.allUrlsFromIanaBody = ProtocolPatterns_1.ProtocolPatterns.getOptionalAllProtocols +
    '(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + DomainPatterns_1.DomainPatterns.rfc3986UnreservedNoAlphaNums + '|' + BasePatterns_1.BasePatterns.langChar + ')' + '(?:\\.|(?:[0-9]|' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + DomainPatterns_1.DomainPatterns.rfc3986UnreservedNoAlphaNums + '|' + BasePatterns_1.BasePatterns.langChar + '))*\\.';
UrlPatterns.allUrlsFromIanaTail = '(?:' + DomainPatterns_1.DomainPatterns.allRootDomains + '\\b)' +
    '(?:' + DomainPatterns_1.DomainPatterns.allRootDomains + '|\\.)*' +
    // port or not
    '(?:[\\s]*:[\\s]*[0-9]+|)' +
    // uri, params
    ParamsPatterns_1.ParamsPatterns.optionalUrlParams;
