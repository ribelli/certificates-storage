import { Directive, Output, EventEmitter, HostBinding, HostListener} from '@angular/core';

const BASIC_COLOR = 'rgba(231,233,255,0.98)';
const DRAG_COLOR = '#6a6bff';
const DROP_COLOR = '#f5fcff';
const BASIC_OPACITY = '1';

@Directive({
  selector: '[appDragAndDrop]'
})

export class DragAndDropDirective {
  @Output() onFileDropped = new EventEmitter<File>();
  @HostBinding('style.background-color') private background = BASIC_COLOR;
  @HostBinding('style.opacity') private opacity = BASIC_OPACITY;

  @HostListener('dragover', ['$event']) onDragOver(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = DRAG_COLOR;
    this.opacity = '0.8';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = DRAG_COLOR;
    this.opacity = BASIC_OPACITY;
  }

  @HostListener('drop', ['$event']) public ondrop(event): void {
    event.preventDefault();
    event.stopPropagation();
    this.background = DROP_COLOR;
    this.opacity = BASIC_OPACITY;
    let files = event.dataTransfer.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files);
    }
  }
}
