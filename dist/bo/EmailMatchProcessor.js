"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeEmailPrefix = sanitizeEmailPrefix;
/**
 * Sanitizes the prefix of the email based on specific patterns.
 * @param matchedEmailFront - The part of the email before the "@" symbol.
 * @param matchedEmail - The full email match.
 * @returns An object containing the sanitized email, border, and removed length.
 */
function sanitizeEmailPrefix(matchedEmailFront, matchedEmail) {
    let border = '';
    let removedLength = 0;
    const rxLeftPlusBorder = new RegExp('^([^a-zA-Z0-9]+)([a-zA-Z0-9])', '');
    let isModValFrontOnlyForeignLang = true;
    const match = rxLeftPlusBorder.exec(matchedEmailFront);
    if (match !== null) {
        isModValFrontOnlyForeignLang = false;
        if (match[1]) {
            removedLength = match[1].length;
        }
        if (match[2]) {
            border = match[2];
        }
    }
    if (!isModValFrontOnlyForeignLang) {
        matchedEmail = matchedEmail.replace(rxLeftPlusBorder, '');
        matchedEmail = border + matchedEmail;
    }
    return {
        sanitizedEmail: matchedEmail,
        removedLength: removedLength,
    };
}
