import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthenticateService } from 'src/app/services/authenticate.service';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    private auth: AuthenticateService
  ) { }


  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.auth.setLoggedIn(true)
      this.router.navigateByUrl('/');
    }
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
