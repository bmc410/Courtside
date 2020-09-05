import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { AuthenticationService } from './services/authentication.service';
import { NetworkService } from './services/network.service';
import { OfflineService } from './services/offline.service';
import { MatchService } from './services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { IPlayers } from './models/dexie-models';
import { Guid } from 'guid-typescript';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  currentUser: any;
  offline: any;
  players: IPlayers[] = []
  isConnected = true;
  status = 'ONLINE';
  // appPages = [
  //   {
  //     title: 'Schedule',
  //     url: '/app/tabs/schedule',
  //     icon: 'calendar'
  //   },
  //   {
  //     title: 'Speakers',
  //     url: '/app/tabs/speakers',
  //     icon: 'people'
  //   },
  //   {
  //     title: 'Map',
  //     url: '/app/tabs/map',
  //     icon: 'map'
  //   },
  //   {
  //     title: 'About',
  //     url: '/app/tabs/about',
  //     icon: 'information-circle'
  //   }
  // ];
  loggedIn = false;
  dark = false;

  constructor(
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineService: OfflineService,
    private matchService: MatchService,
    // private connectionService: ConnectionService,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
  ) {
    this.initializeApp();
  }

  async ngOnInit() {

    this.networkService.HasInternet().subscribe(isConnected => {
      this.isConnected = isConnected;
      console.log(isConnected)
      if (this.isConnected) {
        this.status = "ONLINE";
      }
      else {
        this.status = "OFFLINE";
      }
    })

    var status = this.networkService.getlaststatus();
    if(status == true) {
      this.networkService.NetworkChange(status)
    }
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.networkService.currentStatus.subscribe(x => this.offline = x);

    this.offlineService.getPlayers().subscribe(result => {
      this.players = result
    })
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
