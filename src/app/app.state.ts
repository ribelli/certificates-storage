import {Certificate} from 'pkijs';

export interface AppState {
  readonly certificates: Certificate[];
}
