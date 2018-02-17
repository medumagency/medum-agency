import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BootomFooterComponent } from './bootom-footer.component';

describe('BootomFooterComponent', () => {
  let component: BootomFooterComponent;
  let fixture: ComponentFixture<BootomFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BootomFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BootomFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
