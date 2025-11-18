import { TestBed } from '@angular/core/testing';

import { ReseniaClient } from './resenia-client';

describe('ReseniaClient', () => {
  let service: ReseniaClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReseniaClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
