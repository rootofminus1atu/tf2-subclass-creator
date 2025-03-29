import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FullLoadout } from '../../interfaces/loadout';
import { ItemSlot, Merc } from '../../interfaces/weapon';
import { WeaponCardComponent } from '../weapon-card/weapon-card.component';
import { MatIconModule } from '@angular/material/icon';
import { FavsService } from '../../services/favs.service';

@Component({
  selector: 'app-loadout-card',
  imports: [WeaponCardComponent, MatIconModule],
  templateUrl: './loadout-card.component.html',
  styleUrl: './loadout-card.component.css'
})
export class LoadoutCardComponent {
  loadout = input.required<FullLoadout>()
  favoriteToggled = output<string>()

  slots = Object.values(ItemSlot)
  private favsService = inject(FavsService)
  isToggling = signal(false)

  // ngOnInit() {
  //   console.log(this.loadout())
  //   this.localFavorited.set(this.loadout().isFavorited)
  // }

  toggleFavorite(event: Event) {
    event.stopPropagation();
    if (this.isToggling()) return;

    this.isToggling.set(true);
    this.favsService.toggleFav(this.loadout()._id).subscribe({
      next: (result) => result.match(
        () => {
          this.favoriteToggled.emit(this.loadout()._id); // Emit event to parent
        },
        (err) => console.error('Failed to toggle favorite:', err)
      ),
      complete: () => this.isToggling.set(false)
    });
  }

  // toggleFavorite(event: Event) {
  //   event.stopPropagation()
  //   if (this.isToggling()) return

  //   this.isToggling.set(true)
    
  //   this.favsService.toggleFav(this.loadout()._id).subscribe({
  //     next: (result) => result.match(
  //       (ok) => {
  //         // The service handles cache updates, just need to trigger change detection
  //         this.localFavorited.update(current => !current)
  //         console.log('favorite toggles successfully')
  //       },
  //       (err) => console.error('Failed to toggle favorite:', err)
  //     ),
  //     complete: () => this.isToggling.set(false)
  //   })
  // }

  getMercFullImg(merc: Merc) {
    return `/assets/images/main-menu/${merc}.png`
  }
}
