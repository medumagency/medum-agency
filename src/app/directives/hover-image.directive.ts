import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHoverImage]',
})
export class HoverImageDirective {
  public _element: any;
  @Input('color') public color: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this._element, 'cursor', 'pointer');
    this.renderer.setStyle(this._element, 'color', this.color);
    this.renderer.addClass(this._element, 'grow');

  }
  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this._element, 'color', '#666f9a');
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this._element = el.nativeElement;
  }
}
