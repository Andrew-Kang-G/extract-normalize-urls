import {BasePatterns} from "./BasePatterns";

export class CommentPatterns extends BasePatterns {
    static xml_comment: string = '<\\!--(?:.|[\\n\\r\\t])*?-->';
    static xml_element: string =

    /* Type A. <p> or <p abc> */

    '(?:<' + '(?:' + this.langChar + '[^<>\\u0022\\u0027\\t\\s]*)' + '(?:[\\t\\s]+[^<>\\u0022\\u0027\\u002F]*?|)(?:[\\s]*\\/[\\s]*|)>)|' +

    /* Type B. <p abc="" ...> */

    /* 1) Head part*/
    '(?:<' + '(?:' + this.langChar + '[^<>\\u0022\\u0027\\t\\s]*)' + '[\\t\\s]+[^<>\\s\\u0022\\u0027\\u002F].*?' +

    /* 2) Tail part*/

    // text (ex. readonly)>
    '(?:[\\t\\s]+?[^<>\\s\\u0022\\u0027\\u002F]+?|' +
    // "....">
    '(?:[\\u0022].*?[\\u0022]|[\\u0027].*?[\\u0027])[\\s]*)' +

    /* 3) Final tail part */
    '(?:[\\s]*\\/[\\s]*|)>)|' +

    /* Type C. </p> */
    '(?:<\\/' + '(?:' + this.langChar + '[^<>\\u0022\\u0027\\t\\s]*)' + '[^>]*?>)';
}