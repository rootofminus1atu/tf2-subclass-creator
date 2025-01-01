import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { AuthButtonComponent } from "../auth-button/auth-button.component";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, AuthButtonComponent, AuthButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true
  }
}
