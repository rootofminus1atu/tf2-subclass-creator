import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponCardComponent } from './weapon-card.component';

describe('WeaponCardComponent', () => {
  let component: WeaponCardComponent;
  let fixture: ComponentFixture<WeaponCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
