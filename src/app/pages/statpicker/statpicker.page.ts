import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/matchservice';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { Platform, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-statpicker',
  templateUrl: './statpicker.page.html',
  styleUrls: ['./statpicker.page.scss'],
})
export class StatpickerPage implements OnInit {
  context: any;

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { 
      this.matchService.loadMatches()
      this.route.queryParams.subscribe(params => {
        this.context = params['context'];
      })
    }

  ngOnInit() {

  }

  IS() {
    this.router.navigate(['/app/tabs/stats/statpicker/individualstats'], { queryParams: { context: this.context} });
  }

  PBP() {
    this.router.navigate(['/app/tabs/stats/statpicker/playbyplay'], { queryParams: { context: this.context } });
  }

  MS() {
    this.router.navigate(['/app/tabs/stats/matchsummary'], { queryParams: { context: this.context } });
  }

  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];

  logoff() {
      this.authenticationService.logout();
      //window.location.href = '/login';
      this.router.navigate(['/login']);
  }

}
