import {Component, OnInit} from '@angular/core';
import {Certificate} from 'pkijs';
import {MatDialog} from '@angular/material';
import {CommonModal} from '../common-modal/common-modal.component';
import {Observable} from 'rxjs';
import {CertificateService} from '../../services/certificate.service';
import * as asn1js from 'asn1js';


const HEADER_TEXT = 'Existing certificates:';
const EMPTY_LIST = 'Unfortunately, this list is empty';

@Component({
  selector: "app-items-table",
  templateUrl: "./items-table.component.html",
  styleUrls: ["./items-table.component.scss"],
})

export class ItemsTableComponent implements OnInit {
  private headerText: string = HEADER_TEXT;
  private emptyListOfCertificates: string = EMPTY_LIST;
  public fileList$: Observable<string[]> = this.certificateService.getListFromStorage();
  public fileList: string[] = [];

  constructor(
    public dialog: MatDialog,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.fileList$.subscribe((fileList) => {
      this.fileList = fileList;
    });

    this.certificateService.get();
  }

  showCurrentCertificateInfo(certificate: string): void {
    this.openDialog(certificate, this.getCertificateInfo(certificate));
  }

  private getCertificateInfo(certificate: string) {
    const currentCertificate = this.mapKeyValueFromStorage(certificate);
    const arrayBuffer = this.certificateService.base64ToArrayBuffer(currentCertificate);

    return {
      text: certificate,
      data: this.decodingCertificate(arrayBuffer)
    };
  }

  private mapKeyValueFromStorage(certificate: string) {
    return this.certificateService.getFromStorage(this.getKeyByValue(certificate));
  }

  private getKeyByValue(value) {
    return Object.keys(window.localStorage).find(key => key === value);
  }

  private decodingCertificate(element) {
    const asn1Result = asn1js.fromBER(element);

    if (asn1Result.offset === (-1)) {
      console.log('Can not parse binary data');
    }

    const certificate = new Certificate({ schema: asn1Result.result });

    return {
      notBefore: CertificateService.trimUTCformat(certificate.notBefore),
      notAfter: CertificateService.trimUTCformat(certificate.notAfter),
      issuer: this.certificateService.getGeneralInfo(certificate, 'issuer'),
      subject: this.certificateService.getGeneralInfo(certificate, 'subject'),
    };
  }

  onElementDeleted(certificate: string): void {
    this.certificateService.remove(certificate);
  }

  openDialog(certificate: string, generalInfo: object): void {
    this.dialog.open(CommonModal, {
      width: "80vw",
      data: {
        text: certificate,
        generalInfo: {
          info: generalInfo
        }
      }
    });
  }
}

// const config = new MatDialogConfig<DialogData>();
// config.width = '80vw';
// config.data = {
//   text: certificate,
//   generalInfo: {
//     info: generalInfo
//   }
// } as DialogData;
// this.dialog.open<CommonModal, DialogData, void>(CommonModal, config);
