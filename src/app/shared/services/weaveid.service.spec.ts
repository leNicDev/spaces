import { TestBed } from '@angular/core/testing';

import { WeaveidService } from './weaveid.service';

describe('WeaveidService', () => {
  let service: WeaveidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeaveidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
