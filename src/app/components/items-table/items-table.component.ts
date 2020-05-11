import { Component, OnInit, ViewChild } from '@angular/core';
import { RowTableComponent } from './table-row/row-table.component';
import { Certificate } from 'pkijs';
import { MatDialog, MatPaginator } from '@angular/material';
import { CommonModal } from '../common-modal/common-modal.component';
import { Observable} from 'rxjs';
import { CertificateService } from '../../services/certificate.service';
import * as asn1js from 'asn1js';
import {CERTIFICATE_MAP} from '../../entities/certificate-map';


const HEADER_TEXT = 'Existing certificates:';
const EMPTY_LIST = 'Unfortunately, this list is empty';

@Component({
  selector: "app-items-table",
  templateUrl: "./items-table.component.html",
  styleUrls: ["./items-table.component.scss"],
})

export class ItemsTableComponent implements OnInit {
  @ViewChild(RowTableComponent) child: RowTableComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private headerText: string = HEADER_TEXT;
  private emptyListOfCertificates: string = EMPTY_LIST;
  private isEmptyList: boolean;
  private certificateMap: object = CERTIFICATE_MAP;
  public certificates = [];
  public fileList$: Observable<string[]> = this.certificateService.list();
  public fileList: string[] = [];

  constructor(
    public dialog: MatDialog,
    private certificateService: CertificateService
  ) {}

  ngOnInit() {
    this.fileList$.subscribe((fileList) => {
      this.fileList = fileList;
    });

    this.certificateService.get();
    this.isEmptyList = this.fileList.length === 0;
  }

  showCurrentCertificateInfo(certificate: string): void {
    let generalInfo = this.getCertificateInfo(certificate);
    this.openDialog(certificate, generalInfo);
  }

  getCertificateInfo(certificate) {
    let result = this.mapKeyValueFromStorage(certificate);
    let arrayBuffer = this.certificateService.base64ToArrayBuffer(result);

    return {
      text: certificate,
      data: this.decodingCertificate(arrayBuffer)
    };
  }

  mapKeyValueFromStorage(certificate: string) {
    return this.certificateService.getFromStorage(this.getKeyByValue(certificate));
  }

  getKeyByValue(value) {
    return Object.keys(localStorage).find(key => key === value);
  }

  decodingCertificate(element) {
    const asn1 = asn1js.fromBER(element);

    if (asn1.offset === (-1)) {
      console.log('Can not parse binary data');
    }

    const certificate = new Certificate({ schema: asn1.result });

    return {
      notBefore: CertificateService.trimUTCformat(certificate.notBefore),
      notAfter: CertificateService.trimUTCformat(certificate.notAfter),
      issuer: this.getGeneralInfo(certificate, 'issuer'),
      subject: this.getGeneralInfo(certificate, 'subject'),
    };
  }

    getGeneralInfo(certificate: Certificate, value: 'subject'| 'issuer') {
      let arr = [];
      for (const typeAndValue of certificate[value].typesAndValues) {
        let typeValue = this.certificateMap[typeAndValue.type];

        if(typeof typeValue === "undefined") {
          typeValue = typeAndValue.type;
        }

        const subjectValue = typeAndValue.value.valueBlock.value;

        arr.push({name: typeValue, value:subjectValue});
      }
      return arr;
    }

  onElementDeleted(certificate: any): void {
    if (!this.certificates) {
      return;
    }
    this.certificateService.remove(certificate);
  }

  openDialog(certificate: string, generalInfo: object): void {
    this.dialog.open(CommonModal, {
      width: "80vw",
      data: {
        text: certificate,
        generalInfo: {
          info: generalInfo
        }
      }
    });
  }
}
