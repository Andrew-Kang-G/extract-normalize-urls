import {UrlAreaService} from "../service/UrlAreaService";

export const UrlAreaApi = {

    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    parseUrl(url: string) {
        return UrlAreaService.parseUrl(url);
    },

    /**
     * @brief
     * Assort an url into each type.
     * @author Andrew Kang
     * @param url string required
     * @return array ({'url' : '', 'protocol' : '', 'onlyDomain' : '', 'onlyUriWithParams' : '', 'type' : ''})
     */
    normalizeUrl(url: string) {
        return UrlAreaService.normalizeUrl(url);
    }

};
