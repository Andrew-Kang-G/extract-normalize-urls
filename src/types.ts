// types.ts
// [NOTICE] As this library was originally Javascript, Types are being improved.

// Common Types
/*export type IndexRange = {
    start: number;
    end: number;
};*/


// Text Area Types
export type ExtractedUri = {
    value: ParsedUrl;
    area: string;
};

/*export type ExtractedEmail = {
    value: string;
    area: string;
};*/

/*export type ExtractedUriResult = {
    uri_detected: ExtractedUri;
    in_what_url: ExtractedUri | null;
};*/

/*// URL Area Types
export type UrlType = {
    url: string;
    protocol: string;
    onlyDomain: string;
    onlyUriWithParams: string;
    type: string;
};

// XML Area Types
export type XmlCommentMatch = {
    value: string;
    startIndex: number;
    lastIndex: number;
};

export type XmlElementMatch = {
    elementName: string;
    value: string;
    startIndex: number;
    lastIndex: number;
    commentArea?: boolean;
};*/

export type NoProtocolJsnType = {
    ip_v4?: boolean;
    ip_v6?: boolean;
    localhost?: boolean;
    intranet?: boolean;
};

export interface ParsedUrl {
    url: string | null;              // Full URL or null
    removedTailOnUrl: string;        // Part of the URL removed from the tail
    protocol: string | null;         // URL protocol (e.g., http, https) or null
    onlyDomain: string | null;       // Domain part of the URL or null
    onlyParams: string | null;       // Query parameters as a string or null
    onlyUri: string | null;          // URI path part of the URL or null
    onlyUriWithParams: string | null; // URI with parameters or null
    onlyParamsJsn: Record<string, string> | null; // Query parameters as an object or null
    type: string | null;             // Type of the parsed URL (e.g., custom classification) or null
    port: string | null;             // Port number or null
}

export interface ParsedUrlWithNormalization extends ParsedUrl {
    normalizedUrl: string | null;    // Normalized version of the URL or null
}



export type NormalizerType = {
    modifiedUrl: string | null | undefined; // 현재 URL 상태 (수정됨)

    // Extracts and normalizes protocol from the URL
    extractAndNormalizeProtocolFromSpacesRemovedUrl: () => string | null;

    // Extracts and normalizes domain information from the URL
    extractAndNormalizeDomainFromProtocolRemovedUrl: () => {
        domain: string | null;
        type: "ip_v4" | "ip_v6" | "localhost" | "domain" | null;
    };

    // Extracts and normalizes port from the URL
    extractAndNormalizePortFromDomainRemovedUrl: () => string | null;

    // Finalizes the normalized URL by combining protocol, domain, port, and other parts
    finalizeNormalization: (
        protocol: string | null,
        port: string | null,
        domain: string | null
    ) => string;

    // Extracts URI and query parameters from the URL
    extractAndNormalizeUriParamsFromPortRemovedUrl: () => {
        uri: string | null; // URI 부분
        params: string | null; // 쿼리 파라미터
    };
}

export type EmailInfo = {
    email: string | null;             // Full email address or null
    removedTailOnEmail: string | null; // Part of the email removed from the tail or null
    type: "ip_v4" | "ip_v6" | "domain" | null;
};
