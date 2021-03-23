import { Action } from '@ngrx/store';

export enum CertificateActionTypes {
  ADD_CERTIFICATE = 'ADD_CERTIFICATE',
  REMOVE_CERTIFICATE = 'REMOVE_CERTIFICATE'
}

export class AddCertificate implements Action {
  readonly type = CertificateActionTypes.ADD_CERTIFICATE;
  constructor(public payload: string) {}
}

export class RemoveCertificate implements Action {
  readonly type = CertificateActionTypes.REMOVE_CERTIFICATE;
  constructor(public payload: string) {}
}

export type CertificateActions = AddCertificate | RemoveCertificate;
