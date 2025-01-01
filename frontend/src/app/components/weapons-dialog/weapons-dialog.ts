import { AsyncPipe, JsonPipe } from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DialogData } from '../creator/creator.component';
import { WeaponService } from '../../services/weapon.service';
import { combineLatest, map } from 'rxjs';
import { weaponFilter } from '../../interfaces/weapon';
import { WeaponCardComponent } from '../weapon-card/weapon-card.component';




@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'weapons-dialog.html',
  styleUrl: 'weapons-dialog.css',
  imports: [MatDialogModule, MatButtonModule, AsyncPipe, WeaponCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeaponSelectDialog {
  data = inject<DialogData>(MAT_DIALOG_DATA)
  weaponService = inject(WeaponService)

  weapons$ = this.weaponService.getWeapons()
  displayedWeapons$ = this.weapons$.pipe(
    map(weaponsRes => (
      weaponsRes.map(weapons => {
        const { merc, slot } = this.data
        return weapons.filter(weaponFilter(merc, slot))
      })
    ))
  )
}
