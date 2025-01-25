import Util from "./util";

import {FuzzyPartialUrlPatterns} from "./pattern/FuzzyPartialUrlPatterns";
import {BasePatterns} from "./pattern/BasePatterns";
import {ProtocolPatterns} from "./pattern/ProtocolPatterns";
import {NormalizerType} from "./types";
import {DomainPatterns} from "./pattern/DomainPatterns";

export const Normalizer: NormalizerType  = {

    modifiedUrl : null,

    extractAndNormalizeProtocolFromSpacesRemovedUrl(){

        if (this.modifiedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }

        let protocol = null;

        let rx = new RegExp('^(' + FuzzyPartialUrlPatterns.getFuzzyProtocolsRxStr  + '|'+ FuzzyPartialUrlPatterns.fuzzierProtocol + ')' + FuzzyPartialUrlPatterns.fuzzierProtocolDomainDelimiter);

        let match: RegExpExecArray | null;
        let isMatched = false;
        while ((match = rx.exec(this.modifiedUrl)) !== null) {

            if (match && match[1]) {

                isMatched = true;

                if (match[1] === 'localhost') {
                    protocol = null;
                    break;
                }

                let score_arrs: Array<number> = [];
                let protocol_arrs : Array<string> = ProtocolPatterns.getAllProtocolsArray;

                protocol_arrs.forEach(function (val, idx) {
                    if (match && match[1]) {
                        score_arrs.push(Util.Text.similarity(val, match[1]));
                    }
                });

                protocol = protocol_arrs[Util.Text.indexOfMax(score_arrs)];

                break;
            }

        }

        this.modifiedUrl = this.modifiedUrl.replace(rx, '');

        return protocol;

    },

    extractAndNormalizeDomainFromProtocolRemovedUrl(): ReturnType<NormalizerType["extractAndNormalizeDomainFromProtocolRemovedUrl"]> {

        if (this.modifiedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }

        let result : ReturnType<NormalizerType["extractAndNormalizeDomainFromProtocolRemovedUrl"]> = {
            domain : null,
            type : null
        }

        let rx1 = new RegExp('(' + FuzzyPartialUrlPatterns.getFuzzyDomainBody + '.*?)(' + FuzzyPartialUrlPatterns.optionalFuzzyPort +
            FuzzyPartialUrlPatterns.optionalFuzzyUrlParams + ')$', 'gi');
        let match1 : RegExpExecArray | null;
        while ((match1 = rx1.exec(this.modifiedUrl)) !== null) {

            // remaining full url
            let domain_temp = match1[0];
            // domain
            let domain_temp2 = match1[1];
            // full url without domain
            let domain_temp3 = match1[2];

            // decide domain type
            if (new RegExp(FuzzyPartialUrlPatterns.getDoubleFuzzyIpV4, 'i').test(domain_temp2)) {

                result.type = 'ipV4';

                // with id pwd
                if(new RegExp('^.*@' + FuzzyPartialUrlPatterns.getDoubleFuzzyIpV4, 'i').test(domain_temp)){
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+$', 'g'), '');
                }else{
                    domain_temp2 = domain_temp2.replace(new RegExp('^[^0-9]+', 'g'), '');
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+$', 'g'), '');
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+', 'g'), '.');
                }


            } else if (new RegExp(FuzzyPartialUrlPatterns.getDoubleFuzzyIpV6, 'i').test(domain_temp2)) {

                result.type  = 'ipV6';

                // with id pwd
                if(new RegExp('^.*@' + FuzzyPartialUrlPatterns.getDoubleFuzzyIpV6, 'i').test(domain_temp2)){

                    if(domain_temp2.split('@[')[1]){
                        let afterAt = domain_temp2.split('@[')[1];
                        afterAt = afterAt.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');
                        domain_temp2 = domain_temp2.split('@[')[0] + '@[' + afterAt;
                    }

                }else{
                    domain_temp2 = domain_temp2.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');
                }


            } else if (/^localhost$/i.test(domain_temp2)) {
                result.type  = 'localhost';
            } else {
                // ,com ,co,.kr ...
                domain_temp2 = domain_temp2.replace(new RegExp
                ('' + BasePatterns.allKeypadMetaCharsWithoutDelimiters + '+'+ '(' + DomainPatterns.allRootDomains + '|[a-zA-Z]+)', 'gi'), '.$1');

                let domain_temp_root_domain_match = new RegExp('\\.([^.]+)$', 'i').exec(domain_temp2);
                if(domain_temp_root_domain_match !== null){
                    if(domain_temp_root_domain_match[1]){

                        let score_arrs: number[] = [];
                        let root_domains_arrs = DomainPatterns.getAllRootDomainsArr;

                        root_domains_arrs.forEach(function (val, idx) {
                            score_arrs.push(Util.Text.similarity(val, domain_temp_root_domain_match?.[1]));
                        });

                        //console.log('sa : ' + score_arrs);

                        let root_domain = root_domains_arrs[Util.Text.indexOfMax(score_arrs)];

                        domain_temp = domain_temp.replace(new RegExp('\\.([^.]+)$', 'i'), '.' + root_domain)
                    }
                }

                result.type  = 'domain';

                domain_temp2 = domain_temp2.replace(new RegExp('^' + BasePatterns.noLangChar + '+', 'i'), '');
                domain_temp2 = domain_temp2.replace(new RegExp(BasePatterns.noLangChar + '+$', 'i'), '');
            }

            // root domain integrity
            if(result.type === 'domain') {
                // root domain integrity
                let d2_arrs = domain_temp2.split('.');

                let match_rt: RegExpExecArray | null;
                let match_srt: RegExpExecArray | null;
                let calculated_domain = '';
                let root_domain = '';
                let root_domain2 = null;

                if ((match_rt = new RegExp(DomainPatterns.allRootDomains, 'i').exec(d2_arrs[d2_arrs.length - 1])) !== null && d2_arrs.length >= 2) {
                    root_domain = match_rt[0];
                }
                if (d2_arrs.length >= 3 && d2_arrs[d2_arrs.length - 2].length < 4) {
                    if ((match_srt = new RegExp(DomainPatterns.allRootDomains, 'i').exec(d2_arrs[d2_arrs.length - 2])) !== null) {
                        root_domain2 = match_srt[0];
                    }
                }

                d2_arrs.forEach(function (val, idx) {

                    if (idx === d2_arrs.length - 1) {
                        calculated_domain += root_domain;
                    } else if (root_domain2 && idx === d2_arrs.length - 2) {
                        calculated_domain += root_domain2 + '.';
                    } else {
                        calculated_domain += val + '.';
                    }

                })

                result.domain = calculated_domain;

            }else{

                result.domain = domain_temp2;
            }

            this.modifiedUrl = domain_temp3;

        }

        //console.log("before : " + this.modifiedUrl)
        // This sort of characters should NOT be located at the start.
        this.modifiedUrl = this.modifiedUrl.replace(new RegExp('^(?:' + BasePatterns.twoBytesNum + '|' +  BasePatterns.langChar + ')+', 'i'), '');
        //console.log("after : " + this.modifiedUrl)
        return result;

    },

    extractAndNormalizePortFromDomainRemovedUrl(){

        let port = null;

        let rx = new RegExp('^' + FuzzyPartialUrlPatterns.mandatoryFuzzyPort, 'gi');
        let match: RegExpExecArray | null;


        if (this.modifiedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }
        while((match = rx.exec(this.modifiedUrl)) !== null) {
            port = match[0].replace( /^\D+/g, '');
            if (this.modifiedUrl != undefined) {
                this.modifiedUrl = this.modifiedUrl.replace(rx, '');
            }
        }

        return port;

    },

    finalizeNormalization(protocol, port, domain): string{

        if (this.modifiedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }

        /* Now, only the end part of a domain is left */
        /* Consecutive param delimiters should be replaced into one */
        this.modifiedUrl = this.modifiedUrl.replace(/[#]{2,}/gi, '#');
        this.modifiedUrl  = this.modifiedUrl.replace(/[/]{2,}/gi, '/');
        this.modifiedUrl  = this.modifiedUrl.replace(/(.*?)[?]{2,}([^/]*?(?:=|$))(.*)/i, function(match, $1, $2, $3){
            //console.log(modified_url + ' a :' + $1 + '?' + $2 + $3);
            return $1 + '?' + $2 + $3;
        });

        /* 'modified_url' must start with '/,?,#' */
        let rx_modified_url = new RegExp('(?:\\/|\\?|\\#)', 'i');
        let match_modified_url: RegExpExecArray | null;
        if ((match_modified_url = rx_modified_url.exec(this.modifiedUrl)) !== null) {

            this.modifiedUrl = this.modifiedUrl.replace(new RegExp('^.*?(' + Util.Text.escapeRegex(match_modified_url[0]) + '.*)$', 'i'), function(match, $1){
                return $1;
            });
        }

        let protocol_str = protocol;
        if(!protocol){
            protocol_str = '';
        }else{
            protocol_str += '://';
        }

        let port_str = port;
        if(!port){
            port_str = '';
        }else{
            port_str= ':' + port_str;
        }

        let onlyDomain_str = domain;
        if(!onlyDomain_str){
            onlyDomain_str = '';
        }

        return protocol_str + onlyDomain_str + port_str + this.modifiedUrl;

    },

    extractAndNormalizeUriParamsFromPortRemovedUrl(): ReturnType<NormalizerType["extractAndNormalizeUriParamsFromPortRemovedUrl"]>{

        if (this.modifiedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }

        let result: ReturnType<NormalizerType["extractAndNormalizeUriParamsFromPortRemovedUrl"]> = {
            uri : null,
            params : null
        };

        if(!this.modifiedUrl || this.modifiedUrl.trim() === ''){
            result.params = null;
            result.uri = null;
        }else{

            // PARAMS
            let rx3 = new RegExp('\\?(?:.)*$', 'gi');
            let match3: RegExpExecArray | null;
            while ((match3 = rx3.exec(this.modifiedUrl)) !== null) {

                result.params = match3[0];
            }
            this.modifiedUrl = this.modifiedUrl.replace(rx3, '');

            if (result.params === "?") {
                result.params  = null;
            }

            // URI
            let rx4 = new RegExp('[#/](?:.)*$', 'gi');
            let match4: RegExpExecArray | null;
            while ((match4 = rx4.exec(this.modifiedUrl)) !== null) {
                result.uri = match4[0];
            }
            this.modifiedUrl = this.modifiedUrl.replace(rx4, '');

            if (result.uri === "/") {
                result.uri = null;
            }

        }

        return result;

    }

}