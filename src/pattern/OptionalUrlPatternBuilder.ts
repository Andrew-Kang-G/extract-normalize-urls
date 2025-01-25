import {UrlPatterns} from "./UrlPatterns";
import Valid from "../valid";
import {DomainPatterns} from "./DomainPatterns";
import {ProtocolPatterns} from "./ProtocolPatterns";
import {PortPatterns} from "./PortPatterns";
import {ParamsPatterns} from "./ParamsPatterns";
import {NoProtocolJsnParamType} from "../types";


export class OptionalUrlPatternBuilder{

    static #_url: string;

    // 1. URL
    static setUrlPattern(noProtocolJsn: NoProtocolJsnParamType) {
        this.url = noProtocolJsn;
    }

    // This is the recommended standard.
    static get p() {
        return (
            UrlPatterns.allUrlsFromKnife +
            "|" +
            UrlPatterns.allUrlsFromValidatorJs +
            "|" +
            UrlPatterns.allUrlsFromIanaBody +
            UrlPatterns.allUrlsFromIanaTail
        );
    }

    static set url(noProtocolJsn: NoProtocolJsnParamType) {
        if (noProtocolJsn) {
            try {
                Valid.checkIfProtocolJsnObjOrFail(noProtocolJsn);

                let is_p = true;
                let no_p = "";
                if (noProtocolJsn.ipV4) {
                    no_p = DomainPatterns.ipV4 + "|";
                    is_p = false;
                }
                if (noProtocolJsn.ipV6) {
                    no_p += DomainPatterns.ipV6 + "|";
                    is_p = false;
                }
                if (noProtocolJsn.localhost) {
                    no_p += DomainPatterns.localhost + "|";
                    is_p = false;
                }
                if (noProtocolJsn.intranet) {
                    no_p += DomainPatterns.intranet + "|";
                    is_p = false;
                }
                no_p = no_p.replace(/\|$/, "");
                no_p = "(?:" + no_p + ")";

                if (is_p) {
                    this.#_url = this.p;
                } else {
                    this.#_url =
                        this.p +
                        "|" +
                        ProtocolPatterns.getOptionalAllProtocols +
                        no_p +
                        // port or not
                        PortPatterns.optionalPort +
                        // uri, params or not
                        ParamsPatterns.optionalUrlParams;
                }
            } catch (e) {
                console.log(e);
                this.#_url = this.p;
            }
        } else {
            this.#_url = this.p;
        }
    }

    static get getUrl() {
        if (!this.#_url) {
            return this.p;
        } else {
            return this.#_url;
        }
    }

}
