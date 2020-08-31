import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private auth: AuthenticateService, private router: Router) { }

  canActivate(): boolean {
    let value = this.auth.isAuthenticated()
    if (!value) {
      // initially was just redirecting here, but following the
      // documentation I updated code to return a UrlTree
      this.router.navigateByUrl("/login", { skipLocationChange: true })

      //return this.router.parseUrl("/login");
    }
    return value
  }
}
