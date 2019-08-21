import { TestBed } from '@angular/core/testing';

import { EntriesManagementService } from './entries-management.service';

describe('EntriesManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntriesManagementService = TestBed.get(EntriesManagementService);
    expect(service).toBeTruthy();
  });
});
