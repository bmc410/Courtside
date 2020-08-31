import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ConferenceData } from 'src/app/providers/conference-data';
import { Platform } from '@ionic/angular';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  public semSelected:any; 
  player:MatchUser;
  player1:MatchUser;
  
  compareFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareFn;

  
  
  users: MatchUser[] = [
    {
      id: 1,
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  users1: MatchUser[] = [
    {
      id: 1,
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: 2,
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: 3,
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform) {}

  ngOnInit() {

  }


  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    let isDark = false;
    let style = [];
    
    
  }

  pickUser(e) {
    if (this.users.find(i => i.id === Number(e.detail.value))) {
    this.player = this.users.find(i => i.id === Number(e.detail.value.id));
    }
  }

  pickUser1(e) {
    if (this.users1.find(i => i.id === Number(e.detail.value))) {
      this.player1 = this.users1.find(i => i.id === Number(e.detail.value));
    }
  }

 
}

export class MatchUser {
  id: number
  first: string
  last: string
}



