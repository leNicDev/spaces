import { TestBed } from '@angular/core/testing';

import { HasSpaceGuard } from './has-space.guard';

describe('HasSpaceGuard', () => {
  let guard: HasSpaceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasSpaceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
