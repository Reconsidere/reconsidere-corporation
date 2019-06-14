import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartcenterComponent } from './startcenter.component';

describe('StartcenterComponent', () => {
  let component: StartcenterComponent;
  let fixture: ComponentFixture<StartcenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartcenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
