import Util from "../util";

export class ProtocolPatterns {
    static allProtocols: string = '(?:rlogin|telnet|https|dhcp|http|imap|icmp|idrp|pop3|smtp|apr|dns|dsn|ftp|irc|par|ssl|ssh|tcp|upd|ups|ip)';

    static get getAllProtocolsArray(): Array<string> {
        return Util.Text.orConditionRxToArr(this.allProtocols);
    }

    static get getMandatoryAllProtocols(): string {
        return '(?:' + this.allProtocols + '[\\s]*:[\\s]*/[\\s]*/[\\s]*)';
    }

    static get getOptionalAllProtocols(): string {
        return '(?:(?:' + this.allProtocols + '[\\s]*:[\\s]*/[\\s]*/[\\s]*)|@|)';
    }
}
