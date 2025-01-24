"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortPatterns = void 0;
class PortPatterns {
}
exports.PortPatterns = PortPatterns;
PortPatterns.mandatoryPort = '(?:[\\t\\s]*:[\\t\\s]*[0-9]+)';
PortPatterns.optionalPort = '(?:[\\t\\s]*:[\\t\\s]*[0-9]+|)';
