import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Certificate} from 'pkijs';
import { Store } from '@ngrx/store';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import {AppState} from '@app/app.state';
import {CommonModalComponent, DialogData} from '../common-modal/common-modal.component';
import {CertificateService} from '@services/certificate.service';


const HEADER_TEXT = 'Existing certificates:';
const EMPTY_LIST = 'Unfortunately, this list is empty';

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})

export class ItemsTableComponent implements OnInit {
  public fileList$: Observable<Certificate[]>;
  private headerText: string = HEADER_TEXT;
  private emptyListOfCertificates: string = EMPTY_LIST;

  constructor(private dialog: MatDialog,
              private certificateService: CertificateService,
              private store: Store<AppState>) {
    this.fileList$ = this.store.select(state => state.certificates);
  }

  ngOnInit(): void {
    this.certificateService.getListFromStorage();
  }

  showCurrentCertificateInfo(certificate: string): void {
    this.openDialog(certificate, this.getCertificateInfo(certificate));
  }

  getCertificateInfo(certificate: string): Certificate {
    const currentCertificate = this.mapKeyValueFromStorage(certificate);
    const arrayBuffer = CertificateService.base64ToArrayBuffer(currentCertificate);

    return {
      text: certificate,
      data: CertificateService.decodingCertificate(arrayBuffer)
    };
  }

  mapKeyValueFromStorage(certificate: string) {
    return this.certificateService.getCertificateByName(certificate);
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
    this.dialog.open<CommonModalComponent, DialogData, void>(CommonModalComponent, config);
  }
}
