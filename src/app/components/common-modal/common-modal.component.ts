import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


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
  private content = this.data.generalInfo.info.data;
  private notBefore = this.content.notBefore;
  private notAfter = this.content.notAfter;
  private issuer = this.content.issuer;
  private subject = this.content.subject;

  constructor (
    public dialogRef: MatDialogRef<CommonModal>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onOKClick(): void {
    this.dialogRef.close();
    console.log(this.data)
  }
}
