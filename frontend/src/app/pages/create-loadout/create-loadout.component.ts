import { Component, inject } from '@angular/core';
import { CreatorComponent } from "../../components/creator/creator.component";
import { LoadoutService } from '../../services/loadout.service';
import { FullLoadoutForCreate, FullLoadoutForUpdate, LoadoutForCreate, LoadoutForUpdate, toShallowLoadout } from '../../interfaces/loadout';
import { Merc, Weapon } from '../../interfaces/weapon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-loadout',
  standalone: true,
  imports: [CreatorComponent],
  templateUrl: './create-loadout.component.html',
  styleUrl: './create-loadout.component.css'
})
export class CreateLoadoutComponent {
  loadoutService = inject(LoadoutService)
  router = inject(Router)

  // for testing purposes only
  initialLoadout = { 
    name: "asdjhkajdhs",
    merc: Merc.Spy,
    secondary: {
      "_id": 210,
      "name": "Revolver",
      "stock": true,
      "item_name": "#TF_Weapon_Revolver",
      "item_slot": "secondary",
      "image_url": "http://media.steampowered.com/apps/440/icons/w_revolver.9b4a43c8ce5797a08d0dfb5d9d5bfb1b90928008.png",
      "image_url_large": "http://media.steampowered.com/apps/440/icons/w_revolver_large.86226aa2ce07b33864b848add4a4e4f4771ffc18.png",
      "used_by_classes": [
        "Spy"
      ],
      "id": 210
    } as Weapon
  }

  sendLoadout(loadout: FullLoadoutForCreate) {
    console.log('WE RECEIVED', loadout)

    this.loadoutService.createLoadout(toShallowLoadout(loadout)).subscribe({
      next: (createdLoadoutRes) => createdLoadoutRes.match(
        (createdLoadout) => {
          console.log('Loadout created:', createdLoadout)
          this.router.navigate(['/gallery'])
        },
        (err) => {
          console.error(err)
          // popup about the err, maybe reload the page with the loadout data, or redirect, idk
        }
      ),
      error: (error) => {
        console.error('Error creating loadout:', error)
      }
    })
  }
}
