import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '../../shared/services/storage';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-main-layout.component',
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  userName = '';
  constructor(private router: Router, private toast: ToastrService, private storageService: Storage,private auth: AuthService) {
    this.auth.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  ngOnDestroy(): void {
    console.log('Main Layout Component destroyed');
  }

  logout(): void {
    this.storageService.removeItem('access_token');
    this.storageService.removeItem('refresh_token');
    this.toast.success("Logout success")
    this.router.navigate(['/login']);
  }
}
