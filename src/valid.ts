

/*
*     Private : Validation Check
* */
import {OptionalUrlPatternBuilder} from "./pattern/OptionalUrlPatternBuilder";
import {UriPatterns} from "./pattern/UriPatterns";
import {EmailPatternBuilder} from "./pattern/EmailPatternBuilder";
import {NoProtocolJsnType} from "./types";

const Valid = {

    checkIfStrOrFailAndTrimStr(sth): string {

        if (!(sth && typeof sth === 'string')) {

            throw new Error('the variable url must be a string type and not be null.');

        } else {

            sth = sth.trim();

        }

        return sth;

    },

    isUrlPattern(v) {
        return new RegExp('^' + OptionalUrlPatternBuilder.getUrl, 'gi').test(v);
    },
    isUriPattern(v) {
        return new RegExp('^' + UriPatterns.allUris, 'gi').test(v);
    },

    isEmailPattern(v) {
        return new RegExp('^' + EmailPatternBuilder.getEmail, 'gi').test(v);
    },

    checkIfProtocolJsnObjOrFail(noProtocolJsn: NoProtocolJsnType){

        if(!(noProtocolJsn && typeof noProtocolJsn === 'object' &&
                noProtocolJsn.hasOwnProperty('ip_v4') && typeof noProtocolJsn.ip_v4 === 'boolean' &&
                noProtocolJsn.hasOwnProperty('ip_v6')  && typeof noProtocolJsn.ip_v6 === 'boolean' &&
                noProtocolJsn.hasOwnProperty('localhost') && typeof noProtocolJsn.localhost === 'boolean' &&
                noProtocolJsn.hasOwnProperty('intranet') && typeof noProtocolJsn.intranet === 'boolean'
            )){

            throw new Error('Not a "noProtocolJsn{' +
                '\'ip_v4\' : [boolean],' +
                '\'ip_v6\' : [boolean],' +
                '\'localhost\' : [boolean],' +
                '\'intranet\' : [boolean]' +
                '}" object');

        }
    }

};

export default Valid;