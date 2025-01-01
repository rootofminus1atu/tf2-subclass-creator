import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLoadoutComponent } from './edit-loadout.component';

describe('EditLoadoutComponent', () => {
  let component: EditLoadoutComponent;
  let fixture: ComponentFixture<EditLoadoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLoadoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLoadoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
