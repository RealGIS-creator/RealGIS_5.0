import { Component, Input } from '@angular/core';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-associated-farms-contact-card',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './associated-farms-contact-card.component.html',
  styleUrl: './associated-farms-contact-card.component.less'
})
export class AssociatedFarmsContactCardComponent {

  @Input() data$: BehaviorSubject<any> = new BehaviorSubject(null);
  data: any;

  ngOnInit(): void {
    this.data = this.data$.value._value;
  }

}
