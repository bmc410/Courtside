import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  addTeam() {
    this.router.navigateByUrl("/app/tabs/teamdetail/", { skipLocationChange: true })
  }

  itemSelected(item) {
    console.log(item);
  }

}
