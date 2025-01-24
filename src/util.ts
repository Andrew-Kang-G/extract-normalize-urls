/*
*     Private : Utils
* */
import {BasePatterns} from "./pattern/BasePatterns";

const Text = {

    /* args - st : 대상 스트링, index : replacement가 삽입될 위치, replacement : 바뀌어지는 스트링 */
    replaceAt: function (st, index, replacement) {

        //console.log(str.length);
        let str = st.toString();
        let len = str.length;
        let fw = str.substr(0, index);
        let lw = str.substr(index, index + len);

        return fw + replacement + lw;

    },

    replaceBetween(from, start, end, what) {
        return from.substring(0, start) + what + from.substring(end);
    },
    escapeRegex(v) {
        return v.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    removeAllSpaces(v): string {
        return v.replace(/[\n\r\t\s]/g, '');
    },
    reduceEndIndex(tg, endIndex, ptrn) {

        let obj = {
            'tg': tg,
            'endIndex': endIndex
        };

        let rx = new RegExp(ptrn, 'gi');
        let match = {};
        while ((match = rx.exec(tg)) !== null) {
            endIndex -= match[0].length;
        }

        obj.tg = tg.replace(rx, '');
        obj.endIndex = endIndex;

        return obj;
    },

    urisToOneRxStr(uris) {

        let re = '';

        for (let a = 0; a < uris.length; a++) {

            let re_partial = '';
            for (let b = 0; b < uris[a].length; b++) {

                if (!(uris[a][b] && typeof uris[a][b] === 'string')) {
                    throw new Error('A value not in a string type has been found : ' + uris[a][b] + ' / loc in for clause : a=' + a + ' / b=' + b);
                }

                uris[a][b] = this.removeAllSpaces(uris[a][b]);

                if (b === 0) {
                    if (new RegExp('^' + BasePatterns.noLangCharNum, 'i').test(uris[a][b])) {

                        if(uris[a][b] !== "{number}"){
                            throw new Error('The first letter of the first URI part must not be a meta char : not valid : ' + uris[a][b]);
                        }

                    }
                }

                if (b < uris[a].length - 1) {
                    re_partial += uris[a][b] + '/';
                } else {
                    re_partial += uris[a][b];
                }

            }

            if (a < uris.length - 1) {
                re += this.escapeRegex(re_partial) + '|';
            } else {
                re += this.escapeRegex(re_partial);
            }

        }

        // {number} symbol
        re = re.replace(/\\\{number\\\}/gi, '[0-9]+');

        //console.log('re : ' + re);

        return re;

    },

    orConditionRxToArr(rxStr: string): Array<string> {

        rxStr = rxStr.replace(/^\(\?:|\)$/gi, '');

        return rxStr.split('|');

    },

    /* String comparision */
    similarity(s1, s2) {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        let longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    },
    editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        let costs = new Array();
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue),
                                costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    },

    indexOfMax(arr) {

        if (arr.length === 0) {
            return -1;
        }

        let max = arr[0];
        let maxIndex = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }


};

export default {
    Text
}