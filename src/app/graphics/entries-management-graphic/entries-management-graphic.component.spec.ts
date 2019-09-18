import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesManagementGraphicComponent } from './entries-management-graphic.component';

describe('EntriesManagementGraphicComponent', () => {
  let component: EntriesManagementGraphicComponent;
  let fixture: ComponentFixture<EntriesManagementGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesManagementGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesManagementGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
