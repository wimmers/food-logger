export interface OSMSupermarket {
    type: string;
    id:   number;
    lat:  number;
    lon:  number;
    tags: OSMTags;
}

export interface OSMTags {
    "addr:city"?:              string;
    "addr:country"?:           string;
    "addr:housenumber"?:       string;
    "addr:postcode"?:          string;
    "addr:street"?:            string;
    brand?:                    string;
    "brand:wikidata"?:         string;
    "brand:wikipedia"?:        string;
    name?:                     string;
    opening_hours?:            string;
    phone?:                    string;
    shop:                      string;
    website?:                  string;
    wheelchair?:               string;
    level?:                    string;
    "contact:phone"?:          string;
    "payment:apple_pay"?:      string;
    "payment:cash"?:           string;
    "payment:contactless"?:    string;
    "payment:google_pay"?:     string;
    "payment:maestro"?:        string;
    "payment:mastercard"?:     string;
    "payment:v_pay"?:          string;
    "payment:visa"?:           string;
    "wheelchair:description"?: string;
    email?:                    string;
    fax?:                      string;
    operator?:                 string;
    organic?:                  string;
    bulk_purchase?:            string;
    "contact:email"?:          string;
    "contact:website"?:        string;
    "payment:credit_cards"?:   string;
    "payment:debit_cards"?:    string;
    source?:                   string;
    "toilets:wheelchair"?:     string;
    zero_waste?:               string;
}