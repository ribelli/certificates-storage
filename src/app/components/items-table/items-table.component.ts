import {Component, OnInit} from '@angular/core';
import {Certificate} from 'pkijs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CommonModal, DialogData} from '../common-modal/common-modal.component';
import {Observable} from 'rxjs';
import {CertificateService} from '../../services/certificate.service';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';


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
  public fileList$: Observable<Certificate[]>;

  constructor (
    private dialog: MatDialog,
    private certificateService: CertificateService,
    private store: Store<AppState>
  ) {
    this.fileList$ = this.store.select(state => state.certificates);
  }

  ngOnInit(): void {
    this.certificateService.getListFromStorage();
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
    this.dialog.open<CommonModal, DialogData, void>(CommonModal, config);
  }
}
