import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCardAdminComponent } from './contact-card-admin.component';

describe('ContactCardAdminComponent', () => {
  let component: ContactCardAdminComponent;
  let fixture: ComponentFixture<ContactCardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactCardAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactCardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
