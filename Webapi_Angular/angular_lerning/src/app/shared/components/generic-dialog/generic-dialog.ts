import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, Inject, inject, Injector, Type } from '@angular/core';
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
  injector: Injector;

  constructor(
    private dialogRef: MatDialogRef<GenericDialog>,
    parentInjector: Injector,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.componentType = data.component;
    this.injector = Injector.create({
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null }
      ],
      parent: parentInjector
    });
  }
}
