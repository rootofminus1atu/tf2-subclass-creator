import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MatIcon } from '@angular/material/icon';
import { environment } from '../environments/environment';

declare var gtag: Function

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MatIcon],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TF2SC';
  

  constructor(public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log(event.urlAfterRedirects)
        gtag('config', environment.analytics, { 'page_path': event.urlAfterRedirects })
      }
    })
  }
}
