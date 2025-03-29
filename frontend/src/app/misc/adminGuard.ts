import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export const adminGuard = () => {
  const auth = inject(AuthService)
  const router = inject(Router)

  return auth.user$.pipe(
    map(user => {
      const roles = user?.['https://tf2sc/roles'] as string[] | undefined
      const isAdmin = roles?.includes('admin') ?? false

      if (!isAdmin) {
        router.navigate(['/'])
        return false
      }

      return true
    })
  );
};