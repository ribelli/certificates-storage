import {Certificate} from 'pkijs';
import {CertificateActionTypes, CertificateActions} from './actions';

export let initialState: Certificate = [];

export function certificateReducer(state= initialState, action: CertificateActions) {
  switch (action.type) {
    case CertificateActionTypes.ADD_CERTIFICATE:
      return [...state, action.payload];

    case CertificateActionTypes.REMOVE_CERTIFICATE:
      const index = state.findIndex(name => name === action.payload);
      return [...state.slice(0, index), ...state.slice(index + 1)];

    default:
      return state;
  }
}
