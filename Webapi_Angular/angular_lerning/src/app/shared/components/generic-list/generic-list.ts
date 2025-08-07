import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Injector,
  input,
  Input,
  OnInit,
  output,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GenericDialog } from '../generic-dialog/generic-dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GenericBtn } from '../generic-btn/generic-btn';
import {MatSliderModule} from '@angular/material/slider';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generic-list',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    GenericBtn,
    MatSliderModule,

  ],
  templateUrl: './generic-list.html',
  styleUrl: './generic-list.css',
})
export class GenericList {
  @Input() title: string = '';
  @Input() addBtn: string = '';
  @Input() data: any[] = [];
  @Input() columns: { key: string; header: string }[] = [];
  @Input() addComponent!: Type<any>;
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 5;
  @Input() pageNumber: number = 1;
  @Input() searchText: string = '';
  @Output() refresh = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() priceFilter = new EventEmitter<{ min: number; max: number }>();

  minPriceSearch: number = 0;
  maxPriceSearch: number = 0;
  minvalue: number = 0;
  maxvalue: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data && this.data.length > 0) {
      this.maxPriceSearch = this.data.reduce((max: number, item: any) => {
        const price = Number(item?.productprice) || 0;
        return price > max ? price : max;
      }, 0);
    }
    this.maxvalue = this.maxPriceSearch;
  }

  constructor(private dialog: MatDialog, private injector: Injector, private toast: ToastrService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get displayedColumns(): string[] {
    return [...this.columns.map((c) => c.key), 'actions'];
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(GenericDialog, {
      width: '500px',
      data: {
        component: this.addComponent,
      },
    });

    dialogRef.afterClosed().subscribe((shouldRefresh: boolean) => {
      if (shouldRefresh) {
        this.refresh.emit();
      }
    });
  }

  openEditDialog(row: any): void {
    const dialogRef = this.dialog.open(GenericDialog, {
      width: '500px',
      data: {
        component: this.addComponent,
        formData: row,
      },
    });

    dialogRef.afterClosed().subscribe((shouldRefresh: boolean) => {
      if (shouldRefresh) {
        this.refresh.emit();
      }
    });
  }

  onSearch(event: Event): void {
    let searchString = (event.target as HTMLInputElement).value.trim();
    this.search.emit(searchString);
  }

  onApplyFilter(): void {
    if (this.minvalue > this.maxvalue) {
      this.toast.error('Minimum price cannot be greater than maximum price.');
      return;
    }
    this.priceFilter.emit({
      min: this.minvalue,
      max: this.maxvalue,
    });
  }

}
