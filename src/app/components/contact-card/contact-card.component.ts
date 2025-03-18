import { Component } from '@angular/core';
import { MovableCardComponent } from '../movable-card/movable-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-card',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.less'
})
export class ContactCardComponent {
  public isVisibleInformacionPersonal = false;
  public isVisibleInformacionEmployment = false;

  showInformationPersonal(): void {
    this.isVisibleInformacionPersonal = this.isVisibleInformacionPersonal ? false : true;
  }

  showInformationEmployment(): void {
    this.isVisibleInformacionEmployment = this.isVisibleInformacionEmployment ? false : true;
  }

  get displayIconPersonal() {
    return this.isVisibleInformacionPersonal ? 'display_gray_down.svg' : 'display_gray_up.svg';
  }

  get displayIconEmployment() {
    return this.isVisibleInformacionEmployment ? 'display_gray_down.svg' : 'display_gray_up.svg';
  }
}
