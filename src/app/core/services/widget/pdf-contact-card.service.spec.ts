import { TestBed } from '@angular/core/testing';

import { PdfContactCardService } from './pdf-contact-card.service';

describe('PdfContactCardService', () => {
  let service: PdfContactCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfContactCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
