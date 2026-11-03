import {CertificateActionTypes, CertificateActions} from '@store/actions/certificate.actions';

export const initialState: string[] = [];

export const certificateReducer = (state: string[] = initialState, action: CertificateActions): string[] => {
  switch (action.type) {
    case CertificateActionTypes.certificateAdd:
      return state.includes(action.payload) ? state : [...state, action.payload];

    case CertificateActionTypes.certificateRemove:
      return state.filter(name => name !== action.payload);

    default:
      return state;
  }
};
