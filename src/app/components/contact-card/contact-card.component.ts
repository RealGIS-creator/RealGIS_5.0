import { Component, ComponentRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../core/services/dialog.service';
import { AssociatedFarmsContactCardComponent } from '../associated-farms-contact-card/associated-farms-contact-card.component';
import { MovableCardComponent } from '../shared/movable-card/movable-card.component';
import { SidebarShowDataService } from '../../core/services/sidebar-show-data.service';

@Component({
  selector: 'app-contact-card',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.less'
})
export class ContactCardComponent {
  public isVisibleInformacionPersonal = false;
  public isVisibleInformacionEmployment = false;
  public isVisibleFarmsContactCard = false;

  dialogRef!: ComponentRef<any>;

  private dialogService = inject(DialogService);
  private sidebarShowDataService = inject(SidebarShowDataService);

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

  openAssociatedFarmsContactCard(): void {
    this.isVisibleFarmsContactCard = !this.isVisibleFarmsContactCard;

    const config = {
      component: AssociatedFarmsContactCardComponent
    };

    if(this.isVisibleFarmsContactCard) {
      this.dialogRef = this.dialogService.open(config)
    } else {
      this.dialogService.close(this.dialogRef)
    }
  }

  close(): void {
    this.dialogService.closeAll();
    this.sidebarShowDataService.setData({activeIndex: 0})
    
  }

  minimize(): void {
    this.isVisibleInformacionPersonal = false;
    this.isVisibleInformacionEmployment = false;
  }

  download(): void {
    
  }
}
