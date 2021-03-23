import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {MatButtonModule} from '@angular/material/button';

import {AppRoutingModule} from './app-routing.module';
import {certificateReducer} from './store/reducer';

import {AppComponent} from './components/app/app.component';
import {CSAComponentsModule} from './components/components.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CSAComponentsModule,
    MatButtonModule,
    StoreModule.forRoot({certificates: certificateReducer})
  ],
  exports: [
    AppComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
