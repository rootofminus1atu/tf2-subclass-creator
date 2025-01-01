import { Component, input } from '@angular/core';
import { Weapon } from '../../interfaces/weapon';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-weapon-card',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './weapon-card.component.html',
  styleUrl: './weapon-card.component.css'
})
export class WeaponCardComponent {
  weapon = input.required<Weapon | null>()
  active = input<boolean>()
  fallbackText = input<string>()
  scale = input<number>()
  editable = input<boolean>()

  baseWidth = 12
  baseHeight = 8
}
