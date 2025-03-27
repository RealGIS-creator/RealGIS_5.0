import { Injectable, createComponent, ApplicationRef, ComponentRef } from '@angular/core';
import { GenericDialogComponent } from '../../../components/shared/generic-dialog/generic-dialog.component';
import { DialogConfig } from '../../../interfaces/dialog-config';


@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogComponentRefs: ComponentRef<GenericDialogComponent>[] = [];

  constructor(private appRef: ApplicationRef) { }

  open(config: DialogConfig): ComponentRef<any> {
    const dialogComponentRef = createComponent(GenericDialogComponent, {
      environmentInjector: this.appRef.injector,
    });

    document.body.appendChild(dialogComponentRef.location.nativeElement);
    this.appRef.attachView(dialogComponentRef.hostView);

    dialogComponentRef.instance.setCloseCallback(() => {
      this.close(dialogComponentRef);
    });

    if (config.component) {
      dialogComponentRef.instance.loadContentComponent(config.component, config.data);
    }

    this.dialogComponentRefs?.push(dialogComponentRef);

    return dialogComponentRef;
  }

  close(dialogRef: ComponentRef<any>) {
    const index = this.dialogComponentRefs.indexOf(dialogRef);
    if (index !== -1) {
      this.appRef.detachView(dialogRef.hostView);
      dialogRef.destroy();
      this.dialogComponentRefs.splice(index, 1);
    }
  }

  closeAll() {
    this.dialogComponentRefs?.forEach(dialogRef => {
      this.appRef.detachView(dialogRef.hostView);
      dialogRef.destroy();
    });
    this.dialogComponentRefs = [];
  }
}
