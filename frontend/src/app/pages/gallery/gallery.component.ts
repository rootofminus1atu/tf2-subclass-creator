import { Component, inject, signal } from '@angular/core';
import { LoadoutService } from '../../services/loadout.service';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Result } from 'neverthrow';
import { FullLoadout, Loadout } from '../../interfaces/loadout';
import { BehaviorSubject, combineLatest, map, Observable, startWith, switchMap } from 'rxjs';
import { LoadoutCardComponent } from "../../components/loadout-card/loadout-card.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@auth0/auth0-angular';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [AsyncPipe, LoadoutCardComponent, MatButtonModule, MatIcon, RouterLink, MatCheckboxModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  loadoutService = inject(LoadoutService)
  router = inject(Router)
  auth = inject(AuthService)
  
  // private refreshTrigger = new BehaviorSubject<void>(undefined)
  private yourLoadoutsCheckbox = new BehaviorSubject<boolean>(false)
  private favoritedCheckbox = new BehaviorSubject<boolean>(false)
  private localLoadouts = new BehaviorSubject<FullLoadout[]>([])
  errorMessage = signal<string | null>(null)

  // loadouts$ = this.refreshTrigger.pipe(
  //   switchMap(() => this.loadoutService.getLoadouts()),
  //   startWith(null)
  // )
  ngOnInit() {
    this.loadoutService.getLoadouts().subscribe(result => {
      result.match(
        loadouts => {
          this.localLoadouts.next(loadouts)
          this.errorMessage.set(null)
        },
        error => {
          console.error('Error fetching loadouts:', error)
          this.errorMessage.set("Failed to fetch loadouts.")
        }
      )
    })
  }

  // displayedLoadouts$ = combineLatest([this.loadouts$, this.yourLoadoutsCheckbox, this.auth.user$]).pipe(
  //   map(([loadoutsRes, checked, user]) => loadoutsRes?.map(loadouts => 
  //     !checked || !user 
  //       ? loadouts
  //       : loadouts.filter(loadout => loadout.userId === user.sub)
  //   ))
  // )
  displayedLoadouts$ = combineLatest([
    this.localLoadouts.asObservable(),
    this.yourLoadoutsCheckbox,
    this.favoritedCheckbox,
    this.auth.user$
  ]).pipe(
    map(([loadouts, yourLoadoutsChecked, favoritedChecked, user]) => 
      loadouts.filter(l => 
        (!yourLoadoutsChecked || l.userId === user?.sub) &&
        (!favoritedChecked || l.isFavorited)
      )
    )
  )

  onFilterChange(event: MatCheckboxChange) {
    this.yourLoadoutsCheckbox.next(event.checked)
  }

  onFavoriteFilterChange(event: MatCheckboxChange) {
    this.favoritedCheckbox.next(event.checked);
  }

  toggleFavorite(loadoutId: string) {
    console.log('catched with ', loadoutId)
    this.localLoadouts.next(
      this.localLoadouts.value.map(l =>
        l._id === loadoutId ? { ...l, isFavorited: !l.isFavorited } : l
      )
    );
  }

  goToDetails(loadout: FullLoadout) {
    this.loadoutService.setCachedLoadout(loadout)
    this.router.navigate(['/gallery', loadout._id.toString()])
  }

  goToEdit(loadout: FullLoadout) {
    this.loadoutService.setCachedLoadout(loadout)
    this.router.navigate(['/gallery', loadout._id.toString(), 'edit'])
  }

  deleteLoadout(id: string) {
    this.loadoutService.deleteLoadout(id).subscribe({
      next: deletionRes => {
        deletionRes.match(
          success => {
            console.log('loadout deleted', success)
            // this.refreshTrigger.next();
            this.localLoadouts.next(
              this.localLoadouts.value.filter(l => l._id !== id)
            )
          },
          error => {
            console.error('Error deleting loadout:', error)
          }
        )
      }
    })
  }
}
