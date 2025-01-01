import { Component, inject, input, output } from '@angular/core';
import { ItemSlot, Merc, Weapon } from '../../interfaces/weapon';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WeaponService } from '../../services/weapon.service';
import { Validators as v } from '@angular/forms';
import { FullLoadoutForCreate, FullLoadoutForUpdate } from '../../interfaces/loadout';
import { WeaponCardComponent } from "../weapon-card/weapon-card.component";
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WeaponSelectDialog } from '../weapons-dialog/weapons-dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

type MercSlotKey = `${Merc}_${ItemSlot}`
type WeaponStore = Partial<Record<MercSlotKey, Weapon>>

export interface DialogData {
  merc: Merc;
  slot: ItemSlot;
}

@Component({
  selector: 'app-creator',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, WeaponCardComponent, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatIcon, MatButtonModule],
  templateUrl: './creator.component.html',
  styleUrl: './creator.component.css'
})
export class CreatorComponent {
  initialLoadout = input<FullLoadoutForUpdate>()
  formSubmit = output<FullLoadoutForCreate>()

  formBuilder = inject(FormBuilder)
  weaponService = inject(WeaponService)

  private _snackBar = inject(MatSnackBar)
  readonly dialog = inject(MatDialog)
  openDialog(merc: Merc, slot: ItemSlot) {
    const dialogRef = this.dialog.open(WeaponSelectDialog, {
      data: {
        merc,
        slot
      } as DialogData
    });

    dialogRef.afterClosed().subscribe((weapon?: Weapon) => {
      console.log('Dialog weapon:', weapon);
      if (weapon) {
        this.addWeapon(weapon, merc, slot)
      }
    });
  }

  mercOptions: Merc[] = Object.values(Merc)
  slotOptions: ItemSlot[] = Object.values(ItemSlot)

  loadoutForm: FormGroup = this.formBuilder.group({
    merc: [null, v.required],
    name: ['', [v.required, v.minLength(3)]],
    playstyle: ['', [v.required, v.minLength(3)]],
    weaponStore: [{} as WeaponStore]
  }, { validators: this.weaponsValidator()})

  weaponsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const merc = control.get('merc')?.value as Merc
      if (!merc) {
        return null
      }

      const primary = this.getSelectedWeapon(merc, ItemSlot.primary)
      const secondary = this.getSelectedWeapon(merc, ItemSlot.secondary)
      const melee = this.getSelectedWeapon(merc, ItemSlot.melee)

      if (primary && secondary && melee) {
        return null
      }
  
      return { weaponsIncomplete: true }
    }
  }

  get merc(): FormControl<Merc | null> {
    return this.loadoutForm.get('merc') as FormControl<Merc | null>
  }

  get name(): FormControl<string> {
    return this.loadoutForm.get('name') as FormControl<string>
  }

  get playstyle(): FormControl<string> {
    return this.loadoutForm.get('playstyle') as FormControl<string>
  }

  get weaponStore(): FormControl<WeaponStore> {
    return this.loadoutForm.get('weaponStore') as FormControl<WeaponStore>
  }

  ngOnInit() {
    this.setupInitialLoadoutAndFormSync()
  }

  // because sadly `input` isn't called first for some reason
  private setupInitialLoadoutAndFormSync() {
    const initialLoadout = this.initialLoadout() ?? {}
    this.weaponStore.setValue(this.toWeaponStore(initialLoadout))
    const initialMerc = initialLoadout?.merc ?? null
    this.merc.setValue(initialMerc)

    this.name.setValue(initialLoadout?.name || '')

    this.playstyle.setValue(initialLoadout?.playstyle || '')
  }

  /**
   * Used to take the input loadout and save it to a temporary WeaponStore
   */
  private toWeaponStore(loadout: FullLoadoutForUpdate): WeaponStore {
    const weaponStore: WeaponStore = {}

    if (loadout.merc) {
      Object.values(ItemSlot).forEach((slot) => {
        if (loadout[slot]) {
          // technically this.addWeapon could be used but no point in revalidating the form 3 times 
          weaponStore[this.generateKey(loadout.merc as Merc, slot)] = loadout[slot] as Weapon
        }
      })
    }

    return weaponStore
  }
  
  generateKey(merc: Merc, slot: ItemSlot): MercSlotKey {
    return `${merc}_${slot}`
  }

  getSelectedWeapon(merc: Merc | null, slot: ItemSlot): Weapon | null {
    if (!merc) return null
    const key = this.generateKey(merc, slot)
    return this.weaponStore?.value[key] || null
  }

  addWeapon(weapon: Weapon, merc: Merc, slot: ItemSlot) {
    const weaponStore = this.weaponStore.value
    weaponStore[this.generateKey(merc, slot)] = weapon
    this.weaponStore.setValue(weaponStore)

    this.loadoutForm.updateValueAndValidity()
  }

  onSubmit() {
    if (this.loadoutForm.invalid) return

    const merc = this.merc.value as Merc
    const name = this.name.value as string
    const playstyle = this.playstyle.value as string
    
    const loadout = {
      merc,
      primary: this.getSelectedWeapon(merc, ItemSlot.primary)!,
      secondary: this.getSelectedWeapon(merc, ItemSlot.secondary)!,
      melee: this.getSelectedWeapon(merc, ItemSlot.melee)!,
      name,
      playstyle
    }

    this.formSubmit.emit(loadout)
  }

  onMercChange(event: MatSelectChange) {
    const merc = event.value as Merc
    this.merc.setValue(merc)
  }


  popup(msg: string) {
    this._snackBar.open(msg, "Ok")
  }

  slotClick(slot: ItemSlot) {
    if (!this.merc.value) {
      this.popup("Please select a Merc first")
      return
    }

    this.openDialog(this.merc.value as Merc, slot)
  }

  popupIfNecessary() {
    if (this.loadoutForm.invalid) {
      this.popup("Please make sure all 3 weapons are provided")
    }
  }
}
