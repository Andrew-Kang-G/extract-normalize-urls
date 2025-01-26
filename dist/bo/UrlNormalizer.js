"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlNormalizer = void 0;
const util_1 = __importDefault(require("../util"));
const FuzzyPartialUrlPatterns_1 = require("../pattern/FuzzyPartialUrlPatterns");
const BasePatterns_1 = require("../pattern/BasePatterns");
const ProtocolPatterns_1 = require("../pattern/ProtocolPatterns");
const DomainPatterns_1 = require("../pattern/DomainPatterns");
const valid_1 = __importDefault(require("../valid"));
exports.UrlNormalizer = {
    sacrificedUrl: null,
    currentStep: 0,
    /**
     * Initializes the UrlNormalizer with a given URL.
     * @param url - The URL to normalize.
     */
    initializeSacrificedUrl(url) {
        this.sacrificedUrl = util_1.default.Text.removeAllSpaces(valid_1.default.validateAndTrimString(url));
        if (!this.sacrificedUrl) {
            throw new Error("modifiedUrl cannot be null or empty");
        }
        this.currentStep = 1;
    },
    /**
     * Check if the required previous step is completed.
     * @param requiredStep - The step that should have been completed.
     */
    ensureStepCompleted(requiredStep) {
        if (this.currentStep != requiredStep) {
            throw new Error(`Step ${requiredStep} must be completed before this step ${this.currentStep}`);
        }
    },
    extractAndNormalizeProtocolFromSpacesRemovedUrl() {
        this.ensureStepCompleted(1);
        if (!this.sacrificedUrl) {
            throw new Error("modifiedUrl cannot be null or empty");
        }
        let protocol = null;
        let rx = new RegExp('^(' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.getFuzzyProtocolsRxStr + '|' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.fuzzierProtocol + ')' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.fuzzierProtocolDomainDelimiter);
        let match;
        let isMatched = false;
        while ((match = rx.exec(this.sacrificedUrl)) !== null) {
            if (match && match[1]) {
                isMatched = true;
                if (match[1] === 'localhost') {
                    protocol = null;
                    break;
                }
                let score_arrs = [];
                let protocol_arrs = ProtocolPatterns_1.ProtocolPatterns.getAllProtocolsArray;
                protocol_arrs.forEach(function (val, idx) {
                    if (match && match[1]) {
                        score_arrs.push(util_1.default.Text.similarity(val, match[1]));
                    }
                });
                protocol = protocol_arrs[util_1.default.Text.indexOfMax(score_arrs)];
                break;
            }
        }
        this.sacrificedUrl = this.sacrificedUrl.replace(rx, '');
        this.currentStep = 2;
        return protocol;
    },
    extractAndNormalizeDomainFromProtocolRemovedUrl() {
        this.ensureStepCompleted(2);
        if (this.sacrificedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }
        let result = {
            domain: null,
            type: null
        };
        let rx1 = new RegExp('(' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.getFuzzyDomainBody + '.*?)(' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.optionalFuzzyPort +
            FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.optionalFuzzyUrlParams + ')$', 'gi');
        let match1;
        while ((match1 = rx1.exec(this.sacrificedUrl)) !== null) {
            // remaining full url
            let domain_temp = match1[0];
            // domain
            let domain_temp2 = match1[1];
            // full url without domain
            let domain_temp3 = match1[2];
            // decide domain type
            if (new RegExp(FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.getDoubleFuzzyIpV4, 'i').test(domain_temp2)) {
                result.type = 'ipV4';
                // with id pwd
                if (new RegExp('^.*@' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.getDoubleFuzzyIpV4, 'i').test(domain_temp)) {
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+$', 'g'), '');
                }
                else {
                    domain_temp2 = domain_temp2.replace(new RegExp('^[^0-9]+', 'g'), '');
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+$', 'g'), '');
                    domain_temp2 = domain_temp2.replace(new RegExp('[^0-9]+', 'g'), '.');
                }
            }
            else if (new RegExp(FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.getDoubleFuzzyIpV6, 'i').test(domain_temp2)) {
                result.type = 'ipV6';
                // with id pwd
                if (new RegExp('^.*@' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.getDoubleFuzzyIpV6, 'i').test(domain_temp2)) {
                    if (domain_temp2.split('@[')[1]) {
                        let afterAt = domain_temp2.split('@[')[1];
                        afterAt = afterAt.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');
                        domain_temp2 = domain_temp2.split('@[')[0] + '@[' + afterAt;
                    }
                }
                else {
                    domain_temp2 = domain_temp2.replace(new RegExp('[^\\[\\]0-9:]', 'g'), '');
                }
            }
            else if (/^localhost$/i.test(domain_temp2)) {
                result.type = 'localhost';
            }
            else {
                // ,com ,co,.kr ...
                domain_temp2 = domain_temp2.replace(new RegExp('' + BasePatterns_1.BasePatterns.allKeypadMetaCharsWithoutDelimiters + '+' + '(' + DomainPatterns_1.DomainPatterns.allRootDomains + '|[a-zA-Z]+)', 'gi'), '.$1');
                let domain_temp_root_domain_match = new RegExp('\\.([^.]+)$', 'i').exec(domain_temp2);
                if (domain_temp_root_domain_match !== null) {
                    if (domain_temp_root_domain_match[1]) {
                        let score_arrs = [];
                        let root_domains_arrs = DomainPatterns_1.DomainPatterns.getAllRootDomainsArr;
                        root_domains_arrs.forEach(function (val, idx) {
                            score_arrs.push(util_1.default.Text.similarity(val, domain_temp_root_domain_match === null || domain_temp_root_domain_match === void 0 ? void 0 : domain_temp_root_domain_match[1]));
                        });
                        //console.log('sa : ' + score_arrs);
                        let root_domain = root_domains_arrs[util_1.default.Text.indexOfMax(score_arrs)];
                        domain_temp = domain_temp.replace(new RegExp('\\.([^.]+)$', 'i'), '.' + root_domain);
                    }
                }
                result.type = 'domain';
                domain_temp2 = domain_temp2.replace(new RegExp('^' + BasePatterns_1.BasePatterns.noLangChar + '+', 'i'), '');
                domain_temp2 = domain_temp2.replace(new RegExp(BasePatterns_1.BasePatterns.noLangChar + '+$', 'i'), '');
            }
            // root domain integrity
            if (result.type === 'domain') {
                // root domain integrity
                let d2_arrs = domain_temp2.split('.');
                let match_rt;
                let match_srt;
                let calculated_domain = '';
                let root_domain = '';
                let root_domain2 = null;
                if ((match_rt = new RegExp(DomainPatterns_1.DomainPatterns.allRootDomains, 'i').exec(d2_arrs[d2_arrs.length - 1])) !== null && d2_arrs.length >= 2) {
                    root_domain = match_rt[0];
                }
                if (d2_arrs.length >= 3 && d2_arrs[d2_arrs.length - 2].length < 4) {
                    if ((match_srt = new RegExp(DomainPatterns_1.DomainPatterns.allRootDomains, 'i').exec(d2_arrs[d2_arrs.length - 2])) !== null) {
                        root_domain2 = match_srt[0];
                    }
                }
                d2_arrs.forEach(function (val, idx) {
                    if (idx === d2_arrs.length - 1) {
                        calculated_domain += root_domain;
                    }
                    else if (root_domain2 && idx === d2_arrs.length - 2) {
                        calculated_domain += root_domain2 + '.';
                    }
                    else {
                        calculated_domain += val + '.';
                    }
                });
                result.domain = calculated_domain;
            }
            else {
                result.domain = domain_temp2;
            }
            this.sacrificedUrl = domain_temp3;
        }
        //console.log("before : " + this.modifiedUrl)
        // This sort of characters should NOT be located at the start.
        this.sacrificedUrl = this.sacrificedUrl.replace(new RegExp('^(?:' + BasePatterns_1.BasePatterns.twoBytesNum + '|' + BasePatterns_1.BasePatterns.langChar + ')+', 'i'), '');
        this.currentStep = 3;
        return result;
    },
    extractAndNormalizePortFromDomainRemovedUrl() {
        this.ensureStepCompleted(3);
        let port = null;
        let rx = new RegExp('^' + FuzzyPartialUrlPatterns_1.FuzzyPartialUrlPatterns.mandatoryFuzzyPort, 'gi');
        let match;
        if (this.sacrificedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }
        while ((match = rx.exec(this.sacrificedUrl)) !== null) {
            port = match[0].replace(/^\D+/g, '');
            if (this.sacrificedUrl != undefined) {
                this.sacrificedUrl = this.sacrificedUrl.replace(rx, '');
            }
        }
        this.currentStep = 4;
        return port;
    },
    extractNormalizedUrl(protocol, port, domain) {
        this.ensureStepCompleted(4);
        if (this.sacrificedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }
        /* Now, only the end part of a domain is left */
        /* Consecutive param delimiters should be replaced into one */
        this.sacrificedUrl = this.sacrificedUrl.replace(/[#]{2,}/gi, '#');
        this.sacrificedUrl = this.sacrificedUrl.replace(/[/]{2,}/gi, '/');
        this.sacrificedUrl = this.sacrificedUrl.replace(/(.*?)[?]{2,}([^/]*?(?:=|$))(.*)/i, function (match, $1, $2, $3) {
            //console.log(modified_url + ' a :' + $1 + '?' + $2 + $3);
            return $1 + '?' + $2 + $3;
        });
        /* 'modified_url' must start with '/,?,#' */
        let rx_modified_url = new RegExp('(?:\\/|\\?|\\#)', 'i');
        let match_modified_url;
        if ((match_modified_url = rx_modified_url.exec(this.sacrificedUrl)) !== null) {
            this.sacrificedUrl = this.sacrificedUrl.replace(new RegExp('^.*?(' + util_1.default.Text.escapeRegex(match_modified_url[0]) + '.*)$', 'i'), function (match, $1) {
                return $1;
            });
        }
        let protocol_str = protocol;
        if (!protocol) {
            protocol_str = '';
        }
        else {
            protocol_str += '://';
        }
        let port_str = port;
        if (!port) {
            port_str = '';
        }
        else {
            port_str = ':' + port_str;
        }
        let onlyDomain_str = domain;
        if (!onlyDomain_str) {
            onlyDomain_str = '';
        }
        this.currentStep = 5;
        return protocol_str + onlyDomain_str + port_str + this.sacrificedUrl;
    },
    extractAndNormalizeUriParamsFromPortRemovedUrl() {
        this.ensureStepCompleted(5);
        if (this.sacrificedUrl == undefined) {
            throw new Error("modifiedUrl cannot be null");
        }
        let result = {
            uri: null,
            params: null
        };
        if (!this.sacrificedUrl || this.sacrificedUrl.trim() === '') {
            result.params = null;
            result.uri = null;
        }
        else {
            // PARAMS
            let rx3 = new RegExp('\\?(?:.)*$', 'gi');
            let match3;
            while ((match3 = rx3.exec(this.sacrificedUrl)) !== null) {
                result.params = match3[0];
            }
            this.sacrificedUrl = this.sacrificedUrl.replace(rx3, '');
            if (result.params === "?") {
                result.params = null;
            }
            // URI
            let rx4 = new RegExp('[#/](?:.)*$', 'gi');
            let match4;
            while ((match4 = rx4.exec(this.sacrificedUrl)) !== null) {
                result.uri = match4[0];
            }
            this.sacrificedUrl = this.sacrificedUrl.replace(rx4, '');
            if (result.uri === "/") {
                result.uri = null;
            }
        }
        this.currentStep = 6;
        return result;
    }
};
