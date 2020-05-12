import {Injectable, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Certificate} from 'pkijs';
import {Observable, Subject} from 'rxjs';
import {CERTIFICATE_MAP} from '../entities/certificate-map';
import {format} from 'date-fns';


@Injectable({
  providedIn: 'root',
})
@NgModule({
  imports: [BrowserModule],
})
export class CertificateService {
  private certificateMap: object = CERTIFICATE_MAP;
  private fileList: string[] = new Array<string>();
  private fileList$: Subject<string[]> = new Subject<string[]>();

  public upload(fileName: string, fileContent: any): void {
    this.fileList.push(fileName);
    this.fileList$.next(this.fileList);
    this.saveToStorage(fileName, fileContent);
  }

  public get(): void {
    this.fileList$.next(this.fileList);
  }

  public remove(fileName): void {
    this.fileList.splice(
      this.fileList.findIndex(name => name === fileName),
      1
    );
    this.fileList$.next(this.fileList);
    window.localStorage.removeItem(fileName);
  }

  public getListFromStorage(): Observable<string[]> {
    for (let i = 0; i < window.localStorage.length; i++) {
      let currentObject = Object.entries(window.localStorage)[i];
      if (currentObject[1].startsWith('data:application/x-x509-ca-cert;base64,')){
        this.fileList.push(currentObject[0]);
      }
    }

    this.fileList$.next(this.fileList);

    return this.fileList$;
  }

  getGeneralInfo(certificate: Certificate, value: 'subject' | 'issuer') {
    let arr = [];
    for (const typeAndValue of certificate[value].typesAndValues) {
      let typeValue = this.certificateMap[typeAndValue.type];

      if(typeof typeValue === 'undefined') {
        typeValue = typeAndValue.type;
      }

      const subjectValue = typeAndValue.value.valueBlock.value;

      arr.push({name: typeValue, value:subjectValue});
    }
    return arr;
  }

  private saveToStorage(key: string, b64Result: string) {
    window.localStorage.setItem(key, b64Result);
  }

  getFromStorage(key: string) {
    return window.localStorage.getItem(key);
  }

  static trimUTCformat(typeOfDate) {
    const currentFormat = 'yyyy/MM/dd';
    return format(new Date(typeOfDate.value.toString()),currentFormat);
  }

  base64ToArrayBuffer(base64) {
    let startIndex = base64.indexOf('base64,') + 7;
    let b64 = base64.substr(startIndex);
    let binaryString = atob(b64);
    let bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
