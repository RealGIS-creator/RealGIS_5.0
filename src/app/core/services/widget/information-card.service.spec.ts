import { TestBed } from '@angular/core/testing';

import { InformationCardService } from './information-card.service';

describe('InformationCardService', () => {
  let service: InformationCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
