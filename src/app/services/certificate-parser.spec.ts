import {arrayBufferToBase64, CertificateError, parseCertificate, toDer} from './certificate-parser';
import {FAKE_PRIVATE_KEY_PEM, pemToDer, TEST_CERTIFICATE_PEM, textToArrayBuffer} from '../testing/test-certificate';

describe('certificate-parser', () => {
  const der = pemToDer(TEST_CERTIFICATE_PEM);

  it('parses a DER certificate', () => {
    const info = parseCertificate(toDer(der));

    expect(info.notBefore).toBe('2026/11/03');
    expect(info.notAfter).toBe('2036/10/31');
    expect(info.subject).toEqual([
      {name: 'Country', value: 'UA'},
      {name: 'Organization Name Oid', value: 'Test Org'},
      {name: 'Common name', value: 'test.example.com'},
    ]);
    expect(info.issuer).toEqual(info.subject);
  });

  it('converts a PEM certificate to the same DER bytes', () => {
    const fromPem = toDer(textToArrayBuffer(TEST_CERTIFICATE_PEM));

    expect(arrayBufferToBase64(fromPem)).toBe(arrayBufferToBase64(der));
  });

  it('keeps only the certificate from a PEM file that also contains a private key', () => {
    const bundle = textToArrayBuffer(FAKE_PRIVATE_KEY_PEM + TEST_CERTIFICATE_PEM);

    expect(arrayBufferToBase64(toDer(bundle))).toBe(arrayBufferToBase64(der));
  });

  it('rejects a PEM file without a certificate', () => {
    expect(() => toDer(textToArrayBuffer(FAKE_PRIVATE_KEY_PEM))).toThrowError(CertificateError);
  });

  it('rejects data that is not ASN.1', () => {
    expect(() => parseCertificate(textToArrayBuffer('hello world'))).toThrowError(CertificateError);
  });

  it('rejects valid ASN.1 that is not a certificate', () => {
    // DER for SEQUENCE { INTEGER 1 }
    const notACertificate = new Uint8Array([0x30, 0x03, 0x02, 0x01, 0x01]).buffer;

    expect(() => parseCertificate(notACertificate)).toThrowError(CertificateError);
  });
});
