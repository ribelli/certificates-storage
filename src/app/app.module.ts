import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CSAComponentsModule} from './components/components.module';
import {AppComponent} from './components/app.component';
import {AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CSAComponentsModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  exports: [
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
