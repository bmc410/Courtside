import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  isLoggedIn = false;
  constructor() { }

  setLoggedIn(_value) {
    this.isLoggedIn = _value;
  }
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }


}
