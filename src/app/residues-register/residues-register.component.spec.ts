import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResiduesRegisterComponent } from './residues-register.component';

describe('ResiduesRegisterComponent', () => {
  let component: ResiduesRegisterComponent;
  let fixture: ComponentFixture<ResiduesRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiduesRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiduesRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
