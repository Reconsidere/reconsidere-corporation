import { TestBed } from '@angular/core/testing';

import { DocumentsManagementService } from './documents-management.service';

describe('DocumentsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentsManagementService = TestBed.get(DocumentsManagementService);
    expect(service).toBeTruthy();
  });
});
