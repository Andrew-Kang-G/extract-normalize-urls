"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlAreaService = void 0;
const CommentPatterns_1 = require("../pattern/CommentPatterns");
exports.XmlAreaService = {
    extractAllPureElements(xmlStr) {
        const rx = new RegExp(CommentPatterns_1.CommentPatterns.xml_element, "g");
        let matches = [];
        let match;
        while ((match = rx.exec(xmlStr)) !== null) {
            matches.push({
                'value': match[0],
                'elementName': match[0].split(/[\t\s]+|>/)[0].replace(/^</, ''),
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            });
        }
        return matches;
    },
    extractAllPureComments(xmlStr) {
        const rx = new RegExp(CommentPatterns_1.CommentPatterns.xml_comment, 'gi');
        let matches = [];
        let match;
        while ((match = rx.exec(xmlStr)) !== null) {
            matches.push({
                'value': match[0],
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            });
        }
        return matches;
    },
};
