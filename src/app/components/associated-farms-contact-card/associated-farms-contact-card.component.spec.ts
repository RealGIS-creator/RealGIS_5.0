import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedFarmsContactCardComponent } from './associated-farms-contact-card.component';

describe('AssociatedFarmsContactCardComponent', () => {
  let component: AssociatedFarmsContactCardComponent;
  let fixture: ComponentFixture<AssociatedFarmsContactCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociatedFarmsContactCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociatedFarmsContactCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
