import {ParsedEmailComponents} from "../types";
import Valid from "../valid";
import Util from "../util";
import {BasePatterns} from "../pattern/BasePatterns";
import {DomainPatterns} from "../pattern/DomainPatterns";

export const EmailAreaService = {
    parseEmail(email: string): ParsedEmailComponents {

        let parsedEmailComponents : ParsedEmailComponents = {
            email: null,
            removedTailOnEmail: null,
            type: null
        };

        try {

            email = Valid.validateAndTrimString(email);
            email = Util.Text.removeAllSpaces(email);

            if (!Valid.isEmailPattern(email)) {
                throw new Error('This is not an email pattern');
            }

            parsedEmailComponents.email = email;

            if (new RegExp('@' + BasePatterns.everything + '*' + DomainPatterns.ipV4, 'i').test(email)) {
                parsedEmailComponents.type = 'ipV4';
            } else if (new RegExp('@' + BasePatterns.everything + '*' + DomainPatterns.ipV6, 'i').test(email)) {
                //console.log('r : ' + url);
                parsedEmailComponents.type = 'ipV6';
            } else {
                parsedEmailComponents.type = 'domain';
            }


            // If no uris no params, we remove suffix in case that it is a meta character.
            if(parsedEmailComponents.email) {
                if (parsedEmailComponents.type !== 'ipV6') {
                    // removedTailOnUrl
                    let rm_part_matches = parsedEmailComponents.email.match(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'));
                    if (rm_part_matches) {
                        parsedEmailComponents.removedTailOnEmail = rm_part_matches[0];
                        parsedEmailComponents.email = parsedEmailComponents.email.replace(new RegExp(BasePatterns.noLangCharNum + '+$', 'gi'), '');
                    }
                } else {

                    // removedTailOnUrl
                    let rm_part_matches = parsedEmailComponents.email.match(new RegExp('[^\\u005D]+$', 'gi'));
                    if (rm_part_matches) {
                        parsedEmailComponents.removedTailOnEmail = rm_part_matches[0];
                        parsedEmailComponents.email = parsedEmailComponents.email.replace(new RegExp('[^\\u005D]+$', 'gi'), '');
                    }
                }


                // If no uri no params, we remove suffix in case that it is non-alphabets.
                // The regex below means "all except for '.'". It is for extracting all root domains, so non-domain types like ip are excepted.

                let onlyEnd = parsedEmailComponents.email.match(new RegExp('[^.]+$', 'gi'));
                if (onlyEnd && onlyEnd.length > 0) {

                    // this is a root domain only in English like com, ac
                    // but the situation is like com가, ac나
                    if (/^[a-zA-Z]+/.test(onlyEnd[0])) {

                        if (/[^a-zA-Z]+$/.test(parsedEmailComponents.email)) {

                            // remove non alphabets
                            const matchedEmail = parsedEmailComponents.email.match(/[^a-zA-Z]+$/);
                            if(matchedEmail && matchedEmail.length > 0) {
                                parsedEmailComponents.removedTailOnEmail = matchedEmail[0] + parsedEmailComponents.removedTailOnEmail;
                            }
                            parsedEmailComponents.email = parsedEmailComponents.email.replace(/[^a-zA-Z]+$/, '');
                        }
                    }

                }
            }
        } catch (e) {

            console.log(e);

        } finally {

            return parsedEmailComponents;

        }

    },
    strictTest(email: string | null | undefined): boolean {

        // Test for total length of RFC-2821 etc...
        try {

            if (!email) return false;

            if (email.length > 256) return false;

            if (!/^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email)) return false;

            let [account, address] = email.split('@');
            if (account.length > 64) return false;

            let domainParts = address.split('.');
            if (domainParts.some(function (part) {
                return part.length > 63;
            })) return false;

            return true;

        } catch (e) {

            console.log(e);

            return false;

        }
    }
};