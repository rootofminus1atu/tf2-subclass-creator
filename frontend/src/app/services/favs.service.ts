import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Result, err, ok } from 'neverthrow';
import { okify } from '../utils';

interface SuccessResponse {
  message: string
}

@Injectable({
  providedIn: 'root'
})
export class FavsService {
  private favsUri = environment.routes.favs

  constructor(private http: HttpClient) { }

  toggleFav(loadoutId: string): Observable<Result<SuccessResponse, string>> {
    return this.http.post<SuccessResponse>(`${this.favsUri}/${loadoutId}`, {})
      .pipe(
        map(okify),
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    const msg = error.error.message
    if (error.status === 0) {
      console.error('[FavsService]: An error occurred:', msg)
    } else {
      console.error(`[FavsService]: Backend returned code ${error.status}, body was:`, msg)
    }
  
    return of(err(msg))
  }
}
