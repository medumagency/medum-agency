import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';

import 'rxjs/add/operator/map';

@Injectable()
export class AdminGuardGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return new Promise(resolve => {
      this.authService.user.subscribe(isLogged => {
        if (!isLogged) {
          console.log('access denied');
          this.router.navigate(['']);
        }
        resolve(!!isLogged);
      });
    });
  }
}
