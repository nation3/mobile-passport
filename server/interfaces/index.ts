export interface Pass {
    organizationName: string;
    passTypeIdentifier: string;
    description: string;
    teamIdentifier: string;
    backgroundColor: string;
    foregroundColor: string;
    labelColor: string;
    formatVersion: number;
    storeCard: StoreCard;
    barcodes: Barcode[];
}

export interface Barcode {
    message: string;
    format: string;
    messageEncoding: string;
}

export interface StoreCard {
    headerFields: Field[];
    primaryFields: any[];
    secondaryFields: Field[];
}

export interface Field {
    value: string;
    label: string;
    key: string;
    fieldUUID?: string;
}
