import { ContentObserver } from '@angular/cdk/observers';
import { AsyncPipe, CommonModule, DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css'
})
export class AuthButtonComponent {
  auth = inject(AuthService)
  document = inject(DOCUMENT)

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      console.log('isAuthenticated:', isAuthenticated);
    })
  }
}
