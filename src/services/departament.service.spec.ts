import { TestBed } from '@angular/core/testing';

import { DepartamentService } from './departament.service';

describe('DepartamentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepartamentService = TestBed.get(DepartamentService);
    expect(service).toBeTruthy();
  });
});
