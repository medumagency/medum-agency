import { TestBed, inject } from '@angular/core/testing';

import { CompanyEmailService } from './company-email.service';

describe('CompanyEmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyEmailService]
    });
  });

  it('should be created', inject([CompanyEmailService], (service: CompanyEmailService) => {
    expect(service).toBeTruthy();
  }));
});
