import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

import {RowTableComponent} from './row-table.component';

@Component({
  template: `<app-row-table [item]="'cert.cer'" (click)="rowClicked = true" (elementDeleted)="deleted = true"></app-row-table>`,
})
class HostComponent {
  rowClicked = false;
  deleted = false;
}

describe('RowTableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [HostComponent, RowTableComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('emits elementDeleted without triggering the row click', () => {
    fixture.debugElement.query(By.css('.c-row__button')).nativeElement.click();

    expect(fixture.componentInstance.deleted).toBeTrue();
    expect(fixture.componentInstance.rowClicked).toBeFalse();
  });
});
