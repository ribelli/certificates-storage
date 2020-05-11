import { Component } from '@angular/core';
import {CertificateService} from '../../services/certificate.service';
//import {CommonModal} from '../common-modal/common-modal.component';
import {MatDialog} from '@angular/material';

const UPLOAD_TEXT = 'Drop or upload your certificate here to send them';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})

export class FileUploaderComponent {
    private uploadText: string = UPLOAD_TEXT;
    private file: any;
    private fileName: string;
    private files: any = [];

    constructor(public dialog: MatDialog, private certificateService: CertificateService) { }

    fileChanged(event): void {
      if (event.target.files && event.target.files.length) {
          this.fileName = event.target.files[0].name;
          const [file] = event.target.files;
          this.file = event.target.files[0];
          this.handleFileBrowse(file);
      }
    }

    handleFileBrowse(file: File): void {
        const tempReader = new FileReader();
        if (localStorage.getItem(file.name) === null) {
            tempReader.onload = (event) => {
                event.preventDefault();
                this.addToStorage(tempReader.result);
            };
            tempReader.readAsDataURL(file);
        } else {
            this.openDialog();
        }
    }

    addToStorage(file): void {
      this.certificateService.upload(this.file.name, file);
    }

    openDialog(): void {
      alert('This file is exist');
        // this.dialog.open(CommonModal, {
        //     width: '250px',
        //     data: {
        //       generalInfo: {
        //       info: 'This file is exist' }
        //     }
        // });
    }
}
