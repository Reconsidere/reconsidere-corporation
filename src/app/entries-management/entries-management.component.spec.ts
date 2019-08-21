import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesManagementComponent } from './entries-management.component';

describe('EntriesManagementComponent', () => {
  let component: EntriesManagementComponent;
  let fixture: ComponentFixture<EntriesManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntriesManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
