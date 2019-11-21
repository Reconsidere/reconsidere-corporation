import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueArrivedComponent } from './residue-arrived.component';

describe('ResidueArrivedComponent', () => {
  let component: ResidueArrivedComponent;
  let fixture: ComponentFixture<ResidueArrivedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidueArrivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueArrivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
