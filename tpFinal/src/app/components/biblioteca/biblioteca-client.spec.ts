import { TestBed } from '@angular/core/testing';

import { BibliotecaClient } from './biblioteca-client';

describe('BibliotecaClient', () => {
  let service: BibliotecaClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliotecaClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
