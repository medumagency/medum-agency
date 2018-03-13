import { TestBed, inject } from '@angular/core/testing';

import { SwalObjService } from './swal-obj.service';

describe('SwalObjService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SwalObjService]
    });
  });

  it('should be created', inject([SwalObjService], (service: SwalObjService) => {
    expect(service).toBeTruthy();
  }));
});
