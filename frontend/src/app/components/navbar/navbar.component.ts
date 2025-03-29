import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthButtonComponent } from "../auth-button/auth-button.component";
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, AuthButtonComponent, AuthButtonComponent, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  auth = inject(AuthService)
  isNavbarCollapsed = true

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true
  }
}
