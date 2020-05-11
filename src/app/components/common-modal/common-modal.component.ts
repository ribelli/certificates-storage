import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
  generalInfo: {
    text: string,
    info: {
      text: string
      data: {
        notAfter: string,
        notBefore: string
        subject: any,
        issuer: any,
      }
    }
  }
}

@Component({
  selector: 'common-modal',
  templateUrl: 'common-modal.component.html',
  styleUrls: ['./common-modal.component.scss']
})

export class CommonModal {

  constructor (
    public dialogRef: MatDialogRef<CommonModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onOKClick(): void {
    this.dialogRef.close();
  }

}
