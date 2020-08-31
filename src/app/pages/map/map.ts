import { Component, ElementRef, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { darkStyle } from './map-dark-style';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapElement: ElementRef;
  public semSelected:any; 
  location = 'madison';
  users: any[] = [
    {
      id: '1',
      first: 'Alice',
      last: 'Smith',
    },
    {
      id: '2',
      first: 'Bob',
      last: 'Davis',
    },
    {
      id: '3',
      first: 'Charlie',
      last: 'Rosenburg',
    }
  ];

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform) {}

    

  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    let isDark = false;
    let style = [];
    if (appEl.classList.contains('dark-theme')) {
      style = darkStyle;
    }
    
  }

  alert(e) {
    this.semSelected = e.detail.value;
    console.log(e)
  }

  compareWithFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareWithFn;

}



