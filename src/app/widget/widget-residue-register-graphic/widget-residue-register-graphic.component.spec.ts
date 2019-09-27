import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetResidueRegisterGraphicComponent } from './widget-residue-register-graphic.component';

describe('WidgetResidueRegisterGraphicComponent', () => {
  let component: WidgetResidueRegisterGraphicComponent;
  let fixture: ComponentFixture<WidgetResidueRegisterGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetResidueRegisterGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetResidueRegisterGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
