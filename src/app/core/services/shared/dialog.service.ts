import { Injectable, createComponent, ApplicationRef, ComponentRef } from '@angular/core';
import { GenericDialogComponent } from '../../../components/shared/generic-dialog/generic-dialog.component';
import { DialogConfig } from '../../../interfaces/dialog-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public activeDialog$ = new BehaviorSubject<ComponentRef<GenericDialogComponent> | null>(null);
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
      const dataSubject = new BehaviorSubject(config.data);
      dialogComponentRef.instance.loadContentComponent(config.component, dataSubject);
    } 

    this.dialogComponentRefs?.push(dialogComponentRef);
    this.activeDialog$.next(dialogComponentRef);
    return dialogComponentRef;
  }

  close(dialogRef: ComponentRef<any>) {
    const index = this.dialogComponentRefs.indexOf(dialogRef);
    if (index !== -1) {
      this.appRef.detachView(dialogRef.hostView);
      dialogRef.destroy();
      this.dialogComponentRefs.splice(index, 1);

      if (this.dialogComponentRefs.length === 0) {
        this.activeDialog$.next(null);
      } else {
        this.activeDialog$.next(this.dialogComponentRefs[0]);
      }
    }
  }

  closeAll() {
    this.dialogComponentRefs?.forEach(dialogRef => {
      this.appRef.detachView(dialogRef.hostView);
      dialogRef.destroy();
    });
    this.dialogComponentRefs = [];
    this.activeDialog$.next(null);
  }
}
