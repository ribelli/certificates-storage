import {Component, OnInit} from '@angular/core';
import {Certificate} from 'pkijs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CommonModal, DialogData} from '../common-modal/common-modal.component';
import {Observable} from 'rxjs';
import {CertificateService} from '../../services/certificate.service';


const HEADER_TEXT = 'Existing certificates:';
const EMPTY_LIST = 'Unfortunately, this list is empty';

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})

export class ItemsTableComponent implements OnInit {
  private headerText: string = HEADER_TEXT;
  private emptyListOfCertificates: string = EMPTY_LIST;
  public fileList$: Observable<Certificate[]> = this.certificateService.getListFromStorage();
  public fileList: Certificate[] = [];

  constructor (
    public dialog: MatDialog,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    debugger
    this.fileList$.subscribe(fileList => {
      this.fileList = fileList;
    });

    this.certificateService.get();
  }

  private showCurrentCertificateInfo(certificate: string): void {
    this.openDialog(certificate, this.getCertificateInfo(certificate));
  }

  private getCertificateInfo(certificate: string) {
    const currentCertificate = this.mapKeyValueFromStorage(certificate);
    const arrayBuffer = CertificateService.base64ToArrayBuffer(currentCertificate);

    return {
      text: certificate,
      data: CertificateService.decodingCertificate(arrayBuffer)
    };
  }

  private mapKeyValueFromStorage(certificate: string) {
    return CertificateService.getFromStorage(this.getKeyByValue(certificate));
  }

  private getKeyByValue(value: string) {
    return Object.keys(window.localStorage).find(key => key === value);
  }

  private onElementDeleted(certificate: string): void {
    this.certificateService.remove(certificate);
  }

  private openDialog(certificate: string, generalInfo: object): void {
    const config = new MatDialogConfig<DialogData>();
    config.width = '80vw';
    config.data = {
       text: certificate,
       generalInfo: {
         info: generalInfo,
         text: '',
       }
    } as DialogData;
    this.dialog.open<CommonModal, DialogData, void>(CommonModal, config);
  }

  private trackByID(index: number, item: string) {
    return index;
  }
}
