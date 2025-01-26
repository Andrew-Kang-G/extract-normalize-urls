/*
*   Types consist of 1) Parameters, 2) One, 3) List Areas
* */

/* Parameters */
export type NoProtocolJsnParamType = {
    ipV4?: boolean;
    ipV6?: boolean;
    localhost?: boolean;
    intranet?: boolean;
};

/* One area */
export interface ParsedUrlComponents {
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
export interface ParsedUrlWithNormalizationComponents extends ParsedUrlComponents {
    normalizedUrl: string | null;    // Normalized version of the URL or null
}
export type ParsedEmailComponents = {
    email: string | null;             // Full email address or null
    removedTailOnEmail: string | null; // Part of the email removed from the tail or null
    type: "ipV4" | "ipV6" | "domain" | null;
};

/*
*   One area (Only for URL Normalization)
* */
export type NormalizerType = {
    sacrificedUrl: string | null | undefined;
    currentStep: number;

    initializeSacrificedUrl: (url: string) => void;
    ensureStepCompleted: (requiredStep: number) => void;
    // Extracts and normalizes protocol from the URL
    extractAndNormalizeProtocolFromSpacesRemovedUrl: () => string | null;

    // Extracts and normalizes domain information from the URL
    extractAndNormalizeDomainFromProtocolRemovedUrl: () => {
        domain: string | null;
        type: "ipV4" | "ipV6" | "localhost" | "domain" | null;
    };

    // Extracts and normalizes port from the URL
    extractAndNormalizePortFromDomainRemovedUrl: () => string | null;

    // Finalizes the normalized URL by combining protocol, domain, port, and other parts
    extractNormalizedUrl: (
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


/*
*   List Area
* */

export interface StringValueBaseMatch {
    value: string;
    area: string;
}

export interface BaseMatch {
    value: ParsedUrlComponents;
    area: string;
}

export interface IndexContainingBaseMatch extends BaseMatch{
    index: {
        start: number;
        end: number;
    };
}

export interface ExtractCertainUriMatch  {
    uriDetected?: IndexContainingBaseMatch;
    inWhatUrl?: IndexContainingBaseMatch;
}

export interface EmailMatch {
    value: ParsedEmailComponents;
    area: string;
    index: {
        start: number;
        end: number;
    };
    pass: boolean;
}
/*
*   List Area - XML
* */
export interface ElementMatch {
    value: string;
    elementName: string;
    startIndex: number;
    lastIndex: number;
    commentArea: boolean | null;
}

export interface CommentMatch {
    value: string;
    startIndex: number;
    lastIndex: number;
}
