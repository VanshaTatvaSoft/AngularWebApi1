import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterModule,],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'angular_lerning';

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
}
