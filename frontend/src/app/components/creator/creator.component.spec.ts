import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CreatorComponent } from './creator.component';
import { ItemSlot, Merc } from '../../interfaces/weapon';
import { of } from 'rxjs';
import { WeaponService } from '../../services/weapon.service';

describe('CreatorComponent', () => {
  let component: CreatorComponent;
  let fixture: ComponentFixture<CreatorComponent>;

  // Mock WeaponService to prevent real HttpClient calls
  const mockWeaponService = {
    someMethod: jasmine.createSpy('someMethod').and.returnValue(of(null)), // Mock any used methods
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatorComponent, NoopAnimationsModule],
      providers: [{ provide: WeaponService, useValue: mockWeaponService }], // ✅ Mock service
    }).compileComponents();

    fixture = TestBed.createComponent(CreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('generateKey', () => {
    it('should generate correct key for Scout primary', () => {
      const key = component.generateKey(Merc.Scout, ItemSlot.primary)
      expect(key).toBe('Scout_primary')
    })

    it('should generate correct key for Soldier melee', () => {
      const key = component.generateKey(Merc.Soldier, ItemSlot.melee)
      expect(key).toBe('Soldier_melee')
    })

    it('should generate correct key for Heavy secondary', () => {
      const key = component.generateKey(Merc.Heavy, ItemSlot.secondary)
      expect(key).toBe('Heavy_secondary')
    })
  });
});
