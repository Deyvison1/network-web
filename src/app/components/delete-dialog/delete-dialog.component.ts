import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DragAndDropComponent } from '../drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [DragAndDropComponent],
  templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent {
  private readonly matDialog = inject(MatDialogRef);
  cancel(isDelete?: boolean) {
    this.matDialog.close(isDelete);
  }
}
