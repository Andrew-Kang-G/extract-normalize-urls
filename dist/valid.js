"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OptionalUrlPatternBuilder_1 = require("./pattern/OptionalUrlPatternBuilder");
const UriPatterns_1 = require("./pattern/UriPatterns");
const EmailPatternBuilder_1 = require("./pattern/EmailPatternBuilder");
/*
*    The statement "typeof sth === 'string'" may be considered unnecessary in TypeScript; however, I included it because this library is intended for use in a bundled JavaScript file.
* */
const Valid = {
    validateAndTrimString(sth) {
        if (!(sth && typeof sth === 'string')) {
            throw new Error('the variable url must be a string type and not be null.');
        }
        else {
            sth = sth.trim();
        }
        return sth;
    },
    isUrlPattern(v) {
        return new RegExp('^' + OptionalUrlPatternBuilder_1.OptionalUrlPatternBuilder.getUrl, 'gi').test(v);
    },
    isUriPattern(v) {
        return new RegExp('^' + UriPatterns_1.UriPatterns.allUris, 'gi').test(v);
    },
    isEmailPattern(v) {
        return new RegExp('^' + EmailPatternBuilder_1.EmailPatternBuilder.getEmail, 'gi').test(v);
    },
    checkIfProtocolJsnObjOrFail(noProtocolJsn) {
        if (!(noProtocolJsn && typeof noProtocolJsn === 'object' &&
            noProtocolJsn.hasOwnProperty('ipV4') && typeof noProtocolJsn.ipV4 === 'boolean' &&
            noProtocolJsn.hasOwnProperty('ipV6') && typeof noProtocolJsn.ipV6 === 'boolean' &&
            noProtocolJsn.hasOwnProperty('localhost') && typeof noProtocolJsn.localhost === 'boolean' &&
            noProtocolJsn.hasOwnProperty('intranet') && typeof noProtocolJsn.intranet === 'boolean')) {
            throw new Error('Not a "noProtocolJsn{' +
                '\'ipV4\' : [boolean],' +
                '\'ipV6\' : [boolean],' +
                '\'localhost\' : [boolean],' +
                '\'intranet\' : [boolean]' +
                '}" object');
        }
    }
};
exports.default = Valid;
