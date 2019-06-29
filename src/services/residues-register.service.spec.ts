import { TestBed } from '@angular/core/testing';

import { ResiduesRegisterService } from './residues-register.service';

describe('ResiduesRegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResiduesRegisterService = TestBed.get(ResiduesRegisterService);
    expect(service).toBeTruthy();
  });
});
