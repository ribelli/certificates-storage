import {Certificate} from 'pkijs';
import {format} from 'date-fns';
import * as asn1js from 'asn1js';

import {CERTIFICATE_MAP} from '../entities/certificate-map';

const DATE_FORMAT = 'yyyy/MM/dd';
const PEM_CERTIFICATE_REGEX = /-----BEGIN CERTIFICATE-----([A-Za-z0-9+/=\s]+)-----END CERTIFICATE-----/;
const PEM_ANY_BLOCK = '-----BEGIN ';
const BASE64_MARKER = 'base64,';

export interface NameAttribute {
  name: string;
  value: string;
}

export interface CertificateInfo {
  notBefore: string;
  notAfter: string;
  issuer: NameAttribute[];
  subject: NameAttribute[];
}

interface X509Name {
  typesAndValues: Array<{ type: string; value: any }>;
}

export class CertificateError extends Error {
  constructor(message: string) {
    super(message);
    // Needed for `instanceof` to work when compiling to ES5.
    Object.setPrototypeOf(this, CertificateError.prototype);
    this.name = 'CertificateError';
  }
}

const arrayBufferToBinaryString = (buffer: ArrayBuffer): string => {
  let result = '';
  for (const byte of Array.from(new Uint8Array(buffer))) {
    result += String.fromCharCode(byte);
  }
  return result;
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64.replace(/\s+/g, ''));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => btoa(arrayBufferToBinaryString(buffer));

export const dataUrlToArrayBuffer = (dataUrl: string): ArrayBuffer => {
  const index = dataUrl.indexOf(BASE64_MARKER);
  if (!dataUrl.startsWith('data:') || index === -1) {
    throw new CertificateError('Not a base64 data URL');
  }
  try {
    return base64ToArrayBuffer(dataUrl.substr(index + BASE64_MARKER.length));
  } catch {
    throw new CertificateError('Invalid base64 data');
  }
};

export const toDer = (content: ArrayBuffer): ArrayBuffer => {
  const text = arrayBufferToBinaryString(content);
  if (text.indexOf(PEM_ANY_BLOCK) === -1) {
    return content;
  }
  const match = PEM_CERTIFICATE_REGEX.exec(text);
  if (!match) {
    throw new CertificateError('PEM file does not contain a certificate');
  }
  try {
    return base64ToArrayBuffer(match[1]);
  } catch {
    throw new CertificateError('PEM certificate contains invalid base64');
  }
};

const getNameAttributes = (name: X509Name): NameAttribute[] =>
  name.typesAndValues.map(typeAndValue => ({
    name: CERTIFICATE_MAP[typeAndValue.type] || typeAndValue.type,
    value: typeAndValue.value.valueBlock.value,
  }));

const formatDate = (time: { value: Date }): string => format(time.value, DATE_FORMAT);

export const parseCertificate = (der: ArrayBuffer): CertificateInfo => {
  const asn1 = asn1js.fromBER(der);
  if (asn1.offset === -1) {
    throw new CertificateError('File is not valid DER-encoded data');
  }

  let certificate: Certificate;
  try {
    certificate = new Certificate({schema: asn1.result});
  } catch {
    throw new CertificateError('File is not an X.509 certificate');
  }

  return {
    notBefore: formatDate(certificate.notBefore),
    notAfter: formatDate(certificate.notAfter),
    issuer: getNameAttributes(certificate.issuer),
    subject: getNameAttributes(certificate.subject),
  };
};
