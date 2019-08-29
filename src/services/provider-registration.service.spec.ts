import { TestBed } from '@angular/core/testing';

import { ProviderRegistrationService } from './provider-registration.service';

describe('ProviderRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProviderRegistrationService = TestBed.get(ProviderRegistrationService);
    expect(service).toBeTruthy();
  });
});
