import { TestBed, inject } from '@angular/core/testing';

import { FirestoreDaoService } from './firestore-dao.service';

describe('FirestoreDaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreDaoService]
    });
  });

  it('should be created', inject([FirestoreDaoService], (service: FirestoreDaoService) => {
    expect(service).toBeTruthy();
  }));
});
