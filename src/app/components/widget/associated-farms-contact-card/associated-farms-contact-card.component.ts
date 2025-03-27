import { Component, Input, SimpleChanges } from '@angular/core';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { InformationCard } from '../../../interfaces/information-card';

@Component({
  selector: 'app-associated-farms-contact-card',
  imports: [MovableCardComponent],
  templateUrl: './associated-farms-contact-card.component.html',
  styleUrl: './associated-farms-contact-card.component.less'
})
export class AssociatedFarmsContactCardComponent {

  @Input() data!: InformationCard;

  constructor() {
    console.log('Constructor, data:', this.data); 
  }

  ngOnInit(): void {
    console.log('ngOnInit, data:', this.data); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('ngOnChanges, data:', changes['data'].currentValue);
    }
  }

}
