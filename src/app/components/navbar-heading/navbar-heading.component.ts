import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-heading',
  templateUrl: './navbar-heading.component.html',
  styleUrls: ['./navbar-heading.component.scss']
})
export class NavbarHeadingComponent implements OnInit {

  public selectedLang = 0;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private router: Router,
              public authService: AuthService) {
  }

  ngOnInit() {
    document.addEventListener('click', this.offClickHandler);
  }

  offClickHandler = (event: any) => {
    if (!this.el.nativeElement.contains(event.target)) { // check click origin
      const dropdown = this.el.nativeElement.querySelector('.navbar-collapse');

      if (dropdown.classList.contains('show')) {
        this.el.nativeElement.querySelector('.navbar-toggler').click();
      }
    }
  }

  selectLang(index) {
    this.selectedLang = index;
  }

  isSelected(index) {
    return this.selectedLang === index;
  }

  login(f: NgForm, form: any) {
    this.authService.login(f.value.email, f.value.password).then((isLogged) => {
        if (isLogged) {
          form.hide();
          f.resetForm();
          this.router.navigate(['admin']);
        }
    });
  }

  logout() {
    this.authService.logout();
  }
}
