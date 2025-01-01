import { Component, input } from '@angular/core';
import { FullLoadout } from '../../interfaces/loadout';
import { ItemSlot, Merc } from '../../interfaces/weapon';
import { WeaponCardComponent } from '../weapon-card/weapon-card.component';

@Component({
  selector: 'app-loadout-card',
  imports: [WeaponCardComponent],
  templateUrl: './loadout-card.component.html',
  styleUrl: './loadout-card.component.css'
})
export class LoadoutCardComponent {
  loadout = input.required<FullLoadout>()
  slots = Object.values(ItemSlot)

  getMercFullImg(merc: Merc) {
    return `/assets/images/main-menu/${merc}.png`
  }
}
