import { Component, inject } from '@angular/core';
import { FullLoadoutForCreate, FullLoadoutForUpdate, LoadoutForCreate, LoadoutForUpdate, toLoadoutForUpdate, toShallowLoadout } from '../../interfaces/loadout';
import { LoadoutService } from '../../services/loadout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreatorComponent } from '../../components/creator/creator.component';
import { map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-edit-loadout',
  standalone: true,
  imports: [CreatorComponent, AsyncPipe],
  templateUrl: './edit-loadout.component.html',
  styleUrl: './edit-loadout.component.css'
})
export class EditLoadoutComponent {
  loadoutService = inject(LoadoutService)
  router = inject(Router)
  route = inject(ActivatedRoute)
  auth = inject(AuthService)

  id = this.route.snapshot.paramMap.get('id') || ''
  loadout$ = this.loadoutService.getCachedLoadout(this.id).pipe(
    startWith(null),
    map(loadoutRes => loadoutRes?.unwrapOr({}) as FullLoadoutForUpdate)
  )

  // possibly unsafe
  userId: string = ''

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user?.sub) {
        this.userId = user.sub
      } else {
        console.error('User is not authenticated')
        this.router.navigate(['/'])
      }
    })
  }

  sendLoadout(loadout: FullLoadoutForCreate) {
    console.log('WE RECEIVED', loadout)

    this.loadoutService.updateLoadout(this.id, toLoadoutForUpdate(toShallowLoadout(loadout))).subscribe({
      next: (updateRes) => updateRes.match(
        (ok) => {
          console.log('Loadout updated:', ok)
          this.loadoutService.setCachedLoadout({ 
            _id: this.id, 
            userId: this.userId,
            ...loadout 
          })
          // toast poup saying that
          this.router.navigate(['/gallery'])
        },
        (err) => {
          console.error(err)
          // popup about the err, maybe reload the page with the loadout data, or redirect, idk
        }
      ),
      error: (error) => {
        console.error('Error updating loadout:', error)
      }
    })
  }
}
