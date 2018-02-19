import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryJobOffersComponent } from './country-job-offers.component';

describe('CountryJobOffersComponent', () => {
  let component: CountryJobOffersComponent;
  let fixture: ComponentFixture<CountryJobOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryJobOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryJobOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
