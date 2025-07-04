import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './generic-dialog.html',
  styleUrls: ['./generic-dialog.css']
})
export class GenericDialog {
  componentType: Type<any>;
  injector: any;
  dialogRef = inject(MatDialogRef<GenericDialog>);

  constructor() {
    const data = inject(MAT_DIALOG_DATA);
    this.componentType = data.component;
    this.injector = data.injector;
  }
}
