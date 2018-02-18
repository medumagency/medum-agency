import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperationFormComponent } from './cooperation-form.component';

describe('CooperationFormComponent', () => {
  let component: CooperationFormComponent;
  let fixture: ComponentFixture<CooperationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CooperationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
