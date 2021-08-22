import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
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
import { AppStateService } from './services/app-state-service.service';


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
    private a:AppStateService  

  ) {
    this.initializeApp();
  }

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    console.log("Leaving now")
  }

  @HostListener('window:orientationchange', [ '$event' ])
  onOrientationChange(event) {
    if(event.target.screen.orientation.angle == 0) {
      this.a.setTabs(true)
    }
    else {
      this.a.setTabs(false)
    }
  }

  async ngOnInit() {
    if (window.innerHeight <= 768) {
      this.a.setTabs(false)
    } else {
      this.a.setTabs(true)  
    }

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
