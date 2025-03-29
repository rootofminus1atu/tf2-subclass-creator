import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { err, ok, Result } from 'neverthrow';
import { User, UserWithLoadouts } from '../interfaces/user';
import { okify } from '../utils';
import { LoadoutService } from './loadout.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient)
  private loadoutService = inject(LoadoutService)
  private readonly usersUri = environment.routes.users


  getUsersWithLoadouts(): Observable<Result<UserWithLoadouts[], string>> {
    return combineLatest([
      this.getUsers(),
      this.loadoutService.getLoadouts()
    ]).pipe(
      map(([usersResult, loadoutsResult]) => {
        if (usersResult.isErr()) return err(usersResult.error)
        if (loadoutsResult.isErr()) return err(loadoutsResult.error)

        const users = usersResult.value
        const loadouts = loadoutsResult.value

        const usersWithLoadouts = users.map(user => ({
          ...user,
          loadouts: loadouts.filter(loadout => loadout.userId === user.user_id)
        }))

        console.log(usersWithLoadouts)

        return ok(usersWithLoadouts)
      })
    )
  }

  getUsers(): Observable<Result<User[], string>> {
    return this.http.get<User[]>(this.usersUri).pipe(
      map(okify),
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error.error
    if (error.status === 0) {
      console.error('[AdminService]: An error occurred:', msg)
    } else {
      console.error(`[AdminService]: Backend returned code ${error.status}, body was:`, msg)
    }
    return of(err(msg))
  }
}
