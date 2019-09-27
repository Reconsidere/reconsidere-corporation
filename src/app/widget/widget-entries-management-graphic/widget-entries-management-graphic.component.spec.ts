import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetEntriesManagementGraphicComponent } from './widget-entries-management-graphic.component';

describe('WidgetEntriesManagementGraphicComponent', () => {
  let component: WidgetEntriesManagementGraphicComponent;
  let fixture: ComponentFixture<WidgetEntriesManagementGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetEntriesManagementGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetEntriesManagementGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
