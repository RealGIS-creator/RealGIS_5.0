import { TestBed } from '@angular/core/testing';

import { GeoServerService } from './geo-server.service';

describe('GeoServerService', () => {
  let service: GeoServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
