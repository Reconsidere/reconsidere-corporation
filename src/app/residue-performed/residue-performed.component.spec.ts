import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiduePerformedComponent } from './residue-performed.component';

describe('ResiduePerformedComponent', () => {
  let component: ResiduePerformedComponent;
  let fixture: ComponentFixture<ResiduePerformedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiduePerformedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiduePerformedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
