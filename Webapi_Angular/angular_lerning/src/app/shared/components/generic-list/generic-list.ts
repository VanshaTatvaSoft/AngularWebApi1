import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Injector, input, Input, OnInit, SimpleChanges, Type, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GenericDialog } from '../generic-dialog/generic-dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-generic-list',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, MatSortModule, MatButtonModule, MatDividerModule, MatIconModule, MatDialogModule],
  templateUrl: './generic-list.html',
  styleUrl: './generic-list.css'
})
export class GenericList {
  @Input() title: string = '';
  @Input() addBtn: string = '';
  @Input() data: any[] = [];
  @Input() columns: { key: string; header: string }[] = [];
  @Input() addComponent!: Type<any>;

  constructor(private dialog: MatDialog, private injector: Injector) {}

  dataSource = new MatTableDataSource<any>();
  pageSize: number = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.dataSource = new MatTableDataSource(this.data);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  get displayedColumns(): string[] {
    return [...this.columns.map(c => c.key), 'actions'];
  }

  openAddDialog(): void{
    const dialogRef = this.dialog.open(GenericDialog,{
      width: '500px',
      data: {
        component: this.addComponent
      }
    });

    dialogRef.afterClosed().subscribe((shouldRefresh: boolean) => {
      if (shouldRefresh) {
        location.reload();
      }
    });

  }

}
