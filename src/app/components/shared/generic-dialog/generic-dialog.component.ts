import { Component, Input, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-generic-dialog',
  imports: [],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericDialogComponent {
  @ViewChild('contentContainer', { read: ViewContainerRef, static: true }) contentContainer!: ViewContainerRef;
  componentRef: ComponentRef<any> | null = null;
  closeCallback: (() => void) | null = null;

  loadContentComponent(component: any, data?: any): ComponentRef<any> {
    this.contentContainer.clear();
    this.componentRef = this.contentContainer.createComponent(component);
    if (data) {
      const dataObj = typeof data === 'object' ? data : { data };
      console.log(typeof data === 'object' ? 'es object' : 'no es object');
      Object.assign(this.componentRef.instance, dataObj);
      console.log('data dialogo: ', dataObj);
    }
    return this.componentRef;
  }

  setCloseCallback(callback: () => void) {
    this.closeCallback = callback;
  }

  close() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    if (this.closeCallback) {
      this.closeCallback();
      this.closeCallback = null;
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
