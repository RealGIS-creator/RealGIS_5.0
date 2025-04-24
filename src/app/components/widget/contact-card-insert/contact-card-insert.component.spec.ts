import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCardInsertComponent } from './contact-card-insert.component';

describe('ContactCardInsertComponent', () => {
  let component: ContactCardInsertComponent;
  let fixture: ComponentFixture<ContactCardInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactCardInsertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactCardInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
