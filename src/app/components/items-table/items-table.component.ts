import {Component, OnDestroy, OnInit} from '@angular/core';
import {Certificate} from 'pkijs';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CommonModal, DialogData} from '../common-modal/common-modal.component';
import {Observable, Subject} from 'rxjs';
import {CertificateService} from '../../services/certificate.service';
import {takeUntil} from 'rxjs/operators';


const HEADER_TEXT = 'Existing certificates:';
const EMPTY_LIST = 'Unfortunately, this list is empty';

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})

export class ItemsTableComponent implements OnInit, OnDestroy {
  private headerText: string = HEADER_TEXT;
  private emptyListOfCertificates: string = EMPTY_LIST;
  public fileList$: Observable<Certificate[]>|null = this.certificateService.getListFromStorage();
  public fileList: Certificate[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor (
    private dialog: MatDialog,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    this.fileList$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        fileList => {
            this.fileList = fileList;
          }
      );

    this.certificateService.get();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  showCurrentCertificateInfo(certificate: string): void {
    this.openDialog(certificate, this.getCertificateInfo(certificate));
  }

  getCertificateInfo(certificate: string): object {
    const currentCertificate = this.mapKeyValueFromStorage(certificate);
    const arrayBuffer = CertificateService.base64ToArrayBuffer(currentCertificate);

    return {
      text: certificate,
      data: CertificateService.decodingCertificate(arrayBuffer)
    };
  }

  mapKeyValueFromStorage(certificate: string) {
    return CertificateService.getFromStorage(this.getKeyByValue(certificate));
  }

  getKeyByValue(value: string): string {
    return Object.keys(window.localStorage).find(key => key === value);
  }

  onElementDeleted(certificateName: string): void {
    this.certificateService.removeCertificate(certificateName);
  }

  openDialog(certificate: string, generalInfo: object): void {
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

  trackByID(index: number, item: string): number {
    return index;
  }
}
