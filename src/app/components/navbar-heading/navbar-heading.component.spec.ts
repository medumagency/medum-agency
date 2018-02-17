import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarHeadingComponent } from './navbar-heading.component';

describe('NavbarHeadingComponent', () => {
  let component: NavbarHeadingComponent;
  let fixture: ComponentFixture<NavbarHeadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarHeadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
