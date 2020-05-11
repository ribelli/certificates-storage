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
