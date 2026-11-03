import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

import {CertificateService} from '@services/certificate.service';
import {CertificateError} from '@services/certificate-parser';

const UPLOAD_TEXT = 'Drop or upload your certificate here to send them';
const SNACKBAR_DURATION_MS = 5000;

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
    uploadText: string = UPLOAD_TEXT;

    constructor(private certificateService: CertificateService,
                private snackBar: MatSnackBar) { }

    onFileSelected(input: HTMLInputElement): void {
        if (input.files && input.files.length) {
            this.handleFile(input.files[0]);
        }
        input.value = '';
    }

    onFilesDropped(files: FileList): void {
        this.handleFile(files[0]);
    }

    private handleFile(file: File): void {
        if (this.certificateService.hasCertificate(file.name)) {
            this.showMessage(`Certificate "${file.name}" already exists`);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => this.addCertificate(file.name, reader.result as ArrayBuffer);
        reader.onerror = () => this.showMessage(`Could not read "${file.name}"`);
        reader.readAsArrayBuffer(file);
    }

    private addCertificate(name: string, content: ArrayBuffer): void {
        try {
            this.certificateService.addCertificate(name, content);
        } catch (error) {
            this.showMessage(error instanceof CertificateError
                ? `${name}: ${error.message}`
                : `${name}: unexpected error`);
        }
    }

    private showMessage(message: string): void {
        this.snackBar.open(message, 'OK', {duration: SNACKBAR_DURATION_MS});
    }
}
