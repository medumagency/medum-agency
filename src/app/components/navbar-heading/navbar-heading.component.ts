import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-heading',
  templateUrl: './navbar-heading.component.html',
  styleUrls: ['./navbar-heading.component.scss']
})
export class NavbarHeadingComponent implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {
  }

  ngOnInit() {
    document.addEventListener('click', this.offClickHandler); // bind on doc
  }

  offClickHandler = (event: any) => {
    if (!this.el.nativeElement.contains(event.target)) { // check click origin
      const dropdown = this.el.nativeElement.querySelector('.navbar-collapse');

      if (dropdown.classList.contains('show')) {
        this.el.nativeElement.querySelector('.navbar-toggler').click();
      }
    }
  }
}
