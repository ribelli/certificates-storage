import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICertificate } from '../../../store/models/certificate';
import {
    trigger,
    style,
    animate,
    transition
} from '@angular/animations';

@Component({
  selector: 'app-row-table',
  templateUrl: './row-table.component.html',
  styleUrls: ['./row-table.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-40%)'}),
        animate('250ms ease-in-out', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('400ms ease-in-out', style({transform: 'translateY(-50%)'}))
      ])
    ])
  ]
})

export class RowTableComponent {
    @Input() public item: ICertificate;
    @Output() public elementDeleted: EventEmitter<void> = new EventEmitter();

    private deleteElement(): void {
        this.elementDeleted.emit();
    }
}

