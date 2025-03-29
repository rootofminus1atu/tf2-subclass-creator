import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FavsService } from '../../services/favs.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MatButton, MatIcon, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  favsService = inject(FavsService)

  ngOnInit() {
    // silly way but well guess it'd work? maybe?
    console.log('in dev 26/03/2025')
  }
}
