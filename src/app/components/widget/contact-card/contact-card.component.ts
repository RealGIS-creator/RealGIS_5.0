import { ChangeDetectorRef, Component, ComponentRef, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssociatedFarmsContactCardComponent } from '../associated-farms-contact-card/associated-farms-contact-card.component';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { PdfContactCardService } from '../../../core/services/widget/pdf-contact-card.service';
import { InformationCard } from '../../../interfaces/information-card';
import { InformationCardService } from '../../../core/services/widget/information-card.service';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from '../../../core/services/home/map/location.service';
import { ContactCardAdminComponent } from '../contact-card-admin/contact-card-admin.component';

@Component({
  selector: 'app-contact-card',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.less',
})
export class ContactCardComponent {
  isVisibleInformacionPersonal = false;
  isVisibleInformacionEmployment = false;
  isVisibleFarmsContactCard = false;
  infoUserCard!: InformationCard;
  
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @Input() data$: BehaviorSubject<any> = new BehaviorSubject(null);
  data: any;

  dialogRef!: ComponentRef<any>;

  private dialogService = inject(DialogService);
  private sidebarShowDataService = inject(SidebarShowDataService);
  private pdfContactCardService = inject(PdfContactCardService);

  constructor(
    private informationCardService: InformationCardService, 
    private cdRef: ChangeDetectorRef,
    private locationService: LocationService
  )
  {
  }

  ngOnInit(): void {
    this.data = this.data$.value._value;
    this.getInformationCard();
  }

  selectAddress() {
    const selectedPoint = {
      address: this.infoUserCard.Direccion_Id,
      longitude: this.infoUserCard.GeoDomicilioLongi,
      latitude: this.infoUserCard.GeoDomicilioLati
    };
    this.locationService.updatePointData(selectedPoint);
  }

  private getInformationCard(): void {
    this.informationCardService.getInformacionCard(this.data.filterName + 'F', this.data.filterValue, this.data.idAdress).subscribe((response) =>{
      if (response && response.SDT_TarjetaContacto && response.SDT_TarjetaContacto.length) {
        this.infoUserCard = response.SDT_TarjetaContacto[0];
        this.cdRef.detectChanges();
        this.selectAddress()
      } else {
        console.error('No se encontraron datos en la respuesta');
      }
    });
  }

  showInformationPersonal(): void {
    this.isVisibleInformacionPersonal = this.isVisibleInformacionPersonal
      ? false
      : true;
  }

  showInformationEmployment(): void {
    this.isVisibleInformacionEmployment = this.isVisibleInformacionEmployment
      ? false
      : true;
  }

  get displayIconPersonal() {
    return this.isVisibleInformacionPersonal
      ? 'display_gray_down.svg'
      : 'display_gray_up.svg';
  }

  get displayIconEmployment() {
    return this.isVisibleInformacionEmployment
      ? 'display_gray_down.svg'
      : 'display_gray_up.svg';
  }

  openAssociatedFarmsContactCard(): void {
    this.isVisibleFarmsContactCard = !this.isVisibleFarmsContactCard;

    if (this.isVisibleFarmsContactCard) {
      this.dialogRef = this.dialogService.open({ component: AssociatedFarmsContactCardComponent, data: this.infoUserCard.Fincas});

    } else {
      this.dialogService.close(this.dialogRef);
    }
  }

  close(): void {
    this.dialogService.closeAll();
    this.sidebarShowDataService.setData({ activeIndex: 0 });
  }

  minimize(): void {
    this.isVisibleInformacionPersonal = false;
    this.isVisibleInformacionEmployment = false;
  }

  download(): void {
    this.pdfContactCardService.download(this.infoUserCard);
  }

  updateContactCard(): void {
    this.dialogService.closeAll();
    // this.close();
    this.dialogRef = this.dialogService.open({ component: ContactCardAdminComponent, data: JSON.parse(JSON.stringify(this.infoUserCard))});
  }
}
