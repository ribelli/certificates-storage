import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Certificate} from 'pkijs';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {CERTIFICATE_MAP} from '../entities/certificate-map';
import {format} from 'date-fns';
import * as asn1js from 'asn1js';


@Injectable({
  providedIn: 'root',
})
@NgModule({
  imports: [BrowserModule],
})
export class CertificateService {
  private static certificateMap = CERTIFICATE_MAP;
  private fileList: Certificate[] = new Array<Certificate>();
  private fileList$: Subject<Certificate[]> = new ReplaySubject<Certificate[]>(1);

  public uploadCertificate(certificateName: string, certificateContent: any): void {
    this.fileList.push(certificateName);
    this.fileList$.next(this.fileList);
    CertificateService.saveToStorage(certificateName, certificateContent);
  }

  public get(): void {
    this.fileList$.next(this.fileList);
  }

  public removeCertificate(certificateName: string): void {
    this.fileList.splice(
      this.fileList.findIndex(name => name === certificateName),
      1);
    this.fileList$.next(this.fileList);
    window.localStorage.removeItem(certificateName);
  }

  public getListFromStorage() {
    for (let i = 0; i < window.localStorage.length; i++) {
      let currentObject = Object.entries(window.localStorage)[i];
      if (currentObject[1].startsWith('data:application/x-x509-ca-cert;base64,')){
        this.fileList.push(currentObject[0]);
      }
    }

    return this.fileList$.asObservable();
  }

  public static decodingCertificate(element) {
    const asn1Result = asn1js.fromBER(element);

    if (asn1Result.offset === (-1)) {
      console.log('Can not parse binary data');
    }

    const certificate = new Certificate({ schema: asn1Result.result });
    console.log(certificate);

    return {
      notBefore: CertificateService.trimUTCformat(certificate.notBefore),
      notAfter: CertificateService.trimUTCformat(certificate.notAfter),
      issuer: CertificateService.getGeneralInfo(certificate, 'issuer'),
      subject: CertificateService.getGeneralInfo(certificate, 'subject'),
    };
  }

  private static getGeneralInfo(certificate: Certificate, value: 'subject' | 'issuer') {
    let arr = [];
    for (const typeAndValue of certificate[value].typesAndValues) {
      let typeValue = CertificateService.certificateMap[typeAndValue.type];

      if(typeof typeValue === 'undefined') {
        typeValue = typeAndValue.type;
      }

      const subjectValue = typeAndValue.value.valueBlock.value;

      arr.push({name: typeValue, value:subjectValue});
    }
    return arr;
  }

  private static saveToStorage(key: string, b64Result: string): void {
    window.localStorage.setItem(key, b64Result);
  }

  public static getFromStorage(key: string): string {
    return window.localStorage.getItem(key);
  }

  static trimUTCformat(typeOfDate) {
    const currentFormat = 'yyyy/MM/dd';
    return format(new Date(typeOfDate.value.toString()),currentFormat);
  }

  public static base64ToArrayBuffer(base64: string) {
    let startIndex = base64.indexOf('base64,') + 7;
    let b64 = base64.substr(startIndex);
    let binaryString = atob(b64);
    let bytesArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytesArray[i] = binaryString.charCodeAt(i);
    }
    return bytesArray.buffer;
  }
}
