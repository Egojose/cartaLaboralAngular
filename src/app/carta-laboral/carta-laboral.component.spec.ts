import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaLaboralComponent } from './carta-laboral.component';

describe('CartaLaboralComponent', () => {
  let component: CartaLaboralComponent;
  let fixture: ComponentFixture<CartaLaboralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartaLaboralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartaLaboralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
