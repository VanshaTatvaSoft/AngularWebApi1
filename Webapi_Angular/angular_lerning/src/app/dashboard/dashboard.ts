import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '../shared/services/jwt-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  userName: string | null;
  constructor(private auth: AuthService, private jwt: JwtService){
    this.userName = this.jwt.getUserName();
    this.auth.setUserName(this.userName);
  }
}
