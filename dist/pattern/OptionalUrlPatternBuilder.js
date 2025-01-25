"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _OptionalUrlPatternBuilder__url;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalUrlPatternBuilder = void 0;
const UrlPatterns_1 = require("./UrlPatterns");
const valid_1 = __importDefault(require("../valid"));
const DomainPatterns_1 = require("./DomainPatterns");
const ProtocolPatterns_1 = require("./ProtocolPatterns");
const PortPatterns_1 = require("./PortPatterns");
const ParamsPatterns_1 = require("./ParamsPatterns");
class OptionalUrlPatternBuilder {
    // 1. URL
    static setUrlPattern(noProtocolJsn) {
        this.url = noProtocolJsn;
    }
    // This is the recommended standard.
    static get p() {
        return (UrlPatterns_1.UrlPatterns.allUrlsFromKnife +
            "|" +
            UrlPatterns_1.UrlPatterns.allUrlsFromValidatorJs +
            "|" +
            UrlPatterns_1.UrlPatterns.allUrlsFromIanaBody +
            UrlPatterns_1.UrlPatterns.allUrlsFromIanaTail);
    }
    static set url(noProtocolJsn) {
        if (noProtocolJsn) {
            try {
                valid_1.default.checkIfProtocolJsnObjOrFail(noProtocolJsn);
                let is_p = true;
                let no_p = "";
                if (noProtocolJsn.ipV4) {
                    no_p = DomainPatterns_1.DomainPatterns.ipV4 + "|";
                    is_p = false;
                }
                if (noProtocolJsn.ipV6) {
                    no_p += DomainPatterns_1.DomainPatterns.ipV6 + "|";
                    is_p = false;
                }
                if (noProtocolJsn.localhost) {
                    no_p += DomainPatterns_1.DomainPatterns.localhost + "|";
                    is_p = false;
                }
                if (noProtocolJsn.intranet) {
                    no_p += DomainPatterns_1.DomainPatterns.intranet + "|";
                    is_p = false;
                }
                no_p = no_p.replace(/\|$/, "");
                no_p = "(?:" + no_p + ")";
                if (is_p) {
                    __classPrivateFieldSet(this, _a, this.p, "f", _OptionalUrlPatternBuilder__url);
                }
                else {
                    __classPrivateFieldSet(this, _a, this.p +
                        "|" +
                        ProtocolPatterns_1.ProtocolPatterns.getOptionalAllProtocols +
                        no_p +
                        // port or not
                        PortPatterns_1.PortPatterns.optionalPort +
                        // uri, params or not
                        ParamsPatterns_1.ParamsPatterns.optionalUrlParams, "f", _OptionalUrlPatternBuilder__url);
                }
            }
            catch (e) {
                console.log(e);
                __classPrivateFieldSet(this, _a, this.p, "f", _OptionalUrlPatternBuilder__url);
            }
        }
        else {
            __classPrivateFieldSet(this, _a, this.p, "f", _OptionalUrlPatternBuilder__url);
        }
    }
    static get getUrl() {
        if (!__classPrivateFieldGet(this, _a, "f", _OptionalUrlPatternBuilder__url)) {
            return this.p;
        }
        else {
            return __classPrivateFieldGet(this, _a, "f", _OptionalUrlPatternBuilder__url);
        }
    }
}
exports.OptionalUrlPatternBuilder = OptionalUrlPatternBuilder;
_a = OptionalUrlPatternBuilder;
_OptionalUrlPatternBuilder__url = { value: void 0 };
