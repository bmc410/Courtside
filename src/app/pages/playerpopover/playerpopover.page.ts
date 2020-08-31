import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-playerpopover',
  templateUrl: './playerpopover.page.html',
  styleUrls: ['./playerpopover.page.scss'],
})
export class PlayerpopoverPage implements OnInit {
  items: any; // = [{title:"Settings",id:1},{title:"Logout",id:2},{title:"Profile",id:3},{title:"Help",id:4}]
  constructor(public navParams: NavParams, private popover:PopoverController) { 
    this.items = this.navParams.get('data');
  }

  ngOnInit() {
        
  }

  dismiss(item)
   {
     this.popover.dismiss(item);
   }

}
