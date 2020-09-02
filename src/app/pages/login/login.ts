import { Component, NgZone } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  error: string;
  checked = false;
  switchtitle = "Use Offline"

  constructor(
    public userData: UserData,
    private auth: AuthenticateService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private _ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      isChecked: false
    });

    this.networkService.currentStatus.subscribe(result => {
      this.checked = result
      if (result == true) {
        this.switchtitle = "Offline Mode"
      } else {
        this.switchtitle = "Use Offline"
      }
      this.loginForm.patchValue({
        isChecked: result
      });
    })

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;

    await this.authenticationService.login(this.f.username.value, this.f.password.value).then(result => {
          if (result.length > 0) {
              this._ngZone.run(() => {
                  this.router.navigate(['/app/tabs/teams']);
              });
          } else {
              this.error = "Invalid Credentials"
              this.loading = false;
          }
      })
  }

  async onLogin(form: NgForm) {
    this.submitted = true;

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    await this.authenticationService.login(this.f.username.value, this.f.password.value).then(result => {
      if (result.length > 0) {
        this._ngZone.run(() => {
          this.router.navigate([this.returnUrl]);
        });
      } else {
        this.error = "Invalid Credentials"
        this.loading = false;
      }
    })


    if (form.valid) {
      this.auth.setLoggedIn(true)
      this.router.navigateByUrl('/');
    }
  }


}
