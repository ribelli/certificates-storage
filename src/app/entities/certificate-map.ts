export const CERTIFICATE_MAP = {
  "2.5.4.3": "Common name",
  "2.5.4.6": "Country",
  "2.5.4.5": "Additional",
  "2.5.4.8": "Region",
  "2.5.4.7": "City",
  "2.5.4.10": "Organization Name Oid",
  "2.5.4.11": "Organizational Unit Name Oid",
  "2.5.4.12": "T",
  "2.5.4.4": "SN",
  "2.5.4.42": "GN",
  "2.5.4.43": "I",
  "1.2.840.113549.1.9.1": "E-mail"
};

export const CERTIFICATE_MIME_TYPES = [
  'application/pkcs8',
  'application/pkcs10',
  'application/pkix-cert',
  'application/pkix-crl',
  'application/pkcs7-mime',

  'application/x-x509-ca-cert',
  'application/x-x509-user-cert',
  'application/x-pkcs7-crl',

  'application/x-pem-file',
  'application/x-pkcs12',

  'application/x-pkcs7-certificates',
  'application/x-pkcs7-certreqresp',
];
