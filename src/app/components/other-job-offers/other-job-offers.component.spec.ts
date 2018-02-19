import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherJobOffersComponent } from './other-job-offers.component';

describe('OtherJobOffersComponent', () => {
  let component: OtherJobOffersComponent;
  let fixture: ComponentFixture<OtherJobOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherJobOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherJobOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
