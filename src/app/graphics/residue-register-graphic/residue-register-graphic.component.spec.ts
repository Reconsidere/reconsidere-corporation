import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueRegisterGraphicComponent } from './residue-register-graphic.component';

describe('ResidueRegisterGraphicComponent', () => {
  let component: ResidueRegisterGraphicComponent;
  let fixture: ComponentFixture<ResidueRegisterGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidueRegisterGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueRegisterGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
