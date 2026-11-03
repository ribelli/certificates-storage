import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

import {AppState} from '@app/app.state';
import {CertificateActions} from '@store/actions/index';
import {LocalStorageService} from './local-storage.service';
import {
  arrayBufferToBase64,
  CertificateError,
  CertificateInfo,
  dataUrlToArrayBuffer,
  parseCertificate,
  toDer,
} from './certificate-parser';

const STORED_MIME_TYPE = 'application/pkix-cert';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {

  constructor(private store: Store<AppState>,
              private localStorageService: LocalStorageService) {
  }

  private static parseStoredValue(value: string): CertificateInfo {
    return parseCertificate(toDer(dataUrlToArrayBuffer(value)));
  }

  public hasCertificate(name: string): boolean {
    return this.localStorageService.getItem(name) !== null;
  }

  public addCertificate(name: string, content: ArrayBuffer): void {
    if (this.hasCertificate(name)) {
      throw new CertificateError(`Certificate "${name}" already exists`);
    }

    const der = toDer(content);
    parseCertificate(der);

    const dataUrl = `data:${STORED_MIME_TYPE};base64,${arrayBufferToBase64(der)}`;
    try {
      this.localStorageService.setItem(name, dataUrl);
    } catch {
      throw new CertificateError('Not enough browser storage to save this certificate');
    }
    this.store.dispatch(new CertificateActions.AddCertificate(name));
  }

  public removeCertificate(name: string): void {
    this.localStorageService.removeItem(name);
    this.store.dispatch(new CertificateActions.RemoveCertificate(name));
  }

  public getCertificateInfo(name: string): CertificateInfo {
    const value = this.localStorageService.getItem(name);
    if (value === null) {
      throw new CertificateError(`Certificate "${name}" not found`);
    }
    return CertificateService.parseStoredValue(value);
  }

  public loadFromStorage(): void {
    for (const name of this.localStorageService.keys()) {
      const value = this.localStorageService.getItem(name);
      if (value === null || !value.startsWith('data:')) {
        continue;
      }
      try {
        CertificateService.parseStoredValue(value);
      } catch {
        continue;
      }
      this.store.dispatch(new CertificateActions.AddCertificate(name));
    }
  }
}
