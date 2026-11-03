import {TestBed} from '@angular/core/testing';
import {MockStore, provideMockStore} from '@ngrx/store/testing';

import {CertificateService} from './certificate.service';
import {LocalStorageService} from './local-storage.service';
import {CertificateError} from './certificate-parser';
import {AddCertificate, RemoveCertificate} from '@store/actions/certificate.actions';
import {pemToDer, TEST_CERTIFICATE_PEM, textToArrayBuffer} from '../testing/test-certificate';

describe('CertificateService', () => {
  let service: CertificateService;
  let store: MockStore;
  let storage: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideMockStore({initialState: {certificates: []}})],
    });
    service = TestBed.inject(CertificateService);
    store = TestBed.inject(MockStore);
    storage = TestBed.inject(LocalStorageService);
    spyOn(store, 'dispatch');
  });

  afterEach(() => localStorage.clear());

  it('stores a PEM file as a normalized DER certificate', () => {
    service.addCertificate('cert.pem', textToArrayBuffer(TEST_CERTIFICATE_PEM));

    expect(localStorage.getItem('cert.pem')).toMatch(/^data:application\/pkix-cert;base64,MIIB/);
    expect(store.dispatch).toHaveBeenCalledWith(new AddCertificate('cert.pem'));
    expect(service.getCertificateInfo('cert.pem').notAfter).toBe('2036/10/31');
  });

  it('rejects a file that is not a certificate and stores nothing', () => {
    expect(() => service.addCertificate('key.p12', textToArrayBuffer('garbage')))
      .toThrowError(CertificateError);
    expect(localStorage.getItem('key.p12')).toBeNull();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('rejects a duplicate name', () => {
    service.addCertificate('cert.cer', pemToDer(TEST_CERTIFICATE_PEM));

    expect(() => service.addCertificate('cert.cer', pemToDer(TEST_CERTIFICATE_PEM)))
      .toThrowError(CertificateError, /already exists/);
  });

  it('reports a full storage and does not update the store', () => {
    spyOn(storage, 'setItem').and.throwError('QuotaExceededError');

    expect(() => service.addCertificate('cert.cer', pemToDer(TEST_CERTIFICATE_PEM)))
      .toThrowError(CertificateError, /storage/);
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('removes a certificate', () => {
    service.addCertificate('cert.cer', pemToDer(TEST_CERTIFICATE_PEM));
    service.removeCertificate('cert.cer');

    expect(localStorage.getItem('cert.cer')).toBeNull();
    expect(store.dispatch).toHaveBeenCalledWith(new RemoveCertificate('cert.cer'));
  });

  it('throws CertificateError for an unknown certificate instead of crashing', () => {
    expect(() => service.getCertificateInfo('missing.cer')).toThrowError(CertificateError, /not found/);
  });

  it('loads only readable certificates from storage, including entries saved by the old version', () => {
    localStorage.setItem('new.cer', 'data:application/pkix-cert;base64,' +
      TEST_CERTIFICATE_PEM.replace(/-----[A-Z ]+-----|\s/g, ''));
    localStorage.setItem('old.pem', 'data:application/x-pem-file;base64,' + btoa(TEST_CERTIFICATE_PEM));
    localStorage.setItem('key.p12', 'data:application/x-pkcs12;base64,' + btoa('not a certificate'));
    localStorage.setItem('other-app-setting', 'true');
    const before = {...localStorage};

    service.loadFromStorage();

    const dispatched = (store.dispatch as jasmine.Spy).calls.allArgs().map(args => args[0]);
    expect(dispatched).toEqual(jasmine.arrayWithExactContents([
      new AddCertificate('new.cer'),
      new AddCertificate('old.pem'),
    ]));
    expect({...localStorage}).toEqual(before);
  });
});
