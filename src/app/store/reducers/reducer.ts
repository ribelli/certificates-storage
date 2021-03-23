import {Certificate} from 'pkijs';
import {CertificateActionTypes, CertificateActions} from '../actions/certificate';

export const initialState: Certificate = [];

export const certificateReducer = (state = initialState, action: CertificateActions) => {
  switch (action.type) {
    case CertificateActionTypes.certificateAdd:
      return [...state, action.payload];

    case CertificateActionTypes.certificateRemove:
      const index = state.findIndex(name => name === action.payload);
      return [...state.slice(0, index), ...state.slice(index + 1)];

    default:
      return state;
  }
};
