import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

import {CommonModal} from './common-modal/common-modal.component';
import {ItemsTableComponent} from './items-table/items-table.component';
import {FileUploaderComponent} from './file-uploader/file-uploader.component';
import {RowTableComponent} from './items-table/table-row/row-table.component';

import {DragAndDropDirective} from '../directives/drag-and-drop/drag-and-drop.directive';


export const COMPONENTS = [
  CommonModal,
  ItemsTableComponent,
  FileUploaderComponent,
  RowTableComponent,
];

@NgModule({
  declarations: [
    COMPONENTS,
    DragAndDropDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    COMPONENTS,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [CommonModal],
})

export class CSAComponentsModule { }
