import { Component, inject } from '@angular/core';
import { LoadoutService } from '../../services/loadout.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { catchError, ignoreElements, of, startWith } from 'rxjs';

@Component({
  selector: 'app-loadout-details',
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './loadout-details.component.html',
  styleUrl: './loadout-details.component.css'
})
export class LoadoutDetailsComponent {
  loadoutService = inject(LoadoutService)
  route = inject(ActivatedRoute)

  loadout$ = this.loadoutService.getCachedLoadout(this.route.snapshot.paramMap.get('id') || '').pipe(
    startWith(null),
  )
}
