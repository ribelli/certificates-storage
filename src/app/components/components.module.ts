import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ItemsTableComponent} from './items-table/items-table.component';
import {RowTableComponent} from './items-table/table-row/row-table.component';
import {FileUploaderComponent} from './file-uploader/file-uploader.component';
import {DragAndDropDirective} from '../directives/drag-and-drop/drag-and-drop.directive';
import {CommonModal} from './common-modal/common-modal.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';


@NgModule({
  declarations: [
    ItemsTableComponent,
    RowTableComponent,
    FileUploaderComponent,
    DragAndDropDirective,
    CommonModal
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  exports: [
    ItemsTableComponent,
    RowTableComponent,
    FileUploaderComponent,
    CommonModal
  ],
  entryComponents: [CommonModal],
  providers: [],
  bootstrap: []
})

export class CSAComponentsModule {
}
