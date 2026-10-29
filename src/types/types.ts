export interface AcmeDomain {
    main?: string;
    sans?: string[];
}

export interface AcmeCertificate {
    domain?: AcmeDomain;
    certificate?: string;
    key?: string;
}

export interface AcmeResolverStore {
    Certificates?: AcmeCertificate[];
}

export type AcmeStore = Record<string, AcmeResolverStore>;

export interface ExportOptions {
    inputFile: string;
    outputDir: string;
}