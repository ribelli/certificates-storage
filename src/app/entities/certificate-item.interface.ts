export interface CertificateItem {
  commonName: string;
  country: string;
  region: string,
  city: string,
  issuerCN: string;
  validFrom: string;
  validTill: string;
  organizationNameOid: string;
  organizationalUnitNameOid: string;
  email: string;
}

export interface ICertificate {
  tbs: ArrayBuffer,
  version: number,
  notBefore: {
    type: number,
    value: object
  },
  notAfter: {
    type: number,
    value: object
  },
  issuer: {
    typesAndValues: [
      {
        type: string,
        value: {
          valueBlock: {
            value: string
          }
        }
      }
    ],
    valueBeforeDecode: ArrayBuffer
  },
  subject: {
    typesAndValues: [
      {
        type: string,
        value: {
          valueBlock: {
            value: string
          }
        }
      }
    ],
    valueBeforeDecode: ArrayBuffer
  },
}
