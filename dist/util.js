"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
*     Private : Utils
* */
const BasePatterns_1 = require("./pattern/BasePatterns");
const Text = {
    escapeRegex(rx) {
        return rx.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    removeAllSpaces(target) {
        return target.replace(/[\n\r\t\s]/g, '');
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
                    if (new RegExp('^' + BasePatterns_1.BasePatterns.noLangCharNum, 'i').test(uris[a][b])) {
                        if (uris[a][b] !== "{number}") {
                            throw new Error('The first letter of the first URI part must not be a meta char : not valid : ' + uris[a][b]);
                        }
                    }
                }
                if (b < uris[a].length - 1) {
                    re_partial += uris[a][b] + '/';
                }
                else {
                    re_partial += uris[a][b];
                }
            }
            if (a < uris.length - 1) {
                re += this.escapeRegex(re_partial) + '|';
            }
            else {
                re += this.escapeRegex(re_partial);
            }
        }
        re = re.replace(/\\\{number\\\}/gi, '[0-9]+');
        return re;
    },
    orConditionRxToArr(rxStr) {
        rxStr = rxStr.replace(/^\(\?:|\)$/gi, '');
        return rxStr.split('|');
    },
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
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(String(longerLength));
    },
    editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        let costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
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
exports.default = {
    Text
};
