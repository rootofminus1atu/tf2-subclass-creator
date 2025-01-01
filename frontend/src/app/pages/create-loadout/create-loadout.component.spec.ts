import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLoadoutComponent } from './create-loadout.component';

describe('CreateLoadoutComponent', () => {
  let component: CreateLoadoutComponent;
  let fixture: ComponentFixture<CreateLoadoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLoadoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLoadoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
