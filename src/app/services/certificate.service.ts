import {Injectable, NgModule} from '@angular/core';
import {Store} from '@ngrx/store';
import {BrowserModule} from '@angular/platform-browser';
import {Certificate} from 'pkijs';
import {format} from 'date-fns';
import * as asn1js from 'asn1js';

import {AppState} from '../app.state';
import * as Actions from '../store/actions/certificate';
import {LocalStorageService} from './local-storage.service';

import {CERTIFICATE_MAP} from '../entities/certificate-map';
import {CERTIFICATE_MIME_TYPES} from '../entities/certificate-map';


@Injectable({
  providedIn: 'root',
})
@NgModule({
  imports: [BrowserModule],
})
export class CertificateService {

  constructor(private store: Store<AppState>,
              private localStorageService: LocalStorageService) {
  }

  private static certificateMap = CERTIFICATE_MAP;

  public static decodingCertificate(element) {
    const asn1Result = asn1js.fromBER(element);

    if (asn1Result.offset === (-1)) {
      console.log('Can not parse binary data');
    }

    const certificate = new Certificate({schema: asn1Result.result});

    return {
      notBefore: CertificateService.trimUTCformat(certificate.notBefore),
      notAfter: CertificateService.trimUTCformat(certificate.notAfter),
      issuer: CertificateService.getGeneralInfo(certificate, 'issuer'),
      subject: CertificateService.getGeneralInfo(certificate, 'subject'),
    };
  }

  private static getGeneralInfo(certificate: Certificate, value: 'subject' | 'issuer') {
    const arr = [];
    for (const typeAndValue of certificate[value].typesAndValues) {
      let typeValue = CertificateService.certificateMap[typeAndValue.type];

      if (typeof typeValue === 'undefined') {
        typeValue = typeAndValue.type;
      }

      const subjectValue = typeAndValue.value.valueBlock.value;

      arr.push({name: typeValue, value: subjectValue});
    }
    return arr;
  }

  static trimUTCformat(typeOfDate) {
    const currentFormat = 'yyyy/MM/dd';
    return format(new Date(typeOfDate.value.toString()), currentFormat);
  }

  public static base64ToArrayBuffer(base64: string) {
    const startIndex = base64.indexOf('base64,') + 7;
    const b64 = base64.substr(startIndex);
    const binaryString = atob(b64);
    const bytesArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytesArray[i] = binaryString.charCodeAt(i);
    }
    return bytesArray.buffer;
  }

  private static isCertificateValid(value: string): boolean {
    for (const certificateType of CERTIFICATE_MIME_TYPES) {
      if (value.startsWith('data:' + certificateType)) {
        return true;
      }
    }
    return false;
  }

  private storeAddCertificate(name: string, content: any): void {
    this.store.dispatch(new Actions.AddCertificate(name));
    this.localStorageService.setItem(name, content);
  }

  private storeRemoveCertificate(name: string): void {
    this.store.dispatch(new Actions.RemoveCertificate(name));
    this.localStorageService.removeItem(name);
  }

  public uploadCertificate(name: string, content: any): void {
    if (CertificateService.isCertificateValid(content)) {
      this.storeAddCertificate(name, content);
    }
  }

  public removeCertificate(name: string): void {
    this.storeRemoveCertificate(name);
  }

  public getCertificateByName(name: string): string | null {
    return this.localStorageService.getItem(name);
  }

  public getListFromStorage(): void {
    for (let i = 0; i < window.localStorage.length; i++) {
      const currentObject = Object.entries(window.localStorage)[i];
      this.uploadCertificate(currentObject[0], currentObject[1]);
    }
  }
}
