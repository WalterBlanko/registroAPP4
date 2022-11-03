import { TestBed } from '@angular/core/testing';

import { ApiDuocService } from './api-duoc.service';

describe('ApiDuocService', () => {
  let service: ApiDuocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDuocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
