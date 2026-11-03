// Self-signed test certificate: /C=UA/O=Test Org/CN=test.example.com,
// valid 2026-11-03 .. 2036-10-31. Not used anywhere outside of tests.
export const TEST_CERTIFICATE_PEM = `-----BEGIN CERTIFICATE-----
MIIBtzCCAV6gAwIBAgIBATAKBggqhkjOPQQDAjA7MQswCQYDVQQGEwJVQTERMA8G
A1UECgwIVGVzdCBPcmcxGTAXBgNVBAMMEHRlc3QuZXhhbXBsZS5jb20wHhcNMjYx
MTAzMTUwMDI2WhcNMzYxMDMxMTUwMDI2WjA7MQswCQYDVQQGEwJVQTERMA8GA1UE
CgwIVGVzdCBPcmcxGTAXBgNVBAMMEHRlc3QuZXhhbXBsZS5jb20wWTATBgcqhkjO
PQIBBggqhkjOPQMBBwNCAATdOWqDwT+OCVep0m+idsA5ysGVb0W/xHA4RhV5xhPn
jfrzNXCTIajf9cwTZfpdDXVh8qcKhX2aWZpaX54iahBro1MwUTAdBgNVHQ4EFgQU
uS7FtRDydwvfwO0sZWOfHycXFPgwHwYDVR0jBBgwFoAUuS7FtRDydwvfwO0sZWOf
HycXFPgwDwYDVR0TAQH/BAUwAwEB/zAKBggqhkjOPQQDAgNHADBEAiBAvR4CVjhp
/5PBT5ZrF+5xV2rJvstptFHRBwoMIOT6mgIgB2+zKxtM3j520HhQqBpFH6a3lWer
bThKcCrC86FUlaY=
-----END CERTIFICATE-----
`;

// Not a real key: only the PEM armor matters for the tests.
export const FAKE_PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
TUlJQ2VRSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NBbU13Z2dKZkFnRUFBb0dC
-----END PRIVATE KEY-----
`;

export const textToArrayBuffer = (text: string): ArrayBuffer => {
  const bytes = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) {
    bytes[i] = text.charCodeAt(i);
  }
  return bytes.buffer;
};

export const pemToDer = (pem: string): ArrayBuffer => {
  const base64 = pem.replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
  return textToArrayBuffer(atob(base64));
};
