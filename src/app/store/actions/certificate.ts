import { Action } from '@ngrx/store';

export enum CertificateActionTypes {
  certificateAdd = '[Certificate] add',
  certificateRemove = '[Certificate] remove'
}

export class AddCertificate implements Action {
  readonly type = CertificateActionTypes.certificateAdd;
  constructor(public payload: string) {}
}

export class RemoveCertificate implements Action {
  readonly type = CertificateActionTypes.certificateRemove;
  constructor(public payload: string) {}
}

export type CertificateActions = AddCertificate | RemoveCertificate;
