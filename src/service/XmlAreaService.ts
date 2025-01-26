import {CommentMatch, ElementMatch} from "../types";
import {CommentPatterns} from "../pattern/CommentPatterns";


export const XmlAreaService = {

    extractAllPureElements(xmlStr: string): ElementMatch[] {

        const rx = new RegExp(CommentPatterns.xml_element, "g");


        let matches = [];
        let match : RegExpExecArray | null;
        while ((match = rx.exec(xmlStr)) !== null) {

            //console.log(match[0].split(/[\t\s]+|>/)[0]);
            matches.push({
                'value': match[0],
                'elementName': match[0].split(/[\t\s]+|>/)[0].replace(/^</, ''),
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            } as ElementMatch)

        }

        return matches;

    },

    extractAllPureComments(xmlStr: string): CommentMatch[] {

        const rx = new RegExp(CommentPatterns.xml_comment, 'gi');

        let matches = [];
        let match : RegExpExecArray | null;

        while ((match = rx.exec(xmlStr)) !== null) {

            matches.push({
                'value': match[0],
                'startIndex': match.index,
                'lastIndex': match.index + match[0].length - 1
            } as CommentMatch)

        }

        return matches;

    },

};