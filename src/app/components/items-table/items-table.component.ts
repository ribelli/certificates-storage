import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {AppState} from '@app/app.state';
import {CommonModalComponent, DialogData} from '../common-modal/common-modal.component';
import {CertificateService} from '@services/certificate.service';
import {CertificateError} from '@services/certificate-parser';

const HEADER_TEXT = 'Existing certificates:';
const EMPTY_LIST = 'Unfortunately, this list is empty';
const SNACKBAR_DURATION_MS = 5000;

@Component({
  selector: 'app-items-table',
  templateUrl: './items-table.component.html',
  styleUrls: ['./items-table.component.scss']
})
export class ItemsTableComponent implements OnInit {
  public fileList$: Observable<string[]>;
  public headerText: string = HEADER_TEXT;
  public emptyListOfCertificates: string = EMPTY_LIST;

  constructor(private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private certificateService: CertificateService,
              private store: Store<AppState>) {
    this.fileList$ = this.store.select(state => state.certificates);
  }

  ngOnInit(): void {
    this.certificateService.loadFromStorage();
  }

  showCurrentCertificateInfo(name: string): void {
    let data: DialogData;
    try {
      data = {name, info: this.certificateService.getCertificateInfo(name)};
    } catch (error) {
      const message = error instanceof CertificateError ? error.message : 'unexpected error';
      this.snackBar.open(`${name}: ${message}`, 'OK', {duration: SNACKBAR_DURATION_MS});
      return;
    }

    const config = new MatDialogConfig<DialogData>();
    config.width = '80vw';
    config.data = data;
    this.dialog.open<CommonModalComponent, DialogData, void>(CommonModalComponent, config);
  }

  onElementDeleted(name: string): void {
    this.certificateService.removeCertificate(name);
  }
}
