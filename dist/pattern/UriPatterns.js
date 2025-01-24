"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UriPatterns = void 0;
const BasePatterns_1 = require("./BasePatterns");
class UriPatterns extends BasePatterns_1.BasePatterns {
}
exports.UriPatterns = UriPatterns;
_a = UriPatterns;
UriPatterns.allUris = 
// 1. '/a...'
'(?:\\/[^/\\s]*(?:(?:(/|\\?|#)[^\\s]*)|))' +
    '|' +
    // 2. 'abc/...' (the first letter must be any lang char and nums)
    '(?:(?:[0-9]|' + _a.twoBytesNum + '|' + _a.langChar + ')' + '[^/\\s]*(?:(/|\\?|#)[^\\s]*))';
