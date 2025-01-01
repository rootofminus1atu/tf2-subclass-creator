import { Injectable } from '@angular/core';
import { ItemSlot, Merc, Weapon } from '../interfaces/weapon';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { FullLoadout, FullLoadoutForCreate, Loadout, LoadoutForCreate, LoadoutForUpdate } from '../interfaces/loadout';
import { inject } from '@angular/core';
import { err, ok, Result } from 'neverthrow';
import { okify } from '../utils';
import { environment } from '../../environments/environment.development';

interface SuccessResponse {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class LoadoutService {
  http = inject(HttpClient)

  private loadoutsUri = environment.routes.loadouts
  private uri = (segment: string) => `${this.loadoutsUri}/${segment}`

  private cachedLoadout: FullLoadout | null = null

  getLoadouts(): Observable<Result<FullLoadout[], string>> {
    return this.http.get<FullLoadout[]>(`${this.loadoutsUri}?sort=desc&sortBy=updated`)
      .pipe(
        map(okify),
        catchError(this.handleError)
      )
  }

  getLoadout(id: string): Observable<Result<FullLoadout, string>> {
    return this.http.get<FullLoadout>(this.uri(id))
      .pipe(
        map(okify),
        catchError(this.handleError)
      )
  }

  createLoadout(loadout: LoadoutForCreate): Observable<Result<Loadout, string>> {
    return this.http.post<Loadout>(this.loadoutsUri, loadout)
      .pipe(
        map(okify),
        catchError(this.handleError)
      )
  }

  updateLoadout(id: string, loadout: LoadoutForUpdate): Observable<Result<SuccessResponse, string>> {
    return this.http.put<SuccessResponse>(this.uri(id), loadout)
      .pipe(
        map(okify),
        catchError(this.handleError)
      )
  }

  deleteLoadout(id: string): Observable<Result<SuccessResponse, string>> {
    return this.http.delete<SuccessResponse>(this.uri(id))
      .pipe(
        map(okify),
        catchError(this.handleError)
      )
  }

  setCachedLoadout(loadout: FullLoadout) {
    console.log('caching')
    this.cachedLoadout = loadout
  }

  getCachedLoadout(id: string): Observable<Result<FullLoadout, string>> {
    if (this.cachedLoadout && this.cachedLoadout._id.toString() === id) {
      console.log('getting cached')
      return of(ok(this.cachedLoadout))
    }

    console.log('fetching instead')
    return this.getLoadout(id).pipe(
      tap(result => {
        if (result.isOk()) {
          this.cachedLoadout = result.value
        }
      })
    )
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error.error
    if (error.status === 0) {
      console.error('[LoadoutService]: An error occurred:', msg)
    } else {
      console.error(`[LoadoutService]: Backend returned code ${error.status}, body was:`, msg)
    }
  
    return of(err(msg))
    // return throwError(() => new Error('[LoadoutService]: Something bad happened, please try again later.'))
  }
}
