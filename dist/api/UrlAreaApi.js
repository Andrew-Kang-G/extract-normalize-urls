"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlAreaApi = void 0;
const UrlAreaService_1 = require("../service/UrlAreaService");
exports.UrlAreaApi = {
    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    parseUrl(url) {
        return UrlAreaService_1.UrlAreaService.parseUrl(url);
    },
    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url) {
        return UrlAreaService_1.UrlAreaService.normalizeUrl(url);
    }
};
