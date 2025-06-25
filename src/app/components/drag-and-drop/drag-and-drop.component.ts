import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { TitleCasePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import {
  Component,
  inject,
  input,
  output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-drag-and-drop',
  imports: [TitleCasePipe, CdkDrag, MatButtonModule, MatIconModule],
  templateUrl: './drag-and-drop.component.html',
})
export class DragAndDropComponent {
  title = input('');

  private readonly _overlay = inject(Overlay);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  @ViewChild(TemplateRef) _dialogTemplate: TemplateRef<any>;
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;

  closedDialog = output<void>();

  ngAfterViewInit() {
    this._portal = new TemplatePortal(
      this._dialogTemplate,
      this._viewContainerRef
    );
    this._overlayRef = this._overlay.create({
      positionStrategy: this._overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
    });
    this._overlayRef.backdropClick().subscribe(() => this._overlayRef.detach());
  }

  ngOnDestroy() {
    this._overlayRef.dispose();
  }

  openDialog() {
    this._overlayRef.attach(this._portal);
  }

  closeDialog() {
    this.closedDialog.emit();
  }
}
