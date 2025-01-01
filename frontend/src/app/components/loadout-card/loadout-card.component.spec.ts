import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadoutCardComponent } from './loadout-card.component';

describe('LoadoutCardComponent', () => {
  let component: LoadoutCardComponent;
  let fixture: ComponentFixture<LoadoutCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadoutCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadoutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
