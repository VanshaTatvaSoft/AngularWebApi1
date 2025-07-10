import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '../../shared/services/storage';

@Component({
  selector: 'app-main-layout.component',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(private router: Router, private toast: ToastrService, private storageService: Storage) {}

  logout(): void {
    this.storageService.removeItem('access_token');
    this.storageService.removeItem('refresh_token');
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    this.toast.success("Logout success")
    this.router.navigate(['/login']);
  }
}
