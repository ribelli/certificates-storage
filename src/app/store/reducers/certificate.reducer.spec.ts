import {certificateReducer} from './certificate.reducer';
import {AddCertificate, RemoveCertificate} from '@store/actions/certificate.actions';

describe('certificateReducer', () => {
  it('adds a certificate name', () => {
    expect(certificateReducer([], new AddCertificate('a.cer'))).toEqual(['a.cer']);
  });

  it('does not add the same name twice', () => {
    expect(certificateReducer(['a.cer'], new AddCertificate('a.cer'))).toEqual(['a.cer']);
  });

  it('removes a certificate name', () => {
    expect(certificateReducer(['a.cer', 'b.cer'], new RemoveCertificate('a.cer'))).toEqual(['b.cer']);
  });

  it('keeps the state unchanged when removing an unknown name', () => {
    expect(certificateReducer(['a.cer', 'b.cer'], new RemoveCertificate('x.cer'))).toEqual(['a.cer', 'b.cer']);
  });
});
