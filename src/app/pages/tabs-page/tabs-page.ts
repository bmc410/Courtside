import { Component, OnInit } from '@angular/core';
import { app } from 'firebase';
import { AppStateService } from 'src/app/services/app-state-service.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage  implements OnInit {

  isadmin: boolean = false;
  showTabs: boolean = true;

  constructor(private auth: AuthenticationService,
    private appstate: AppStateService) {
  }

  

  ngOnInit() {
    this.isadmin = this.auth.isAdmin()
    //this.showTabs = this.a.showTabs()
    // this.appstate.onOrientationChange().subscribe(
    //   res => {
    //     console.log('message', res);
    //   }
    // )

    this.appstate.data?.subscribe(val => {
      console.log(val)
      this.showTabs = val
    });
  
  }

}
