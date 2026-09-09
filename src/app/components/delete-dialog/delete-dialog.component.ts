import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DragAndDropComponent } from '../drag-and-drop/drag-and-drop.component';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [DragAndDropComponent],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.scss',
})
export class DeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteDialogComponent>);

  close(confirmed = false): void {
    this.dialogRef.close(confirmed);
  }
}
