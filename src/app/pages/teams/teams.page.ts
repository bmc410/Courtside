import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {

  items: Array<any> = [
    {
      'id': "1",
      'title': "Fusion 17 White",
      'description': 'Fusion 17 White'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  itemSelected(item) {
    console.log(item);
  }

}
