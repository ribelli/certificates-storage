import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {StoreModule} from '@ngrx/store';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach( waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      declarations: [
        AppComponent
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
      });
  }));

  it('should create the app', waitForAsync(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
