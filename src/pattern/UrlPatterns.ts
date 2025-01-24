import {ProtocolPatterns} from "./ProtocolPatterns";
import {DomainPatterns} from "./DomainPatterns";
import {PortPatterns} from "./PortPatterns";
import {ParamsPatterns} from "./ParamsPatterns";
import {BasePatterns} from "./BasePatterns";

export class UrlPatterns  {

    /* 1. Original Url-Knife */
    static allUrlsFromKnife: string =
        ProtocolPatterns.getMandatoryAllProtocols +
    // localhost, ip v4, v6
    '(?:' + DomainPatterns.ipV4 + '|' + DomainPatterns.localhost + '|' + DomainPatterns.ipV6 + ')' +
    // port or not
    PortPatterns.optionalPort +
    // uri, params
    ParamsPatterns.optionalUrlParams

    /* 2. Validator.js */
    static allUrlsFromValidatorJs: string = '(?:' + ProtocolPatterns.allProtocols + '[\\s]*:[\\s]*/[\\s]*/[\\s]*)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?';

    /* 3. 'https://www.iana.org/domains/root/db' */
    static allUrlsFromIanaBody: string = ProtocolPatterns.getOptionalAllProtocols +
    '(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + DomainPatterns.rfc3986UnreservedNoAlphaNums + '|' + BasePatterns.langChar + ')' + '(?:\\.|(?:[0-9]|' + BasePatterns.twoBytesNum + '|' + DomainPatterns.rfc3986UnreservedNoAlphaNums + '|' + BasePatterns.langChar + '))*\\.';

    static allUrlsFromIanaTail: string = '(?:' + DomainPatterns.allRootDomains + '\\b)' +
    '(?:' + DomainPatterns.allRootDomains + '|\\.)*' +
    // port or not
    '(?:[\\s]*:[\\s]*[0-9]+|)' +
    // uri, params
    ParamsPatterns.optionalUrlParams;
}