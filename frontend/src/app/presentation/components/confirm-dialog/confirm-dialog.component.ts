import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogClose } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogClose],
  templateUrl: './confirm-dialog.component.html',
  styles: []
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}