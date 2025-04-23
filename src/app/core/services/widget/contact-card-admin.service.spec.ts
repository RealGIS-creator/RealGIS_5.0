import { TestBed } from '@angular/core/testing';

import { ContactCardAdminService } from './contact-card-admin.service';

describe('ContactCardAdminService', () => {
  let service: ContactCardAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactCardAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
