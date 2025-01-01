import { Injectable } from '@angular/core';
import { Weapon } from '../interfaces/weapon';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { err, ok, Result } from 'neverthrow';
import { okify } from '../utils';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {
  private weaponsUri = environment.routes.weapons
  private weapons: Result<Weapon[], string> = ok([])
  
  constructor(private http: HttpClient) { }

  getWeapons(): Observable<Result<Weapon[], string>> {
    if (this.weapons.isOk() && this.weapons.value.length > 0) {
      return of(this.weapons)
    }

    return this.http.get<Weapon[]>(this.weaponsUri)
      .pipe(
        map(okify),
        tap(result => {
          if (result.isOk()) {
            this.weapons = result;
          }
        }),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error.error
    if (error.status === 0) {
      console.error('[WeaponService]: An error occurred:', msg)
    } else {
      console.error(`[WeaponService]: Backend returned code ${error.status}, body was: ${msg}`)
    }

    // return throwError(() => new Error('[WeaponService]: Something bad happened, please try again later.'))
    return of(err(msg))
  }
}
