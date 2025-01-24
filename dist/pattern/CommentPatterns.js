"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentPatterns = void 0;
const BasePatterns_1 = require("./BasePatterns");
class CommentPatterns extends BasePatterns_1.BasePatterns {
}
exports.CommentPatterns = CommentPatterns;
_a = CommentPatterns;
CommentPatterns.xml_comment = '<\\!--(?:.|[\\n\\r\\t])*?-->';
CommentPatterns.xml_element = 
/* Type A. <p> or <p abc> */
'(?:<' + '(?:' + _a.langChar + '[^<>\\u0022\\u0027\\t\\s]*)' + '(?:[\\t\\s]+[^<>\\u0022\\u0027\\u002F]*?|)(?:[\\s]*\\/[\\s]*|)>)|' +
    /* Type B. <p abc="" ...> */
    /* 1) Head part*/
    '(?:<' + '(?:' + _a.langChar + '[^<>\\u0022\\u0027\\t\\s]*)' + '[\\t\\s]+[^<>\\s\\u0022\\u0027\\u002F].*?' +
    /* 2) Tail part*/
    // text (ex. readonly)>
    '(?:[\\t\\s]+?[^<>\\s\\u0022\\u0027\\u002F]+?|' +
    // "....">
    '(?:[\\u0022].*?[\\u0022]|[\\u0027].*?[\\u0027])[\\s]*)' +
    /* 3) Final tail part */
    '(?:[\\s]*\\/[\\s]*|)>)|' +
    /* Type C. </p> */
    '(?:<\\/' + '(?:' + _a.langChar + '[^<>\\u0022\\u0027\\t\\s]*)' + '[^>]*?>)';
