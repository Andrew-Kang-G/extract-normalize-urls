"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolPatterns = void 0;
const util_1 = __importDefault(require("../util"));
class ProtocolPatterns {
    static get getAllProtocolsArray() {
        return util_1.default.Text.orConditionRxToArr(this.allProtocols);
    }
    static get getMandatoryAllProtocols() {
        return '(?:' + this.allProtocols + '[\\s]*:[\\s]*/[\\s]*/[\\s]*)';
    }
    static get getOptionalAllProtocols() {
        return '(?:(?:' + this.allProtocols + '[\\s]*:[\\s]*/[\\s]*/[\\s]*)|@|)';
    }
}
exports.ProtocolPatterns = ProtocolPatterns;
ProtocolPatterns.allProtocols = '(?:rlogin|telnet|https|dhcp|http|imap|icmp|idrp|pop3|smtp|apr|dns|dsn|ftp|irc|par|ssl|ssh|tcp|upd|ups|ip)';
