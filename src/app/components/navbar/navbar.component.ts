import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public apiService: ApiService) {}

  logout() {
    this.apiService.logout();
    window.location.reload();
  }

  onLogout() {
    this.logout();
  }
}