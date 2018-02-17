import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core';

@Directive({
  selector: '[appCustomCircle]'
})
export class CustomCircleDirective implements OnInit{
  @Input() defaultColor: string;

  constructor(private el: ElementRef,
              private renderer: Renderer) {
  }

  ngOnInit() {
    this.createCustomCircle();
  }

  createCustomCircle() {
    this.renderer.setElementStyle(this.el.nativeElement, 'backgroundColor', this.defaultColor || '#3b5998');
    this.renderer.setElementStyle(this.el.nativeElement, 'width', '33.33px');
    this.renderer.setElementStyle(this.el.nativeElement, 'height', '33.33px');
    this.renderer.setElementStyle(this.el.nativeElement, 'borderRadius', '50%');
    this.renderer.setElementStyle(this.el.nativeElement, 'margin', '10px');
    this.renderer.setElementStyle(this.el.nativeElement, 'paddingTop', '5px');
    this.renderer.setElementStyle(this.el.nativeElement, 'boxShadow', '0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15)');
  }

}
