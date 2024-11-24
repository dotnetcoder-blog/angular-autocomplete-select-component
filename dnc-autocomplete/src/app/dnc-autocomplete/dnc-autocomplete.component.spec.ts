import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DncAutocompleteComponent } from './dnc-autocomplete.component';

describe('DncAutocompleteComponent', () => {
  let component: DncAutocompleteComponent;
  let fixture: ComponentFixture<DncAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DncAutocompleteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DncAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
