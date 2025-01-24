"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamsPatterns = void 0;
class ParamsPatterns {
}
exports.ParamsPatterns = ParamsPatterns;
ParamsPatterns.optionalUrlParams = '(?:(?:(/|\\?|#)[^\\s]*)|)';
ParamsPatterns.mandatoryUrlParams = '(?:(/|\\?|#)[^\\s]*)';
