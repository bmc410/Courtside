import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ConferenceData } from 'src/app/providers/conference-data';
import { Platform } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { PlayerpopoverPage } from '../playerpopover/playerpopover.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  public semSelected: any;
  player: MatchUser;
  player1: MatchUser;
  playerPos1 = "Select Player";
  playerPos2 = "Select Player";
  playerPos3 = "Select Player";
  playerPos4 = "Select Player";
  playerPos5 = "Select Player";
  playerPos6 = "Select Player";


  compareFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareFn;



  users: MatchUser[] = [];
  allUsers: MatchUser[] = [];

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { }

  ngOnInit() {
    this.users = [
    {
      id: 1,
      first: 'Alice',
      last: 'Fraggle',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Deremer',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    },
    {
      id: 4,
      first: 'Ted',
      last: 'Allo',
    },
    {
      id: 5,
      first: 'Bill',
      last: 'McCoy',
    },
    {
      id: 6,
      first: 'Dave',
      last: 'Smith',
    },
    {
      id: 7,
      first: 'Willow',
      last: 'Remrert',
    },
    {
      id: 8,
      first: 'Syd',
      last: 'Golith',
    },
    {
      id: 9,
      first: 'Alex',
      last: 'Futile',
    }
  
  
  ]
    this.allUsers = this.users.slice()

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
      this.router.navigate(['/login']);
  }


  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    let isDark = false;
    let style = [];


  }

  async showPopover(ev: any) {
    let id = ev.target.id
    const modal = await this.popover.create({
      component: PlayerpopoverPage,
      event: ev,
      translucent: true,
      componentProps: { data: this.users }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        switch (id) {
          case "1":
            this.playerPos1 = this.allUsers.filter(x => x.id == dataReturned.data.id)[0].first
            break;
          case "2":
            this.playerPos2 = this.allUsers.filter(x => x.id == dataReturned.data.id)[0].first
            break;
          case "3":
            this.playerPos3 = this.allUsers.filter(x => x.id == dataReturned.data.id)[0].first
            break;
          case "4":
            this.playerPos4 = this.allUsers.filter(x => x.id == dataReturned.data.id)[0].first
            break;
          case "5":
            this.playerPos5 = this.allUsers.filter(x => x.id == dataReturned.data.id)[0].first
            break;
          case "6":
            this.playerPos6 = this.allUsers.filter(x => x.id == dataReturned.data.id)[0].first
            break;
          default:
            break;
        }
        this.users = this.allUsers.filter(x => x.id != dataReturned.data.id)
        //console.log('Modal Sent Data :' + dataReturned.data.id);
      }
    });
    return await modal.present();
  }





}

export class MatchUser {
  id: number
  first: string
  last: string
}



