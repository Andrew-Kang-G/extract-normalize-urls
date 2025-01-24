import {BasePatterns} from "./BasePatterns";

export class UriPatterns extends BasePatterns {
    static allUris: string =
        // 1. '/a...'
        '(?:\\/[^/\\s]*(?:(?:(/|\\?|#)[^\\s]*)|))' +
    '|' +
    // 2. 'abc/...' (the first letter must be any lang char and nums)
    '(?:(?:[0-9]|' + this.twoBytesNum + '|' + this.langChar + ')' + '[^/\\s]*(?:(/|\\?|#)[^\\s]*))';
}