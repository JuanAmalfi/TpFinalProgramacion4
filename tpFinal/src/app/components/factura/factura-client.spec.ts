import { TestBed } from '@angular/core/testing';

import { FacturaClient } from './factura-client';

describe('FacturaClient', () => {
  let service: FacturaClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
