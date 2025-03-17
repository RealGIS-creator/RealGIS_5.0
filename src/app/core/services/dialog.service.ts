import { Injectable, createComponent, ApplicationRef, ComponentRef } from '@angular/core';
import { GenericDialogComponent } from '../../components/generic-dialog/generic-dialog.component';

interface DialogConfig {
  component: any; 
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogComponentRef: ComponentRef<GenericDialogComponent> | null = null;

  constructor(private appRef: ApplicationRef) {}

  open(config: DialogConfig): ComponentRef<any> | null {
    if (!this.dialogComponentRef) {
      this.dialogComponentRef = createComponent(GenericDialogComponent, {
        environmentInjector: this.appRef.injector,
      });
      document.body.appendChild(this.dialogComponentRef.location.nativeElement);
      this.appRef.attachView(this.dialogComponentRef.hostView);

      this.dialogComponentRef.instance.setCloseCallback(() => {
        this.close();
      });
    }

    return this.dialogComponentRef.instance.loadContentComponent(config.component, config.data);
  }

  close() {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }
}