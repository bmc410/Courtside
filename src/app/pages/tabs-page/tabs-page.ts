import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage  implements OnInit {

  isadmin: boolean = false;

  constructor(private auth: AuthenticationService) {
   
  }

  ngOnInit() {
    this.isadmin = this.auth.isAdmin()
  }

}
