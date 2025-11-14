import { TestBed } from '@angular/core/testing';

import { LibroClient } from './libro-client';

describe('LibroClient', () => {
  let service: LibroClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
