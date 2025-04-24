import { TestBed } from '@angular/core/testing';

import { ContactCardInsertService } from './contact-card-insert.service';

describe('ContactCardInsertService', () => {
  let service: ContactCardInsertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactCardInsertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
