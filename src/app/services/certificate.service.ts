import { Injectable, NgModule } from '@angular/core';
//import {CertificateItem} from '../entities/certificate-item.interface';
import { BrowserModule } from '@angular/platform-browser';
import { Certificate } from 'pkijs';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
@NgModule({
  imports: [BrowserModule],
})
export class CertificateService {
  private fileList: string[] = new Array<string>();
  private fileList$: Subject<string[]> = new Subject<string[]>();

  public upload(fileName: string, fileContent: any): void {
    this.fileList.push(fileName);
    this.fileList$.next(this.fileList);
    this.saveToStorage(fileName, fileContent);
  }

  public download(fileName: string): void {
    this.fileList.push(fileName);
    this.fileList$.next(this.fileList);
  }

  public get(): void {
    this.fileList$.next(this.fileList);
  }

  public remove(fileName): void {
    this.fileList.splice(
      this.fileList.findIndex((name) => name === fileName),
      1
    );
    this.fileList$.next(this.fileList);
    localStorage.removeItem(fileName);
  }

  public list(): Observable<string[]> {

    for (let i = 0; i < localStorage.length; i++) {
      this.fileList.push(Object.entries(localStorage)[i][0]);
    }

    this.fileList$.next(this.fileList);

    return this.fileList$;
  }

  private saveToStorage(key: string, b64Result: string) {
    localStorage.setItem(key, b64Result);
  }

  getFromStorage(key: string) {
    return localStorage.getItem(key);
  }

  static trimUTCformat(typeOfDate) {
    const currentFormat = 'YYYY/MM/DD';
    return  moment(new Date(typeOfDate.value.toString())).format(currentFormat);
  }

  base64ToArrayBuffer(base64) {
    let startIndex = base64.indexOf("base64,") + 7;
    let b64 = base64.substr(startIndex);
    let binary_string = atob(b64);
    let bytes = new Uint8Array(binary_string.length);
    for (let i = 0; i < binary_string.length; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  blobToBase64(certificate: Certificate): Observable<{}> {
    const fileReader = new FileReader();

    const observable = new Observable((observer) => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
    fileReader.readAsDataURL(certificate);
    return observable;
  }
}
