import { TestBed } from '@angular/core/testing';

import { CarritoClient } from './carrito-client';

describe('CarritoClient', () => {
  let service: CarritoClient;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarritoClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
