import {OptionalUrlPatternBuilder} from "./pattern/OptionalUrlPatternBuilder";
import {UriPatterns} from "./pattern/UriPatterns";
import {EmailPatternBuilder} from "./pattern/EmailPatternBuilder";
import {NoProtocolJsnParamType} from "./types";

/*
*    The statement "typeof sth === 'string'" may be considered unnecessary in TypeScript; however, I included it because this library is intended for use in a bundled JavaScript file.
* */
const Valid = {

    validateAndTrimString(sth: string): string {

        if (!(sth && typeof sth === 'string')) {

            throw new Error('the variable url must be a string type and not be null.');

        } else {

            sth = sth.trim();

        }

        return sth;

    },

    isUrlPattern(v: string) {
        return new RegExp('^' + OptionalUrlPatternBuilder.getUrl, 'gi').test(v);
    },
    isUriPattern(v: string) {
        return new RegExp('^' + UriPatterns.allUris, 'gi').test(v);
    },
    isEmailPattern(v: string) {
        return new RegExp('^' + EmailPatternBuilder.getEmail, 'gi').test(v);
    },

    checkIfProtocolJsnObjOrFail(noProtocolJsn: NoProtocolJsnParamType){

        if(!(noProtocolJsn && typeof noProtocolJsn === 'object' &&
                noProtocolJsn.hasOwnProperty('ipV4') && typeof noProtocolJsn.ipV4 === 'boolean' &&
                noProtocolJsn.hasOwnProperty('ipV6')  && typeof noProtocolJsn.ipV6 === 'boolean' &&
                noProtocolJsn.hasOwnProperty('localhost') && typeof noProtocolJsn.localhost === 'boolean' &&
                noProtocolJsn.hasOwnProperty('intranet') && typeof noProtocolJsn.intranet === 'boolean'
            )){

            throw new Error('Not a "noProtocolJsn{' +
                '\'ipV4\' : [boolean],' +
                '\'ipV6\' : [boolean],' +
                '\'localhost\' : [boolean],' +
                '\'intranet\' : [boolean]' +
                '}" object');

        }
    }

};

export default Valid;