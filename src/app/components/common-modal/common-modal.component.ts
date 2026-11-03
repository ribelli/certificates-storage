import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {CertificateInfo} from '@services/certificate-parser';

export interface DialogData {
  name: string;
  info: CertificateInfo;
}

@Component({
  selector: 'app-common-modal',
  templateUrl: 'common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})
export class CommonModalComponent {
  constructor(public dialogRef: MatDialogRef<CommonModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onOKClick(): void {
    this.dialogRef.close();
  }
}
