import { Component, HostListener, NgZone } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { filter } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
  animations: [
    trigger('changeDivSize', [
      state('initial', style({
        backgroundColor: 'green',
        width: '100px',
        height: '100px'
      })),
      state('final', style({
        backgroundColor: 'red',
        width: '200px',
        height: '200px'
      })),
      transition('initial=>final', animate('1500ms')),
      transition('final=>initial', animate('1000ms'))
    ]),

    trigger('balloonEffect', [
      state('initial', style({
        backgroundColor: 'green',
        transform: 'scale(1)'
      })),
      state('final', style({
        backgroundColor: 'red',
        transform: 'scale(1.5)'
      })),
      transition('final=>initial', animate('1000ms')),
      transition('initial=>final', animate('1500ms'))
    ]),

    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),

    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
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
  filled: boolean[] = [];
  empty: boolean[] = [];
  wrong: boolean[] = [];
  number: boolean[] = [];
  numbergrow: boolean[] = [];
  numbergrowstring: string[] = [];
  currentState: string[] =  [];
  animated: boolean[] = [];
  pincode: string = ""
  dotanimated = false
  key:any

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

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(Number.isInteger(Number(event.key)))
    {
      this.enterchar(event.key)
    }
  }
  
  ionViewDidEnter() {
    for (let index = 0; index < 4; index++) {
      this.empty[index] = true;
      this.filled[index] = false;
      this.wrong[index] = false;
    }

    for (let index = 0; index < 10; index++) {
      this.animated[index] = false;
      this.number[index] = true;
      this.numbergrow[index] = false;
      this.numbergrowstring[index] = "number"

    }

    // this.loginForm = this.formBuilder.group({
    //   username: ['', Validators.required],
    //   password: ['', Validators.required],
    //   isChecked: false
    // });
  }

  ngOnInit() {

    for (let index = 0; index < 4; index++) {
      this.empty[index] = true;
      this.filled[index] = false;
      this.wrong[index] = false;
    }

    for (let index = 0; index < 10; index++) {
      this.animated[index] = false;
      this.number[index] = true;
      this.numbergrow[index] = false;
      this.numbergrowstring[index] = "number"

    }

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

  // async onSubmit() {
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.loginForm.invalid) {
  //       return;
  //   }

  //   this.loading = true;

  //   // await this.authenticationService.login(this.f.username.value, this.f.password.value).then(result => {
  //   //       if (result.length > 0) {
  //   //           // this.loginForm.controls['username'].setValue("");
  //   //           // this.loginForm.controls['password'].setValue("");
  //   //           this._ngZone.run(() => {
  //   //               this.router.navigate(['/app/tabs/teams']);
  //   //           });
  //   //       } else {
  //   //           this.error = "Invalid Credentials"
  //   //           this.loading = false;
  //   //       }
  //   //   })
  // }

  renderDotClass(index) {
    if(this.filled[index] == true ) {
      return "dotfilled"
    } else if(this.empty[index] == true ) {
      return "dot"
    } else if(this.wrong[index] == true ) {
      return "dot animated-dot"
    } else {
      return 'dot'
    }
  }

  renderNumberClass(index) {
      return this.numbergrowstring[index]
  }

  async enterchar(e) {
    this.pincode += e
    this.filled[this.pincode.length -1] = true;
    this.empty[this.pincode.length -1] = false;
    this.wrong[this.pincode.length -1] = false;
    if(this.pincode.length >= 4 ) {
      await this.authenticationService.login(this.pincode).then(result => {
        this.pincode = ""
        if (result.length > 0) {
            this._ngZone.run(() => {
              this.router.navigate([this.returnUrl]);
            });
          } else {
            
            this.dotanimated = true
            for (let index = 0; index < 4; index++) {
              this.filled[index] = false
              this.empty[index] = false
              this.wrong[index] = true
            }
            setTimeout(()=>{                           
              this.filled = [];
              this.wrong = [];
              for (let index = 0; index < 4; index++) {
                this.filled[index] = false
                this.empty[index] = true
                this.wrong[index] = true
              }
            }, 500);
          }
        })
    }
  }

  async change(e) {
    this.animate(+e.srcElement.innerHTML - 1)
    this.enterchar(+e.srcElement.innerHTML)
  }

  async onLogin(form: NgForm) {
    this.submitted = true;

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    //await this.authenticationService.login(this.f.username.value, this.f.password.value).then(result => {
    await this.authenticationService.login(this.pincode).then(result => {
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

  changeState() {
    //this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }

  animate(e) {
    this.animated[e] = true;
    this.delay(500).then(() => this.animated[e] = false);
  }

  animatedot(e) {
    this.dotanimated = true;
    this.delay(500).then(() => this.dotanimated = false);
  }
  
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

}
